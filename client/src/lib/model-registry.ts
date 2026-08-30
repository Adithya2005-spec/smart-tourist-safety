import type { ModelEvaluationMetrics } from "./advanced-ml-pipeline";
import { evaluateModelComparisonPipeline } from "./advanced-ml-pipeline";

export interface ModelRegistryRecord {
  modelId: string;
  modelName: string;
  version: string;
  datasetVersion: string;
  featureSet: string[];
  trainingTimestamp: string;
  metrics: ModelEvaluationMetrics;
  status: "DEPLOYED" | "CANDIDATE" | "ARCHIVED";
  deploymentTarget: string;
  temporalDataLeakageProtection: string;
}

export function getModelRegistryRecords(): ModelRegistryRecord[] {
  const metricsList = evaluateModelComparisonPipeline();

  return metricsList.map((metrics) => ({
    modelId: metrics.modelId,
    modelName: metrics.modelName,
    version: metrics.modelId === "MOD-XGB-V2" ? "v2.1" : metrics.modelId === "MOD-RF-V1" ? "v1.0" : "v0.9-candidate",
    datasetVersion: metrics.datasetVersion,
    featureSet: [
      "historical_incident_count",
      "recent_3h_incident_count",
      "severity_score",
      "tourist_density_multiplier",
      "hour_of_day",
      "day_of_week",
      "responder_availability_ratio",
      "road_closure_factor",
      "cellular_signal_quality",
    ],
    trainingTimestamp: metrics.evaluationTimestamp,
    metrics,
    status: metrics.status,
    deploymentTarget: metrics.status === "DEPLOYED" ? "36 Edge Nodes + Central API" : metrics.status === "CANDIDATE" ? "Staging Validation Cluster" : "Archived Model Repository",
    temporalDataLeakageProtection: "Strict chronological train/validation/test split preventing future lookahead bias",
  }));
}
