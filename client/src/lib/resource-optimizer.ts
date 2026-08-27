export interface ResponderAllocationRecommendation {
  responderId: string;
  responderName: string;
  currentZone: string;
  recommendedZone: string;
  estimatedEtaMinutes: number;
  reason: string;
  provenanceLabel: "ESTIMATED / SIMULATED";
}

export function computeResourceOptimizer(): ResponderAllocationRecommendation[] {
  return [
    {
      responderId: "R17",
      responderName: "Officer Priya Sharma",
      currentZone: "Zone B (Church Street)",
      recommendedZone: "Zone C (MG Road High-Risk Sector)",
      estimatedEtaMinutes: 3.5,
      reason: "Elevated risk score (78/100) + closest available responder via unblocked corridor.",
      provenanceLabel: "ESTIMATED / SIMULATED",
    },
    {
      responderId: "R21",
      responderName: "Medical Unit Alpha",
      currentZone: "Station 02",
      recommendedZone: "Zone A (Cubbon Park Approach)",
      estimatedEtaMinutes: 4.2,
      reason: "Pre-positioning requested to maintain <5 min triage response during evening surge.",
      provenanceLabel: "ESTIMATED / SIMULATED",
    },
  ];
}
