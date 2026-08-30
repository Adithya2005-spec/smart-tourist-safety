import { createProvenanceTag, type DataProvenanceTag } from "./data-provenance";

export interface LoRATrainingPair {
  id: string;
  instruction: string;
  context: string;
  response: string;
  category: "INCIDENT_ANALYSIS" | "RISK_EXPLANATION" | "HITL_RECOMMENDATION" | "POLICY_INTERPRETATION" | "FORENSICS_SUMMARY";
  tokenCount: number;
}

export interface LoRAHyperparameters {
  baseModel: string;
  loraRankR: number;
  loraAlpha: number;
  targetModules: string[];
  loraDropout: number;
  bias: string;
  taskType: string;
  learningRate: number;
  batchSize: number;
  numEpochs: number;
  weightDecay: number;
}

export interface LoRAFinetuningDatasetExport {
  datasetId: string;
  version: string;
  exportTimestamp: string;
  totalPairsCount: number;
  format: "JSONL (Alpaca / ShareGPT Standard)";
  hyperparameters: LoRAHyperparameters;
  pairs: LoRATrainingPair[];
  provenance: DataProvenanceTag;
}

export const defaultLoRAConfig: LoRAHyperparameters = {
  baseModel: "meta-llama/Meta-Llama-3-8B-Instruct",
  loraRankR: 16,
  loraAlpha: 32,
  targetModules: ["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
  loraDropout: 0.05,
  bias: "none",
  taskType: "CAUSAL_LM",
  learningRate: 2e-4,
  batchSize: 4,
  numEpochs: 3,
  weightDecay: 0.01,
};

export function generateLoRAFinetuningDataset(): LoRAFinetuningDatasetExport {
  const pairs: LoRATrainingPair[] = [
    {
      id: "LORA-EX-01",
      category: "INCIDENT_ANALYSIS",
      instruction: "Analyze this safety incident and assign operational priority.",
      context:
        "Incident: INC-1042\nType: Harassment\nLocation: MG Road Transit Corridor\nRisk Score: 78/100\nTourist Density: 2.2x\nResponder Availability: 40%\nConnectivity: DEGRADED",
      response:
        "OPERATIONAL ANALYSIS:\n• Severity: HIGH\n• Priority Score: 88/100 (P1 CRITICAL)\n• Primary Hazard: High crowd density combined with responder deficit (40% coverage) and degraded cellular connectivity.\n• Recommended Action: Immediately dispatch nearest Tourist Police Unit (R01) and activate female safeguard corridor monitoring.",
      tokenCount: 142,
    },
    {
      id: "LORA-EX-02",
      category: "RISK_EXPLANATION",
      instruction: "Explain why the tourist safety score was reduced to 58/100.",
      context:
        "Tourist ID: SURAKSHA-IND-KA-9042\nLocation: Hampi Boulder Trails\nTime: 18:45 IST (Sunset)\nWeather: Clear\nCellular Coverage: 35% (1 Bar)\nHistorical Incidents: 2 recent terrain falls",
      response:
        "RISK EXPLANATION:\n• Safety Score: 58/100 (CAUTION)\n• Contributing Factors:\n  1. Late hour after dusk (+18 pts risk)\n  2. Uneven boulder terrain with 35% cellular coverage (+14 pts risk)\n  3. Distance from nearest emergency kiosk (+10 pts risk)\n• Guidance: Advise tourist to stay on lit trails and return to base camp before full darkness.",
      tokenCount: 156,
    },
    {
      id: "LORA-EX-03",
      category: "HITL_RECOMMENDATION",
      instruction: "Generate Next Best Action (NBA) for Command Officer review.",
      context:
        "Zone: Sector 4 Promenade\nActive SOS: 2 Unassigned Medical Alerts\nAvailable Responders: Unit R03 (1.2 km away), Unit R07 (4.5 km away)\nRoad State: 80% Open",
      response:
        "NEXT BEST ACTION (HITL REVIEW REQUIRED):\n• Recommended Action: Assign Unit R03 to Medical SOS INC-1048.\n• Rationale: Unit R03 has shortest ETA (3.2 minutes) and direct unblocked access via Sector 4 main artery.\n• Governance: Requires operator authorization before dispatch signal.",
      tokenCount: 135,
    },
    {
      id: "LORA-EX-04",
      category: "POLICY_INTERPRETATION",
      instruction: "State the emergency escalation policy if responder unit fails to acknowledge SOS.",
      context:
        "SOS Severity: CRITICAL\nElapsed Time: 195 seconds\nAssigned Unit: Tourist Police Unit R02\nAcknowledged: False",
      response:
        "POLICY INTERPRETATION:\n• Policy: National Emergency Escalation Protocol (KNOW-POLICY-01)\n• Trigger: Elapsed time (195s) exceeds 180s response SLA threshold.\n• Escalation: Automatically escalate incident priority to District Command Officer override and auto-assign secondary backup unit R05 within 5km radius.",
      tokenCount: 140,
    },
  ];

  return {
    datasetId: "DS-LORA-SURAKSHA-v1.0",
    version: "v1.0-lora-instruct",
    exportTimestamp: new Date().toISOString(),
    totalPairsCount: pairs.length,
    format: "JSONL (Alpaca / ShareGPT Standard)",
    hyperparameters: defaultLoRAConfig,
    pairs,
    provenance: createProvenanceTag("MODEL-DERIVED", "LoRA/PEFT Fine-Tuning Domain Training Pairs"),
  };
}

export function exportDatasetToJSONL(dataset: LoRAFinetuningDatasetExport): string {
  return dataset.pairs
    .map((p) =>
      JSON.stringify({
        instruction: p.instruction,
        input: p.context,
        output: p.response,
        metadata: { id: p.id, category: p.category, token_count: p.tokenCount },
      })
    )
    .join("\n");
}
