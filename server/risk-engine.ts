import { RiskFeatures, RiskPrediction, getSeverityBand } from "../client/src/lib/safety-engine";

export function evaluateBackendContextualRisk(features: RiskFeatures): RiskPrediction {
  const locImpact = Math.min(30, Math.round((features.historicalRisk || 40) * 0.3));
  const tempImpact = Math.round(Math.max(0, 22 - Math.abs(features.hour - 22)) * 1.1);
  const envImpact = features.weatherCondition === "HEAVY_STORM" ? 18 : features.weatherCondition === "RAIN" ? 8 : 2;
  const incidentImpact = Math.min(35, (features.recentIncidentCount || 0) * 4 + (features.activeNearbyIncidents || 0) * 6);
  const crowdImpact = Math.min(15, (features.touristDensity || 4) * 1.5);
  const deviationImpact = features.routeDeviation ? 12 : 0;

  const rawScore = locImpact + tempImpact + envImpact + incidentImpact + crowdImpact + deviationImpact;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const severity = getSeverityBand(score);

  const factors = [
    { factor: "Historical zone incident density", impact: locImpact },
    { factor: features.hour >= 20 || features.hour <= 5 ? "Late night temporal exposure" : "Daytime temporal exposure", impact: tempImpact },
    { factor: "Active incident proximity", impact: incidentImpact },
    { factor: "Tourist crowd density", impact: crowdImpact },
    { factor: "Weather & environmental condition", impact: envImpact },
  ];

  if (deviationImpact > 0) {
    factors.push({ factor: "Route deviation alert", impact: deviationImpact });
  }

  factors.sort((a, b) => b.impact - a.impact);

  return {
    score,
    severity,
    band: severity,
    factors,
    method: "Contextual Multi-Factor Safety Engine",
    dataClassification: "DEMO_SYNTHETIC",
    timestamp: new Date().toISOString(),
  };
}

export function evaluateUnifiedBackendRisk(features: {
  incidentCount?: number;
  recentIncidents?: number;
  rainfallMm?: number;
  touristDensity?: number;
  hour?: number;
  naturalHazardScore?: number;
  connectivityScore?: number;
  emergencyInfrastructureScore?: number;
}): RiskPrediction & { unifiedScore: number; activeSignalsCount: number } {
  const base = evaluateBackendContextualRisk({
    historicalIncidentCount: features.incidentCount || 5,
    recentIncidentCount: features.recentIncidents || 2,
    severity: 6,
    touristDensity: features.touristDensity || 5,
    hour: features.hour ?? new Date().getHours(),
    weatherCondition: (features.rainfallMm || 0) > 30 ? "HEAVY_STORM" : (features.rainfallMm || 0) > 10 ? "RAIN" : "NORMAL",
  });

  const hazardImpact = Math.round((features.naturalHazardScore || 0) * 0.15);
  const connImpact = (features.connectivityScore || 100) < 30 ? 10 : 0;
  const infraBonus = Math.max(0, Math.round(((features.emergencyInfrastructureScore || 80) - 50) * 0.1));

  const unifiedScore = Math.max(0, Math.min(100, base.score + hazardImpact + connImpact - infraBonus));
  const unifiedSeverity = getSeverityBand(unifiedScore);

  return {
    ...base,
    score: unifiedScore,
    severity: unifiedSeverity,
    band: unifiedSeverity,
    unifiedScore,
    activeSignalsCount: Object.keys(features).length,
    method: "Unified Multi-Signal Composite Engine v2.1",
  };
}

