export interface RegionalModelNode {
  regionId: string;
  regionName: string;
  localSamplesCount: number;
  localAccuracy: number;
  gradientNorm: number;
  lastUpdated: string;
  privacyGuarantee: string;
}

export interface FederatedAggregationState {
  globalModelVersion: string;
  roundNumber: number;
  totalParticipatingRegions: number;
  aggregatedAccuracy: number;
  regionalNodes: RegionalModelNode[];
  isSimulated: boolean;
  sourceClassification: "SIMULATED";
}

export function getFederatedLearningState(): FederatedAggregationState {
  return {
    globalModelVersion: "GLOBAL-SAFETY-NET-v1.2",
    roundNumber: 42,
    totalParticipatingRegions: 3,
    aggregatedAccuracy: 94.2,
    regionalNodes: [
      {
        regionId: "REG-KA",
        regionName: "Karnataka Tourism Node",
        localSamplesCount: 1420,
        localAccuracy: 93.8,
        gradientNorm: 0.042,
        lastUpdated: new Date().toISOString(),
        privacyGuarantee: "Raw GPS telemetry retained on Karnataka edge servers; only weights shared",
      },
      {
        regionId: "REG-GA",
        regionName: "Goa Coastal Node",
        localSamplesCount: 1180,
        localAccuracy: 94.6,
        gradientNorm: 0.038,
        lastUpdated: new Date().toISOString(),
        privacyGuarantee: "Coastal tourist PII off-chain; encrypted weight tensors uploaded",
      },
      {
        regionId: "REG-KL",
        regionName: "Kerala Backwater Node",
        localSamplesCount: 960,
        localAccuracy: 94.1,
        gradientNorm: 0.045,
        lastUpdated: new Date().toISOString(),
        privacyGuarantee: "Zero raw coordinates transmitted during global model aggregation",
      },
    ],
    isSimulated: true,
    sourceClassification: "SIMULATED",
  };
}
