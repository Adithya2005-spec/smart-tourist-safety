export interface DiscoveredPattern {
  id: string;
  patternTitle: string;
  relationshipDescription: string;
  confidenceScore: number;
  sampleSize: number;
  relevanceTag: string;
  sourceClassification: "SYNTHETIC DATA";
}

export function discoverSafetyPatterns(): DiscoveredPattern[] {
  return [
    {
      id: "PAT-01",
      patternTitle: "Density-Temporal Risk Spike Correlation",
      relationshipDescription: "Prototype data indicates a recurring relationship between tourist density > 1.8x and elevated incident frequency after 20:00 hrs.",
      confidenceScore: 89,
      sampleSize: 1420,
      relevanceTag: "HIGH RECURRENCE",
      sourceClassification: "SYNTHETIC DATA",
    },
    {
      id: "PAT-02",
      patternTitle: "Connectivity Degradation Incident Delay",
      relationshipDescription: "Incidents occurring in LTE signal drop zones (> -110 dBm) experience an average 3.2-minute acknowledgement latency buffer.",
      confidenceScore: 84,
      sampleSize: 840,
      relevanceTag: "INFRASTRUCTURE IMPACT",
      sourceClassification: "SYNTHETIC DATA",
    },
  ];
}
