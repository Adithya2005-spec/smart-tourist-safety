export type ProvenanceCategory =
  | "REAL"
  | "SYNTHETIC"
  | "SIMULATED"
  | "USER-GENERATED"
  | "MODEL-DERIVED";

export interface DataProvenanceTag {
  category: ProvenanceCategory;
  sourceDescription: string;
  timestamp: string;
  lastUpdated: string;
}

export function createProvenanceTag(
  category: ProvenanceCategory,
  description: string
): DataProvenanceTag {
  const now = new Date().toISOString();
  return {
    category,
    sourceDescription: description,
    timestamp: now,
    lastUpdated: now,
  };
}
