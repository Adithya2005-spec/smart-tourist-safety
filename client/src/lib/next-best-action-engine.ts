export interface NextBestAction {
  rank: number;
  actionTitle: string;
  actionCode: string;
  targetUnitId: string;
  targetUnitName: string;
  reason: string;
  evidence: string[];
  confidencePercentage: number;
  expectedImpact: "HIGH" | "MEDIUM" | "CRITICAL";
  alternativeAction: string;
  sourceClassification: "MODEL-DERIVED";
}

export function generateNextBestActions(
  highRiskCount: number = 1,
  activeIncidentsCount: number = 2
): NextBestAction[] {
  return [
    {
      rank: 1,
      actionTitle: "Reposition Responder Unit R01 to MG Road High-Risk Zone",
      actionCode: "REPOSITION_UNIT_R01",
      targetUnitId: "R01",
      targetUnitName: "Officer Rajesh Kumar",
      reason: "Zone 01 risk score is 78/100 with 14 active incidents during evening crowd surge.",
      evidence: [
        "Zonal risk score: 78/100 (HIGH)",
        "3 active incidents within 0.5km radius",
        "Estimated response ETA reduces from 11m to 3.5m",
      ],
      confidencePercentage: 84,
      expectedImpact: "HIGH",
      alternativeAction: "Maintain R01 at station and increase passive CCTV monitoring",
      sourceClassification: "MODEL-DERIVED",
    },
    {
      rank: 2,
      actionTitle: "Issue Pre-SOS Advisory to Tourists in Church Street Sector",
      actionCode: "ISSUE_PREVENTIVE_ADVISORY",
      targetUnitId: "SYSTEM-BROADCAST",
      targetUnitName: "Automated Edge Advisory Broadcast",
      reason: "Tourist density multiplier exceeds 1.8x with high night-exposure risk curve.",
      evidence: [
        "1,420 active tourists logged in sector",
        "Temporal night risk curve transition at 20:00",
      ],
      confidencePercentage: 79,
      expectedImpact: "MEDIUM",
      alternativeAction: "Log warning without active push notification",
      sourceClassification: "MODEL-DERIVED",
    },
  ];
}
