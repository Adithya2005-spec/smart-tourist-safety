export interface ZonalResilienceComparison {
  zoneId: string;
  zoneName: string;
  riskScore: number;
  resilienceScore: number;
  connectivityScore: number;
  coverageScore: number;
  responseSpeedScore: number;
  infrastructureScore: number;
  resilienceSummary: string;
}

export function calculateResilienceScore(
  riskScore: number,
  connectivityQuality: number = 90,
  responderCoverage: number = 85,
  expectedResponseMin: number = 6
): ZonalResilienceComparison {
  const responseSpeedScore = Math.max(10, Math.round(100 - expectedResponseMin * 6));
  const infrastructureScore = Math.round(connectivityQuality * 0.5 + responderCoverage * 0.5);

  const resilienceScore = Math.round(
    connectivityQuality * 0.3 + responderCoverage * 0.3 + responseSpeedScore * 0.2 + (100 - riskScore) * 0.2
  );

  return {
    zoneId: "ZONE-EVAL",
    zoneName: "Bengaluru Central District",
    riskScore,
    resilienceScore,
    connectivityScore: connectivityQuality,
    coverageScore: responderCoverage,
    responseSpeedScore,
    infrastructureScore,
    resilienceSummary:
      resilienceScore >= 75
        ? "HIGH RESILIENCE: Excellent emergency communication & fast responder dispatch."
        : "MODERATE RESILIENCE: Recommended pre-positioning to improve responder response time.",
  };
}
