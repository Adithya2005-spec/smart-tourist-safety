export interface ModelEvaluationMetrics {
  modelId: string;
  modelName: string;
  architecture: "BASELINE_RANDOM_FOREST" | "ADVANCED_XGBOOST" | "TEMPORAL_TRANSFORMER";
  status: "DEPLOYED" | "CANDIDATE" | "ARCHIVED";
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  fpr: number;
  fnr: number;
  mae: number;
  rmse: number;
  brierScore: number;
  inferenceLatencyMs: number;
  datasetVersion: string;
  trainingSamplesCount: number;
  evaluationTimestamp: string;
}

export function evaluateModelComparisonPipeline(): ModelEvaluationMetrics[] {
  return [
    {
      modelId: "MOD-XGB-V2",
      modelName: "Suraksha XGBoost Predictor v2.1",
      architecture: "ADVANCED_XGBOOST",
      status: "DEPLOYED",
      precision: 0.912,
      recall: 0.895,
      f1Score: 0.903,
      rocAuc: 0.948,
      prAuc: 0.932,
      fpr: 0.048,
      fnr: 0.105,
      mae: 3.42,
      rmse: 4.88,
      brierScore: 0.042,
      inferenceLatencyMs: 4.2,
      datasetVersion: "prototype-dataset-v4",
      trainingSamplesCount: 9940,
      evaluationTimestamp: "2026-08-27T18:00:00.000Z",
    },
    {
      modelId: "MOD-RF-V1",
      modelName: "Random Forest Baseline v1.0",
      architecture: "BASELINE_RANDOM_FOREST",
      status: "ARCHIVED",
      precision: 0.845,
      recall: 0.812,
      f1Score: 0.828,
      rocAuc: 0.885,
      prAuc: 0.862,
      fpr: 0.092,
      fnr: 0.188,
      mae: 5.65,
      rmse: 7.21,
      brierScore: 0.088,
      inferenceLatencyMs: 8.5,
      datasetVersion: "prototype-dataset-v3",
      trainingSamplesCount: 7500,
      evaluationTimestamp: "2026-08-20T12:00:00.000Z",
    },
    {
      modelId: "MOD-TFT-V1",
      modelName: "Temporal Spatial Transformer v0.9 (Experimental)",
      architecture: "TEMPORAL_TRANSFORMER",
      status: "CANDIDATE",
      precision: 0.928,
      recall: 0.914,
      f1Score: 0.921,
      rocAuc: 0.962,
      prAuc: 0.951,
      fpr: 0.038,
      fnr: 0.086,
      mae: 2.85,
      rmse: 3.92,
      brierScore: 0.035,
      inferenceLatencyMs: 18.4,
      datasetVersion: "prototype-dataset-v4",
      trainingSamplesCount: 9940,
      evaluationTimestamp: "2026-08-27T20:00:00.000Z",
    },
  ];
}
