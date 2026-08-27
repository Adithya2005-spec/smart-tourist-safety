import type { GeoPoint, Incident, RiskZone, SeverityBand } from "./safety-engine";
import { getSeverityBand } from "./safety-engine";

export interface RiskForecast {
  currentScore: number;
  currentSeverity: SeverityBand;
  forecast15m: { score: number; severity: SeverityBand; trend: "STABLE" | "RISING" | "FALLING" };
  forecast30m: { score: number; severity: SeverityBand; trend: "STABLE" | "RISING" | "FALLING" };
  forecast60m: { score: number; severity: SeverityBand; trend: "STABLE" | "RISING" | "FALLING" };
  primaryFactor: string;
  sourceClassification: "SYNTHETIC" | "MODEL-DERIVED";
}

export interface ZonalPropagationResult {
  zoneId: string;
  zoneName: string;
  baseScore: number;
  propagatedScore: number;
  delta: number;
  propagatedSeverity: SeverityBand;
  propagationSourceIncidentId?: string;
  explanation: string;
}

export function computeRiskForecast(
  currentScore: number,
  recentIncidentCount: number = 3,
  hourOfDay: number = 21,
  touristDensity: number = 6
): RiskForecast {
  // Temporal & momentum factors
  const isNight = hourOfDay >= 20 || hourOfDay < 5;
  const momentum = recentIncidentCount > 4 ? 1.25 : 1.05;

  const score15 = Math.min(99, Math.round(currentScore * (isNight ? 1.08 : 1.02) * (momentum > 1.1 ? 1.1 : 1.0)));
  const score30 = Math.min(99, Math.round(currentScore * (isNight ? 1.18 : 1.05) * momentum));
  const score60 = Math.min(99, Math.round(currentScore * (isNight ? 1.28 : 1.08) * (momentum * 1.1)));

  return {
    currentScore,
    currentSeverity: getSeverityBand(currentScore),
    forecast15m: {
      score: score15,
      severity: getSeverityBand(score15),
      trend: score15 > currentScore ? "RISING" : "STABLE",
    },
    forecast30m: {
      score: score30,
      severity: getSeverityBand(score30),
      trend: score30 > score15 ? "RISING" : "STABLE",
    },
    forecast60m: {
      score: score60,
      severity: getSeverityBand(score60),
      trend: score60 > score30 ? "RISING" : "STABLE",
    },
    primaryFactor: isNight
      ? "Late-night exposure window combined with recent zonal incident rate"
      : "High tourist density corridor momentum",
    sourceClassification: "MODEL-DERIVED",
  };
}

// Distance in kilometers using Haversine formula
export function haversineDistanceKm(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function computeRiskPropagation(
  zones: RiskZone[],
  activeIncidents: Incident[]
): ZonalPropagationResult[] {
  const highIncidents = activeIncidents.filter((inc) => inc.status !== "RESOLVED");

  return zones.map((zone) => {
    let maxPropagatedAdd = 0;
    let closestIncident: Incident | null = null;
    let closestDistKm = Infinity;

    for (const incident of highIncidents) {
      const dist = haversineDistanceKm(zone.center, incident.coordinate);
      // Exponential decay: Risk impact decreases exponentially with distance
      const severityMultiplier = incident.severity === "CRITICAL" ? 1.5 : incident.severity === "HIGH" ? 1.2 : 1.0;
      const impact = Math.round(incident.riskScore * Math.exp(-1.8 * dist) * severityMultiplier * 0.4);

      if (impact > maxPropagatedAdd) {
        maxPropagatedAdd = impact;
        closestIncident = incident;
        closestDistKm = dist;
      }
    }

    const baseScore = zone.score;
    const propagatedScore = Math.min(99, baseScore + maxPropagatedAdd);

    let explanation = `Base baseline risk score of ${baseScore} for ${zone.name}.`;
    if (closestIncident && maxPropagatedAdd > 0) {
      explanation = `Risk score increased by +${maxPropagatedAdd} pts (to ${propagatedScore}) due to geographic proximity (${closestDistKm.toFixed(
        2
      )} km) to active ${closestIncident.severity} incident ${closestIncident.id} (${closestIncident.type}).`;
    }

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      baseScore,
      propagatedScore,
      delta: maxPropagatedAdd,
      propagatedSeverity: getSeverityBand(propagatedScore),
      propagationSourceIncidentId: closestIncident?.id,
      explanation,
    };
  });
}
