/**
 * CROWD INTELLIGENCE AGENT
 * Analyzes tourist density, detects anomalies, compares current vs expected density.
 * DATA: MODEL-DERIVED (no real crowd sensor feed — clearly labelled)
 */

import { evaluateDensitySignal } from "../../client/src/lib/multi-signal-intelligence";
import type { GeoPoint } from "../../client/src/lib/safety-engine";

export interface CrowdAgentOutput {
  agentName: "crowd";
  currentDensity: number;
  expectedDensity: number;
  densityDeviation: number;
  crowdLevel: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  crowdRisk: number;
  anomaly: boolean;
  anomalyScore: number;
  confidence: number;
  provenance: "MODEL-DERIVED";
  executionMs: number;
  timestamp: string;
  dataMode: "SIMULATED";
  disclaimer: string;
}

export function runCrowdAgent(
  location?: GeoPoint,
  overrideDensity?: number,
  hour?: number
): CrowdAgentOutput {
  const startMs = Date.now();
  const currentHour = hour ?? new Date().getHours();

  const result = evaluateDensitySignal(location, currentHour, overrideDensity);

  // Convert density anomaly to crowd risk score (0-100)
  const baseRisk = result.crowdLevel === "VERY_HIGH" ? 75
    : result.crowdLevel === "HIGH" ? 55
    : result.crowdLevel === "MEDIUM" ? 30
    : 10;
  const anomalyBoost = result.densityAnomalyScore > 0.5 ? 15 : result.densityAnomalyScore > 0.25 ? 7 : 0;
  const crowdRisk = Math.min(100, Math.round(baseRisk + anomalyBoost));

  // Anomaly: if deviation > 30%
  const anomaly = Math.abs(result.densityDeviation) > 30;

  return {
    agentName: "crowd",
    currentDensity: result.currentDensity,
    expectedDensity: result.expectedDensity,
    densityDeviation: result.densityDeviation,
    crowdLevel: result.crowdLevel,
    crowdRisk,
    anomaly,
    anomalyScore: result.densityAnomalyScore,
    confidence: 0.85,
    provenance: "MODEL-DERIVED",
    executionMs: Date.now() - startMs,
    timestamp: new Date().toISOString(),
    dataMode: "SIMULATED",
    disclaimer: "Crowd density data is MODEL-DERIVED — no real crowd sensor feed is connected.",
  };
}
