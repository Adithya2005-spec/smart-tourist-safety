import { createProvenanceTag, type DataProvenanceTag } from "./data-provenance";

export interface CandidateDatasetInfo {
  datasetId: string;
  version: string;
  totalRawIngested: number;
  validatedNormalCount: number;
  anomalousRejectedCount: number;
  cutoffTimestamp: string;
}

export interface ModelPromotionEvaluation {
  championVersion: string;
  challengerVersion: string;
  championF1: number;
  challengerF1: number;
  championBrier: number;
  challengerBrier: number;
  championLatencyMs: number;
  challengerLatencyMs: number;
  promotionCriteriaMet: boolean;
  decision: "PROMOTED" | "REJECTED" | "PENDING_REVIEW";
  decisionRationale: string;
  evaluatedAt: string;
  provenance: DataProvenanceTag;
}

export interface ModelVersionAuditRecord {
  previousVersion: string;
  newVersion: string;
  datasetVersion: string;
  metrics: { f1: number; brier: number; latencyMs: number };
  reason: string;
  timestamp: string;
  approvedBy: string;
  auditHash: string;
}

export function getAdaptiveBaselineState(): {
  candidateDataset: CandidateDatasetInfo;
  latestEvaluation: ModelPromotionEvaluation;
  versionHistory: ModelVersionAuditRecord[];
} {
  return {
    candidateDataset: {
      datasetId: "DS-CANDIDATE-2026-Q3",
      version: "prototype-dataset-v5-candidate",
      totalRawIngested: 1840,
      validatedNormalCount: 1720,
      anomalousRejectedCount: 120,
      cutoffTimestamp: new Date().toISOString(),
    },
    latestEvaluation: {
      championVersion: "v2.1-xgboost",
      challengerVersion: "v2.2-xgboost-candidate",
      championF1: 0.903,
      challengerF1: 0.924,
      championBrier: 0.042,
      challengerBrier: 0.038,
      championLatencyMs: 4.2,
      challengerLatencyMs: 4.5,
      promotionCriteriaMet: true,
      decision: "PENDING_REVIEW",
      decisionRationale:
        "Challenger v2.2 demonstrates +2.1% higher F1 score and lower Brier calibration error on validated normal observations without exceeding 5ms latency SLA.",
      evaluatedAt: new Date().toISOString(),
      provenance: createProvenanceTag("MODEL-DERIVED", "Champion vs Challenger MLOps Evaluation Loop"),
    },
    versionHistory: [
      {
        previousVersion: "v2.0-xgboost",
        newVersion: "v2.1-xgboost",
        datasetVersion: "prototype-dataset-v4",
        metrics: { f1: 0.903, brier: 0.042, latencyMs: 4.2 },
        reason: "Ingested 2,400 validated normal regional observations; reduced false alarm rate by 3.8%.",
        timestamp: "2026-08-20T14:30:00.000Z",
        approvedBy: "Chief MLOps Officer (AUTH-101)",
        auditHash: "0x4a9b2c8e1f3d5a7b8c9e0f1a2b3c4d5e6f7a8b9c",
      },
      {
        previousVersion: "v1.0-random-forest",
        newVersion: "v2.0-xgboost",
        datasetVersion: "prototype-dataset-v3",
        metrics: { f1: 0.885, brier: 0.055, latencyMs: 5.1 },
        reason: "Upgraded architecture from Random Forest to XGBoost with temporal lag features.",
        timestamp: "2026-08-01T10:00:00.000Z",
        approvedBy: "System Administrator",
        auditHash: "0x1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e",
      },
    ],
  };
}
