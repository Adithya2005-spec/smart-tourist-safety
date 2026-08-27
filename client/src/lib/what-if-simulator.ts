export type ScenarioDensity = "LOW" | "MEDIUM" | "HIGH";
export type ScenarioRisk = "LOW" | "MEDIUM" | "HIGH";
export type ScenarioConnectivity = "FULL" | "DEGRADED" | "OFFLINE";
export type ScenarioResponderAvail = "100%" | "75%" | "50%" | "25%";
export type ScenarioRoadAvail = "NORMAL" | "PARTIAL" | "BLOCKED";
export type ScenarioIncidentLoad = "NORMAL" | "ELEVATED" | "CRITICAL";
export type ScenarioEnvironment = "NORMAL" | "ADVERSE";

export interface WhatIfScenarioParameters {
  density: ScenarioDensity;
  risk: ScenarioRisk;
  connectivity: ScenarioConnectivity;
  responderAvailability: ScenarioResponderAvail;
  roadAvailability: ScenarioRoadAvail;
  incidentLoad: ScenarioIncidentLoad;
  environment: ScenarioEnvironment;
}

export const defaultWhatIfParameters: WhatIfScenarioParameters = {
  density: "MEDIUM",
  risk: "MEDIUM",
  connectivity: "FULL",
  responderAvailability: "100%",
  roadAvailability: "NORMAL",
  incidentLoad: "NORMAL",
  environment: "NORMAL",
};

export interface SimulatedStatePrediction {
  simulatedRiskScore: number;
  simulatedCoveragePercentage: number;
  simulatedAverageEtaMinutes: number;
  simulatedResilienceScore: number;
  simulatedActiveIncidentsCount: number;
  sourceClassification: "SIMULATION";
}

export function computeWhatIfSimulation(params: WhatIfScenarioParameters, baseRisk: number): SimulatedStatePrediction {
  let riskScore = baseRisk;
  let coverage = 85;
  let eta = 4.5;
  let resilience = 88;
  let incidentsCount = 2;

  // Density impact
  if (params.density === "HIGH") {
    riskScore += 18;
    incidentsCount += 3;
    eta += 2.0;
  } else if (params.density === "LOW") {
    riskScore -= 10;
  }

  // Connectivity impact
  if (params.connectivity === "DEGRADED") {
    coverage -= 15;
    resilience -= 14;
    eta += 1.5;
  } else if (params.connectivity === "OFFLINE") {
    coverage -= 35;
    resilience -= 32;
    eta += 4.0;
  }

  // Responder availability impact
  if (params.responderAvailability === "75%") {
    coverage -= 12;
    eta += 1.5;
  } else if (params.responderAvailability === "50%") {
    coverage -= 28;
    eta += 3.5;
  } else if (params.responderAvailability === "25%") {
    coverage -= 45;
    eta += 7.0;
    resilience -= 25;
  }

  // Road availability impact
  if (params.roadAvailability === "PARTIAL") {
    eta += 2.5;
  } else if (params.roadAvailability === "BLOCKED") {
    eta += 6.0;
    resilience -= 18;
  }

  // Environmental impact
  if (params.environment === "ADVERSE") {
    riskScore += 12;
    resilience -= 10;
  }

  return {
    simulatedRiskScore: Math.min(99, Math.max(10, riskScore)),
    simulatedCoveragePercentage: Math.max(15, Math.min(99, coverage)),
    simulatedAverageEtaMinutes: Math.round(eta * 10) / 10,
    simulatedResilienceScore: Math.max(10, Math.min(99, resilience)),
    simulatedActiveIncidentsCount: incidentsCount,
    sourceClassification: "SIMULATION",
  };
}
