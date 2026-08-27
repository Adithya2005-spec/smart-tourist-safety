export interface SafetyPolicyRule {
  id: string;
  name: string;
  conditionDescription: string;
  actionRequired: string;
  isActive: boolean;
  sourceClassification: "DETERMINISTIC_POLICY";
}

export interface PolicyEvaluationResult {
  policyId: string;
  policyName: string;
  triggered: boolean;
  actionRequired: string;
  reason: string;
}

export const activeSafetyPolicies: SafetyPolicyRule[] = [
  {
    id: "POL-01",
    name: "High-Risk Density Escalation",
    conditionDescription: "Risk Score > 75 AND Tourist Density > 1.5x AND Responder Coverage < GOOD",
    actionRequired: "ESCALATE_ZONE_SEVERITY_AND_PRE_POSITION_RESPONDER",
    isActive: true,
    sourceClassification: "DETERMINISTIC_POLICY",
  },
  {
    id: "POL-02",
    name: "Offline Queue Auto-Sync Policy",
    conditionDescription: "Connectivity Status = ONLINE AND Pending Events > 0",
    actionRequired: "FLUSH_INDEXEDDB_EVENT_QUEUE",
    isActive: true,
    sourceClassification: "DETERMINISTIC_POLICY",
  },
  {
    id: "POL-03",
    name: "Pre-SOS Preventive Route Advisory",
    conditionDescription: "Risk Score > 60 AND Route Deviation = TRUE AND Nearby Incident > 0",
    actionRequired: "EMIT_PRE_SOS_PREVENTIVE_WARNING",
    isActive: true,
    sourceClassification: "DETERMINISTIC_POLICY",
  },
];

export function evaluateSafetyPolicies(
  riskScore: number,
  touristDensityMultiplier: number,
  responderCoverageTier: string,
  pendingEventsCount: number,
  isOnline: boolean
): PolicyEvaluationResult[] {
  return [
    {
      policyId: "POL-01",
      policyName: "High-Risk Density Escalation",
      triggered: riskScore > 75 && touristDensityMultiplier > 1.5 && responderCoverageTier !== "EXCELLENT",
      actionRequired: "ESCALATE_ZONE_SEVERITY_AND_PRE_POSITION_RESPONDER",
      reason: `Evaluated deterministically: Risk (${riskScore}) > 75 & Density (${touristDensityMultiplier.toFixed(1)}x) > 1.5x.`,
    },
    {
      policyId: "POL-02",
      policyName: "Offline Queue Auto-Sync Policy",
      triggered: isOnline && pendingEventsCount > 0,
      actionRequired: "FLUSH_INDEXEDDB_EVENT_QUEUE",
      reason: `Evaluated deterministically: Connection online with ${pendingEventsCount} queued events.`,
    },
    {
      policyId: "POL-03",
      policyName: "Pre-SOS Preventive Route Advisory",
      triggered: riskScore > 60,
      actionRequired: "EMIT_PRE_SOS_PREVENTIVE_WARNING",
      reason: `Evaluated deterministically: Contextual risk (${riskScore}) exceeds preventive threshold (60).`,
    },
  ];
}
