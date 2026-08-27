import type { WhatIfScenarioParameters, SimulatedStatePrediction } from "./what-if-simulator";

export interface ScenarioSnapshot {
  id: string;
  name: string;
  timestamp: string;
  modelVersion: string;
  datasetVersion: string;
  parameters: WhatIfScenarioParameters;
  prediction: SimulatedStatePrediction;
}

export const initialSnapshots: ScenarioSnapshot[] = [
  {
    id: "SNAP-01",
    name: "Evening Market Surge + Degraded Signal",
    timestamp: new Date(Date.now() - 3600_000).toISOString(),
    modelVersion: "v1.4.2-risk-predictor",
    datasetVersion: "prototype-dataset-v3",
    parameters: {
      density: "HIGH",
      risk: "HIGH",
      connectivity: "DEGRADED",
      responderAvailability: "75%",
      roadAvailability: "NORMAL",
      incidentLoad: "ELEVATED",
      environment: "NORMAL",
    },
    prediction: {
      simulatedRiskScore: 78,
      simulatedCoveragePercentage: 68,
      simulatedAverageEtaMinutes: 6.5,
      simulatedResilienceScore: 62,
      simulatedActiveIncidentsCount: 5,
      sourceClassification: "SIMULATION",
    },
  },
  {
    id: "SNAP-02",
    name: "Monsoon Storm + Road Blockage",
    timestamp: new Date(Date.now() - 7200_000).toISOString(),
    modelVersion: "v1.4.2-risk-predictor",
    datasetVersion: "prototype-dataset-v3",
    parameters: {
      density: "MEDIUM",
      risk: "HIGH",
      connectivity: "FULL",
      responderAvailability: "50%",
      roadAvailability: "BLOCKED",
      incidentLoad: "ELEVATED",
      environment: "ADVERSE",
    },
    prediction: {
      simulatedRiskScore: 84,
      simulatedCoveragePercentage: 54,
      simulatedAverageEtaMinutes: 9.8,
      simulatedResilienceScore: 50,
      simulatedActiveIncidentsCount: 4,
      sourceClassification: "SIMULATION",
    },
  },
];
