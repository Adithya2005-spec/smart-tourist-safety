import { createProvenanceTag, type DataProvenanceTag } from "./data-provenance";

export type DatasetStage = "RAW" | "VALIDATED" | "CLEANED" | "FEATURE_ENGINEERED" | "TRAIN" | "VALIDATION" | "TEST";

export interface DatasetStageInfo {
  stage: DatasetStage;
  stageName: string;
  rowCount: number;
  featureCount: number;
  missingValuesRatePercentage: number;
  duplicateRowsCount: number;
  classBalance: { safeCount: number; cautionCount: number; dangerCount: number };
  temporalSplitWindow: string;
  dataLeakageProtection: string;
  provenance: DataProvenanceTag;
}

export interface MLDatasetPipelineMetadata {
  datasetId: string;
  version: string;
  totalRawRecords: number;
  createdTimestamp: string;
  stages: DatasetStageInfo[];
}

export function getMLDatasetPipelineMetadata(): MLDatasetPipelineMetadata {
  return {
    datasetId: "DS-SURAKSHA-IND-2026",
    version: "prototype-dataset-v4",
    totalRawRecords: 14250,
    createdTimestamp: "2026-08-25T10:00:00.000Z",
    stages: [
      {
        stage: "RAW",
        stageName: "Raw Ingestion Feed",
        rowCount: 14250,
        featureCount: 18,
        missingValuesRatePercentage: 1.4,
        duplicateRowsCount: 12,
        classBalance: { safeCount: 8550, cautionCount: 4275, dangerCount: 1425 },
        temporalSplitWindow: "2026-01-01 to 2026-08-20",
        dataLeakageProtection: "Raw Telemetry Logged Sequentially",
        provenance: createProvenanceTag("SYNTHETIC", "Synthetic telemetry & empirical incident seeds"),
      },
      {
        stage: "VALIDATED",
        stageName: "Schema Validation & Quality Gate",
        rowCount: 14238,
        featureCount: 18,
        missingValuesRatePercentage: 0.2,
        duplicateRowsCount: 0,
        classBalance: { safeCount: 8545, cautionCount: 4270, dangerCount: 1423 },
        temporalSplitWindow: "2026-01-01 to 2026-08-20",
        dataLeakageProtection: "Duplicates removed, out-of-range coordinates scrubbed",
        provenance: createProvenanceTag("MODEL-DERIVED", "Validated through automated schema rules"),
      },
      {
        stage: "CLEANED",
        stageName: "Imputation & Outlier Filtering",
        rowCount: 14200,
        featureCount: 22,
        missingValuesRatePercentage: 0.0,
        duplicateRowsCount: 0,
        classBalance: { safeCount: 8520, cautionCount: 4260, dangerCount: 1420 },
        temporalSplitWindow: "2026-01-01 to 2026-08-20",
        dataLeakageProtection: "Imputation fit exclusively on train set",
        provenance: createProvenanceTag("MODEL-DERIVED", "Outliers capped via IQR bounds"),
      },
      {
        stage: "FEATURE_ENGINEERED",
        stageName: "Temporal & Spatial Feature Scaling",
        rowCount: 14200,
        featureCount: 34,
        missingValuesRatePercentage: 0.0,
        duplicateRowsCount: 0,
        classBalance: { safeCount: 8520, cautionCount: 4260, dangerCount: 1420 },
        temporalSplitWindow: "2026-01-01 to 2026-08-20",
        dataLeakageProtection: "Rolling statistics computed chronologically without future lookahead",
        provenance: createProvenanceTag("MODEL-DERIVED", "Temporal rolling lag features & density ratios"),
      },
      {
        stage: "TRAIN",
        stageName: "Training Split (70%)",
        rowCount: 9940,
        featureCount: 34,
        missingValuesRatePercentage: 0.0,
        duplicateRowsCount: 0,
        classBalance: { safeCount: 5964, cautionCount: 2982, dangerCount: 994 },
        temporalSplitWindow: "2026-01-01 to 2026-06-15",
        dataLeakageProtection: "Strict chronological train split (Past data only)",
        provenance: createProvenanceTag("MODEL-DERIVED", "Train dataset split"),
      },
      {
        stage: "VALIDATION",
        stageName: "Validation Split (15%)",
        rowCount: 2130,
        featureCount: 34,
        missingValuesRatePercentage: 0.0,
        duplicateRowsCount: 0,
        classBalance: { safeCount: 1278, cautionCount: 639, dangerCount: 213 },
        temporalSplitWindow: "2026-06-16 to 2026-07-15",
        dataLeakageProtection: "Chronological validation window (Intermediate period)",
        provenance: createProvenanceTag("MODEL-DERIVED", "Validation dataset split"),
      },
      {
        stage: "TEST",
        stageName: "Held-Out Test Split (15%)",
        rowCount: 2130,
        featureCount: 34,
        missingValuesRatePercentage: 0.0,
        duplicateRowsCount: 0,
        classBalance: { safeCount: 1278, cautionCount: 639, dangerCount: 213 },
        temporalSplitWindow: "2026-07-16 to 2026-08-20",
        dataLeakageProtection: "Strict future held-out test evaluation set",
        provenance: createProvenanceTag("MODEL-DERIVED", "Test evaluation set"),
      },
    ],
  };
}
