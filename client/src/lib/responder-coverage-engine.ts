import type { Responder, RiskZone } from "./safety-engine";

export type CoverageTier = "EXCELLENT" | "GOOD" | "LIMITED" | "CRITICAL";

export interface ZonalCoverageAssessment {
  zoneId: string;
  zoneName: string;
  tier: CoverageTier;
  expectedResponseTimeMinutes: number;
  availableRespondersCount: number;
  recommendation: string;
}

export interface ResourcePrePositioningRecommendation {
  id: string;
  targetZoneId: string;
  targetZoneName: string;
  recommendedResponderId: string;
  recommendedResponderName: string;
  reason: string;
  expectedResponseTimeImprovement: string;
  priority: "HIGH" | "MEDIUM" | "URGENT";
}

export function computeZonalCoverage(
  zones: RiskZone[],
  responders: Responder[]
): ZonalCoverageAssessment[] {
  const availableCount = responders.filter((r) => r.availability === "AVAILABLE").length;

  return zones.map((zone) => {
    let expectedTime = 6;
    if (zone.score >= 70) expectedTime += 5;
    if (availableCount < 2) expectedTime += 8;

    let tier: CoverageTier = "EXCELLENT";
    if (expectedTime > 20) tier = "CRITICAL";
    else if (expectedTime > 10) tier = "LIMITED";
    else if (expectedTime > 5) tier = "GOOD";

    let rec = "Coverage optimal for current demand.";
    if (tier === "CRITICAL" || tier === "LIMITED") {
      rec = `Pre-position 1 field responder near ${zone.name} to lower ETA from ${expectedTime}m to <5m.`;
    }

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      tier,
      expectedResponseTimeMinutes: expectedTime,
      availableRespondersCount: availableCount,
      recommendation: rec,
    };
  });
}

export function generatePrePositioningRecommendations(
  zones: RiskZone[],
  responders: Responder[]
): ResourcePrePositioningRecommendation[] {
  const highRiskZone = zones.find((z) => z.score >= 60) || zones[0];
  const availableUnit = responders.find((r) => r.availability === "AVAILABLE") || responders[0];

  return [
    {
      id: "REC-POS-01",
      targetZoneId: highRiskZone?.id ?? "ZONE-01",
      targetZoneName: highRiskZone?.name ?? "MG Road Transit Corridor",
      recommendedResponderId: availableUnit?.id ?? "R01",
      recommendedResponderName: availableUnit?.name ?? "Officer Rajesh Kumar",
      reason: "High predicted tourist density & elevated zonal risk score during evening hours",
      expectedResponseTimeImprovement: "Reduces response ETA from 11 mins to 3.5 mins",
      priority: "HIGH",
    },
  ];
}
