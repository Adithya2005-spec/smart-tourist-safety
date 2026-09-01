import { createProvenanceTag, type DataProvenanceTag } from "./data-provenance";

export interface DatasetInspectionReport {
  datasetName: string;
  filePath: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  missingValueCount: number;
  duplicateRowCount: number;
  geographicCoverage: string;
  temporalCoverage: string;
  hasGenuineTargetLabel: boolean;
  targetVariableName: string | null;
  suitabilityStatus: "SUFFICIENT" | "INSUFFICIENT_SCHEMA_ONLY" | "PROTOTYPE_TEMPLATE";
  provenance: DataProvenanceTag;
  recommendation: string;
}

export const DATASET_PACKAGE_PATH = "D:/Users/Mahalasa/Downloads/smart-tourist-safety-codebase/suraksha_link_real_data_templates";

export function getDatasetInspectionReports(): DatasetInspectionReport[] {
  return [
    {
      datasetName: "random_forest_risk.csv",
      filePath: `${DATASET_PACKAGE_PATH}/random_forest_risk.csv`,
      rowCount: 0,
      columnCount: 7,
      columns: ["year", "state_ut", "domestic_tourist_visits", "foreign_tourist_visits", "tourism_growth_pct", "rainfall_mm", "rainfall_departure_pct"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template (Pan-India 36 States & UTs ready)",
      temporalCoverage: "Schema Template (No observations)",
      hasGenuineTargetLabel: false,
      targetVariableName: null,
      suitabilityStatus: "INSUFFICIENT_SCHEMA_ONLY",
      provenance: createProvenanceTag("SYNTHETIC", "Schema-ready template without observations"),
      recommendation: "Insufficient data for legitimate ML training. Keep Random Forest in Prototype/Simulation mode with explicit UI labeling.",
    },
    {
      datasetName: "xgboost_incident_risk.csv",
      filePath: `${DATASET_PACKAGE_PATH}/xgboost_incident_risk.csv`,
      rowCount: 0,
      columnCount: 9,
      columns: ["year", "state_ut", "domestic_tourist_visits", "foreign_tourist_visits", "previous_year_domestic_visits", "previous_year_foreign_visits", "tourism_growth_pct", "rainfall_mm", "rainfall_departure_pct"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template",
      temporalCoverage: "Schema Template (No observations)",
      hasGenuineTargetLabel: false,
      targetVariableName: null,
      suitabilityStatus: "INSUFFICIENT_SCHEMA_ONLY",
      provenance: createProvenanceTag("SYNTHETIC", "Schema-ready template without observations"),
      recommendation: "Target variable missing in template. Do not generate fake rows. Connect risk engine inference to physics/heuristic digital twin.",
    },
    {
      datasetName: "temporal_tourism_forecasting.csv",
      filePath: `${DATASET_PACKAGE_PATH}/temporal_tourism_forecasting.csv`,
      rowCount: 0,
      columnCount: 6,
      columns: ["period", "state_ut", "domestic_tourist_visits", "foreign_tourist_visits", "rainfall_mm", "rainfall_departure_pct"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template",
      temporalCoverage: "No sequential periods available",
      hasGenuineTargetLabel: false,
      targetVariableName: null,
      suitabilityStatus: "INSUFFICIENT_SCHEMA_ONLY",
      provenance: createProvenanceTag("SYNTHETIC", "Schema-ready template without observations"),
      recommendation: "No sequential observations for LSTM/Transformer forecasting. Render actual vs predicted UI in Prototype Forecast Mode.",
    },
    {
      datasetName: "isolation_tourism_anomaly.csv",
      filePath: `${DATASET_PACKAGE_PATH}/isolation_tourism_anomaly.csv`,
      rowCount: 0,
      columnCount: 7,
      columns: ["period", "state_ut", "domestic_tourist_visits", "foreign_tourist_visits", "tourism_growth_pct", "rainfall_mm", "rainfall_departure_pct"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template",
      temporalCoverage: "No observations",
      hasGenuineTargetLabel: false,
      targetVariableName: null,
      suitabilityStatus: "INSUFFICIENT_SCHEMA_ONLY",
      provenance: createProvenanceTag("SYNTHETIC", "Schema-ready template without observations"),
      recommendation: "Isolation Forest unsupervised anomaly pipeline uses live runtime telemetry stream to evaluate NORMAL vs ANOMALOUS states.",
    },
    {
      datasetName: "route_safety.csv",
      filePath: `${DATASET_PACKAGE_PATH}/route_safety.csv`,
      rowCount: 0,
      columnCount: 8,
      columns: ["route_id", "source", "destination", "distance_km", "travel_time_min", "tourist_destination_flag", "road_data_source", "safety_label"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template",
      temporalCoverage: "No observations",
      hasGenuineTargetLabel: false,
      targetVariableName: "safety_label (unpopulated)",
      suitabilityStatus: "INSUFFICIENT_SCHEMA_ONLY",
      provenance: createProvenanceTag("SYNTHETIC", "Schema-ready template without observations"),
      recommendation: "Route safety engine evaluates active risk zone intersections and distance metrics. Display fields as unavailable if unmeasured.",
    },
    {
      datasetName: "responder_allocation.csv",
      filePath: `${DATASET_PACKAGE_PATH}/responder_allocation.csv`,
      rowCount: 0,
      columnCount: 11,
      columns: ["incident_id", "incident_lat", "incident_lon", "incident_severity", "responder_id", "responder_lat", "responder_lon", "distance_km", "estimated_response_time_min", "responder_available", "assigned"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template",
      temporalCoverage: "No dispatch records",
      hasGenuineTargetLabel: false,
      targetVariableName: "assigned (unpopulated)",
      suitabilityStatus: "PROTOTYPE_TEMPLATE",
      provenance: createProvenanceTag("SYNTHETIC", "Prototype schema without historical emergency dispatch records"),
      recommendation: "Interface must state 'Prototype responder allocation' to maintain strict data provenance transparency.",
    },
    {
      datasetName: "drift_baseline.csv & drift_current.csv",
      filePath: `${DATASET_PACKAGE_PATH}/drift_baseline.csv`,
      rowCount: 0,
      columnCount: 6,
      columns: ["period", "state_ut", "domestic_tourist_visits", "foreign_tourist_visits", "rainfall_mm", "rainfall_departure_pct"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template",
      temporalCoverage: "No observations",
      hasGenuineTargetLabel: false,
      targetVariableName: null,
      suitabilityStatus: "INSUFFICIENT_SCHEMA_ONLY",
      provenance: createProvenanceTag("SYNTHETIC", "Drift baseline templates"),
      recommendation: "Drift detection uses live windowing (30-day baseline vs current 24-hour stream) via KS-statistic & PSI.",
    },
    {
      datasetName: "rag_evaluation.csv",
      filePath: `${DATASET_PACKAGE_PATH}/rag_evaluation.csv`,
      rowCount: 0,
      columnCount: 4,
      columns: ["question", "expected_document_id", "expected_answer", "category"],
      missingValueCount: 0,
      duplicateRowCount: 0,
      geographicCoverage: "Schema Template",
      temporalCoverage: "No benchmark pairs",
      hasGenuineTargetLabel: false,
      targetVariableName: "expected_answer (unpopulated)",
      suitabilityStatus: "PROTOTYPE_TEMPLATE",
      provenance: createProvenanceTag("SYNTHETIC", "RAG evaluation dataset template"),
      recommendation: "Render live RAG retrieval evaluation metrics (Context Recall, Context Precision, Faithfulness, Relevancy, Latency) on RAG Evaluation dashboard.",
    },
    {
      datasetName: "guardian_finetuning_example.jsonl",
      filePath: `${DATASET_PACKAGE_PATH}/guardian_finetuning_example.jsonl`,
      rowCount: 1,
      columnCount: 1,
      columns: ["messages"],
      missingValueCount: 2,
      duplicateRowCount: 0,
      geographicCoverage: "Single Template JSONL Line",
      temporalCoverage: "Single Example",
      hasGenuineTargetLabel: false,
      targetVariableName: null,
      suitabilityStatus: "PROTOTYPE_TEMPLATE",
      provenance: createProvenanceTag("SYNTHETIC", "Guardian AI fine-tuning template example"),
      recommendation: "Dataset contains template placeholders. System fine-tuning pipeline is fully configured and ready for expanded JSONL input.",
    },
  ];
}
