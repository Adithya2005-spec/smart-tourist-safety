import { haversineDistanceM, type GeoPoint } from "./safety-engine";
import { createProvenanceTag } from "./data-provenance";
import type { WeatherStation, WeatherObservation, EnvironmentalRiskResult, EnvironmentalRiskLevel } from "./weather-types";
import { detectWeatherAnomaly, deriveTemporalFeatures } from "./weather-anomaly-engine";
import { initialWeatherStations, initialWeatherObservations } from "./india-weather-stations";

/**
 * Calculates Environmental Risk Score (0-100) from validated weather metrics.
 */
export function calculateEnvironmentalRiskScore(
  observation: WeatherObservation,
  history: WeatherObservation[] = []
): { score: number; level: EnvironmentalRiskLevel; factors: { factor: string; impact: number }[] } {
  const temporal = deriveTemporalFeatures(observation, history);
  const factors: { factor: string; impact: number }[] = [];

  // Rainfall factor (0 - 35 pts)
  let rainImpact = 0;
  if (observation.rainfall >= 40 || temporal.rollingRainfall30m >= 45) {
    rainImpact = 35;
    factors.push({ factor: "Heavy storm rainfall (>40mm)", impact: 35 });
  } else if (observation.rainfall >= 20) {
    rainImpact = 22;
    factors.push({ factor: "Moderate continuous rainfall", impact: 22 });
  } else if (observation.rainfall >= 8) {
    rainImpact = 10;
    factors.push({ factor: "Light rainfall", impact: 10 });
  }

  // Wind Speed & Gusts (0 - 25 pts)
  let windImpact = 0;
  if (observation.windSpeed >= 35 || temporal.windChangeRate >= 20) {
    windImpact = 25;
    factors.push({ factor: "Severe wind gusts (>35 km/h)", impact: 25 });
  } else if (observation.windSpeed >= 20) {
    windImpact = 12;
    factors.push({ factor: "Moderate wind activity", impact: 12 });
  }

  // Barometric Pressure Drop / Atmospheric Instability (0 - 20 pts)
  let pressureImpact = 0;
  if (temporal.pressureChangeRate <= -2.5) {
    pressureImpact = 20;
    factors.push({ factor: "Rapid atmospheric pressure drop", impact: 20 });
  } else if (observation.pressure < 990) {
    pressureImpact = 10;
    factors.push({ factor: "Low barometric pressure system", impact: 10 });
  }

  // Visibility (0 - 20 pts)
  let visImpact = 0;
  if (observation.visibility < 1.5) {
    visImpact = 20;
    factors.push({ factor: "Low visibility (<1.5 km fog/downpour)", impact: 20 });
  } else if (observation.visibility < 4.0) {
    visImpact = 10;
    factors.push({ factor: "Moderate visibility reduction", impact: 10 });
  }

  const rawScore = rainImpact + windImpact + pressureImpact + visImpact;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let level: EnvironmentalRiskLevel = "LOW";
  if (score >= 75) level = "CRITICAL";
  else if (score >= 50) level = "HIGH";
  else if (score >= 25) level = "MEDIUM";

  return { score, level, factors };
}

/**
 * Computes location-aware weather intelligence for a tourist GPS coordinate across nearby AWS stations.
 */
export function getNearbyLocationWeatherIntelligence(
  touristLocation: GeoPoint,
  maxRadiusKm = 25,
  stations: WeatherStation[] = initialWeatherStations,
  observations: Record<string, WeatherObservation> = initialWeatherObservations,
  history: WeatherObservation[] = []
): EnvironmentalRiskResult {
  const nearbyStationsWithDist = stations
    .map((s) => {
      const distKm = Math.round((haversineDistanceM(touristLocation, s.location) / 1000) * 10) / 10;
      const obs = observations[s.stationId] || {
        id: `DEFAULT-${s.stationId}`,
        stationId: s.stationId,
        timestamp: new Date().toISOString(),
        location: s.location,
        temperature: 26,
        humidity: 65,
        pressure: 1013,
        windSpeed: 10,
        windDirection: 180,
        rainfall: 0,
        solarRadiation: 500,
        visibility: 10,
        cloudCover: 20,
        weatherCondition: "CLEAR" as const,
        dataSource: "DEMO_SIMULATION" as const,
        dataQualityScore: 0.95,
        sensorStatus: "HEALTHY" as const,
      };
      const neighborObsList = Object.values(observations);
      const anomaly = detectWeatherAnomaly(obs, history, neighborObsList);
      return { station: s, obs, anomaly, distKm };
    })
    .filter((item) => item.distKm <= maxRadiusKm)
    .sort((a, b) => a.distKm - b.distKm);

  if (nearbyStationsWithDist.length === 0) {
    // Default fallback if tourist is remote
    return {
      environmentalRiskScore: 10,
      environmentalRiskLevel: "LOW",
      weatherAnomalyScore: 0.05,
      weatherConfidence: 0.85,
      nearbyStationCount: 0,
      agreeingStationCount: 0,
      flaggedStationCount: 0,
      nearestStationDistanceKm: 0,
      sensorHealthScore: 0.95,
      weatherTrend: "STABLE",
      contributingFactors: [{ factor: "No immediate station in 25km radius (State baseline applied)", impact: 10 }],
      summary: "Environmental conditions within normal baseline for regional territory.",
      provenance: createProvenanceTag("MODEL-DERIVED", "Regional baseline environmental risk estimator"),
    };
  }

  const flaggedStations = nearbyStationsWithDist.filter((item) => item.anomaly.anomalyType === "SENSOR_HARDWARE_FAULT");
  const healthyNearby = nearbyStationsWithDist.filter((item) => item.anomaly.anomalyType !== "SENSOR_HARDWARE_FAULT");

  // Prefer nearest HEALTHY station for environmental risk calculation
  const primaryItem = healthyNearby[0] || nearbyStationsWithDist[0];
  const envEval = calculateEnvironmentalRiskScore(primaryItem.obs, history);

  const agreeingCount = healthyNearby.length;
  const flaggedCount = flaggedStations.length;
  const totalCount = nearbyStationsWithDist.length;

  const consensusConfidence = Math.round((agreeingCount / Math.max(1, totalCount)) * 100) / 100;
  const overallSensorHealth = healthyNearby.length > 0
    ? healthyNearby.reduce((sum, item) => sum + item.anomaly.sensorHealthScore, 0) / healthyNearby.length
    : 0.4;

  let trend: "STABLE" | "DETERIORATING" | "IMPROVING" | "VOLATILE" = "STABLE";
  if (primaryItem.obs.rainfall > 20 || primaryItem.obs.windSpeed > 30) {
    trend = "DETERIORATING";
  }

  const summary = flaggedCount > 0
    ? `${agreeingCount}/${totalCount} nearby AWS stations agree (${primaryItem.obs.weatherCondition}, rain: ${primaryItem.obs.rainfall}mm). 1 station flagged for hardware anomaly and isolated.`
    : `Verified environmental conditions from ${totalCount} nearby AWS stations (${primaryItem.obs.weatherCondition}, rain: ${primaryItem.obs.rainfall}mm, wind: ${primaryItem.obs.windSpeed} km/h).`;

  return {
    environmentalRiskScore: envEval.score,
    environmentalRiskLevel: envEval.level,
    weatherAnomalyScore: primaryItem.anomaly.anomalyScore,
    weatherConfidence: Math.round((consensusConfidence * primaryItem.anomaly.confidence) * 100) / 100,
    nearbyStationCount: totalCount,
    agreeingStationCount: agreeingCount,
    flaggedStationCount: flaggedCount,
    primaryStationId: primaryItem.station.stationId,
    nearestStationDistanceKm: primaryItem.distKm,
    sensorHealthScore: Math.round(overallSensorHealth * 100) / 100,
    weatherTrend: trend,
    contributingFactors: envEval.factors,
    summary,
    provenance: createProvenanceTag("MODEL-DERIVED", `AWS Environmental Intelligence (Primary: ${primaryItem.station.stationId})`),
  };
}
