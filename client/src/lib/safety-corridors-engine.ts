import type { GeoPoint } from "./safety-engine";

export interface SafetyCorridor {
  id: string;
  name: string;
  type: "SHORTEST" | "SAFEST" | "MOST_RESILIENT";
  distanceKm: number;
  etaMinutes: number;
  riskScore: number;
  resilienceScore: number;
  connectivityQuality: string;
  responderCoverage: string;
  emergencyAccessibility: string;
  explanation: string;
}

export function evaluateSafetyCorridors(currentLocation: GeoPoint): SafetyCorridor[] {
  return [
    {
      id: "CORRIDOR-A",
      name: "Direct Commercial Transit (Route A)",
      type: "SHORTEST",
      distanceKm: 3.2,
      etaMinutes: 18,
      riskScore: 74,
      resilienceScore: 48,
      connectivityQuality: "Degraded (-108 dBm)",
      responderCoverage: "Limited (12 min ETA)",
      emergencyAccessibility: "Restricted side lanes",
      explanation: "Shortest distance but crosses active high-risk market zone with limited cell signal.",
    },
    {
      id: "CORRIDOR-B",
      name: "Monitored Safe Corridor (Route B)",
      type: "SAFEST",
      distanceKm: 3.7,
      etaMinutes: 21,
      riskScore: 34,
      resilienceScore: 88,
      connectivityQuality: "Excellent LTE/5G",
      responderCoverage: "Strong (<4 min ETA)",
      emergencyAccessibility: "Dedicated police patrol lane",
      explanation: "Bypasses high-risk zone with continuous police assistance posts and camera monitoring.",
    },
    {
      id: "CORRIDOR-C",
      name: "High-Resilience Metro Boulevard (Route C)",
      type: "MOST_RESILIENT",
      distanceKm: 4.1,
      etaMinutes: 24,
      riskScore: 28,
      resilienceScore: 94,
      connectivityQuality: "Full Redundant LTE + Mesh WiFi",
      responderCoverage: "Optimal (Cubbon Park Command Post)",
      emergencyAccessibility: "Immediate ambulance & squad access",
      explanation: "Recommended when connectivity reliability and instant emergency responder dispatch are top priority.",
    },
  ];
}
