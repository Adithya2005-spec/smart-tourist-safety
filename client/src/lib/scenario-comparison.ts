import type { SimulatedStatePrediction } from "./what-if-simulator";

export interface ScenarioDeltaItem {
  metricName: string;
  currentValue: string | number;
  simulatedValue: string | number;
  deltaText: string;
  direction: "UP" | "DOWN" | "SAME";
  isRiskIncrease: boolean;
}

export function computeScenarioComparison(
  currentRisk: number,
  currentCoverage: number,
  currentEta: number,
  currentResilience: number,
  simulated: SimulatedStatePrediction
): ScenarioDeltaItem[] {
  const riskDiff = simulated.simulatedRiskScore - currentRisk;
  const coverageDiff = simulated.simulatedCoveragePercentage - currentCoverage;
  const etaDiff = Math.round((simulated.simulatedAverageEtaMinutes - currentEta) * 10) / 10;
  const resilienceDiff = simulated.simulatedResilienceScore - currentResilience;

  return [
    {
      metricName: "Contextual Risk Score",
      currentValue: `${currentRisk}/100`,
      simulatedValue: `${simulated.simulatedRiskScore}/100`,
      deltaText: riskDiff === 0 ? "→ 0 pts" : riskDiff > 0 ? `↑ +${riskDiff} pts` : `↓ ${riskDiff} pts`,
      direction: riskDiff > 0 ? "UP" : riskDiff < 0 ? "DOWN" : "SAME",
      isRiskIncrease: riskDiff > 0,
    },
    {
      metricName: "Responder Coverage",
      currentValue: `${currentCoverage}%`,
      simulatedValue: `${simulated.simulatedCoveragePercentage}%`,
      deltaText: coverageDiff === 0 ? "→ 0%" : coverageDiff > 0 ? `↑ +${coverageDiff}%` : `↓ ${coverageDiff}%`,
      direction: coverageDiff > 0 ? "UP" : coverageDiff < 0 ? "DOWN" : "SAME",
      isRiskIncrease: coverageDiff < 0,
    },
    {
      metricName: "Estimated Response Time (ETA)",
      currentValue: `${currentEta} mins`,
      simulatedValue: `${simulated.simulatedAverageEtaMinutes} mins`,
      deltaText: etaDiff === 0 ? "→ 0 min" : etaDiff > 0 ? `↑ +${etaDiff} min` : `↓ ${etaDiff} min`,
      direction: etaDiff > 0 ? "UP" : etaDiff < 0 ? "DOWN" : "SAME",
      isRiskIncrease: etaDiff > 0,
    },
    {
      metricName: "Safety Resilience Score",
      currentValue: `${currentResilience}/100`,
      simulatedValue: `${simulated.simulatedResilienceScore}/100`,
      deltaText: resilienceDiff === 0 ? "→ 0 pts" : resilienceDiff > 0 ? `↑ +${resilienceDiff} pts` : `↓ ${resilienceDiff} pts`,
      direction: resilienceDiff > 0 ? "UP" : resilienceDiff < 0 ? "DOWN" : "SAME",
      isRiskIncrease: resilienceDiff < 0,
    },
  ];
}
