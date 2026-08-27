export type HitlDecisionType = "PENDING" | "APPROVED" | "REJECTED" | "MODIFIED";

export interface HitlRecommendation {
  id: string;
  recommendationTitle: string;
  recommendedAction: string;
  targetUnitId: string;
  targetUnitName: string;
  reason: string;
  confidencePercentage: number;
  expectedImpact: "HIGH" | "MEDIUM" | "CRITICAL";
  alternativeAction: string;
  status: HitlDecisionType;
  operatorId?: string;
  operatorNotes?: string;
  decisionTimestamp?: string;
  sourceClassification: "MODEL-DERIVED";
}

export function createHitlRecommendation(
  title: string,
  action: string,
  unitId: string,
  unitName: string,
  reason: string,
  confidence: number = 84
): HitlRecommendation {
  return {
    id: `HITL-${Math.floor(1000 + Math.random() * 9000)}`,
    recommendationTitle: title,
    recommendedAction: action,
    targetUnitId: unitId,
    targetUnitName: unitName,
    reason,
    confidencePercentage: confidence,
    expectedImpact: "HIGH",
    alternativeAction: "Increase passive camera monitoring & maintain current patrol position",
    status: "PENDING",
    sourceClassification: "MODEL-DERIVED",
  };
}

export function processHitlDecision(
  recommendation: HitlRecommendation,
  decision: "APPROVED" | "REJECTED" | "MODIFIED",
  operatorId: string,
  notes?: string
): HitlRecommendation {
  return {
    ...recommendation,
    status: decision,
    operatorId,
    operatorNotes: notes || `Action ${decision.toLowerCase()} by operator ${operatorId}.`,
    decisionTimestamp: new Date().toISOString(),
  };
}
