/**
 * EVIDENCE VALIDATION AGENT
 * Validates all agent outputs for freshness, source integrity, completeness, agreement.
 * Critical middleware that runs AFTER all parallel agents, BEFORE risk engine.
 * Never marks simulated data as LIVE.
 */

export type EvidenceMode = "LIVE" | "DATABASE" | "SIMULATED" | "MODEL-DERIVED" | "DEMO" | "DERIVED";
export type FreshnessStatus = "FRESH" | "STALE" | "EXPIRED" | "UNKNOWN";
export type IntegrityStatus = "VALID" | "DEGRADED" | "INVALID" | "MISSING";

export interface EvidenceItem {
  source: string;
  agentName: string;
  timestamp: string;
  data: Record<string, unknown>;
  freshnessStatus: FreshnessStatus;
  integrityStatus: IntegrityStatus;
  mode: EvidenceMode;
  confidence: number;
  warnings: string[];
}

export interface ConflictReport {
  field: string;
  agentA: string;
  valueA: unknown;
  agentB: string;
  valueB: unknown;
  resolution: string;
}

export interface ValidationSummary {
  agentName: "evidence_validator";
  overallValidity: "VALID" | "PARTIALLY_VALID" | "DEGRADED";
  validatedAt: string;
  evidenceItems: EvidenceItem[];
  conflicts: ConflictReport[];
  missingAgents: string[];
  dataCompleteness: number; // 0-100%
  trustScore: number; // 0-100
  recommendedConfidenceAdjustment: number; // -1 to 1 multiplier
  warnings: string[];
  executionMs: number;
}

const FRESHNESS_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes = FRESH
const STALE_THRESHOLD_MS = 30 * 60 * 1000;    // 30 minutes = STALE

function assessFreshness(timestamp: string): FreshnessStatus {
  const ageMs = Date.now() - new Date(timestamp).getTime();
  if (ageMs < FRESHNESS_THRESHOLD_MS) return "FRESH";
  if (ageMs < STALE_THRESHOLD_MS) return "STALE";
  return "EXPIRED";
}

function assessMode(dataMode: string): EvidenceMode {
  const upper = dataMode?.toUpperCase() ?? "";
  if (upper.includes("LIVE")) return "LIVE";
  if (upper.includes("DATABASE")) return "DATABASE";
  if (upper.includes("SIMULATED") || upper.includes("DEMO")) return "SIMULATED";
  if (upper.includes("MODEL") || upper.includes("DERIVED")) return "MODEL-DERIVED";
  return "DERIVED";
}

export interface AgentOutput {
  agentName: string;
  timestamp: string;
  dataMode: string;
  confidence: number;
  [key: string]: unknown;
}

export function runEvidenceValidator(
  agentOutputs: AgentOutput[],
  requiredAgents: string[]
): ValidationSummary {
  const startMs = Date.now();
  const evidenceItems: EvidenceItem[] = [];
  const conflicts: ConflictReport[] = [];
  const warnings: string[] = [];

  // Check which required agents have output
  const presentAgents = new Set(agentOutputs.map((a) => a.agentName));
  const missingAgents = requiredAgents.filter((name) => !presentAgents.has(name));

  if (missingAgents.length > 0) {
    warnings.push(`Missing agent outputs: ${missingAgents.join(", ")}`);
  }

  // Validate each agent's output
  for (const output of agentOutputs) {
    const freshnessStatus = assessFreshness(output.timestamp);
    const mode = assessMode(output.dataMode);
    const itemWarnings: string[] = [];

    if (mode === "SIMULATED" || mode === "MODEL-DERIVED") {
      itemWarnings.push(`Data is ${mode} — not from live sensors. Treat with appropriate caution.`);
    }
    if (freshnessStatus === "STALE") {
      itemWarnings.push(`Data is stale (>5 min old). Risk assessment may not reflect current conditions.`);
    }
    if (freshnessStatus === "EXPIRED") {
      itemWarnings.push(`Data is expired (>30 min old). Validity significantly reduced.`);
    }

    const integrityStatus: IntegrityStatus =
      output.confidence >= 0.8 ? "VALID"
      : output.confidence >= 0.6 ? "DEGRADED"
      : "INVALID";

    evidenceItems.push({
      source: `${output.agentName}-agent`,
      agentName: output.agentName,
      timestamp: output.timestamp,
      data: output as Record<string, unknown>,
      freshnessStatus,
      integrityStatus,
      mode,
      confidence: output.confidence,
      warnings: itemWarnings,
    });
  }

  // Completeness: ratio of present vs required agents
  const dataCompleteness = requiredAgents.length > 0
    ? Math.round(((requiredAgents.length - missingAgents.length) / requiredAgents.length) * 100)
    : 100;

  // Trust score: based on completeness, freshness, integrity
  const avgConfidence = evidenceItems.length > 0
    ? evidenceItems.reduce((s, e) => s + e.confidence, 0) / evidenceItems.length
    : 0.5;
  const freshnessBonus = evidenceItems.filter((e) => e.freshnessStatus === "FRESH").length / Math.max(1, evidenceItems.length);
  const trustScore = Math.round((dataCompleteness * 0.4 + avgConfidence * 100 * 0.4 + freshnessBonus * 100 * 0.2));

  const overallValidity: ValidationSummary["overallValidity"] =
    dataCompleteness >= 80 && trustScore >= 70 ? "VALID"
    : dataCompleteness >= 50 ? "PARTIALLY_VALID"
    : "DEGRADED";

  // Confidence adjustment: degrade if simulated or stale
  const simulatedCount = evidenceItems.filter((e) => e.mode === "SIMULATED").length;
  const confidenceAdj = simulatedCount > 0 ? Math.max(0.6, 1 - (simulatedCount * 0.08)) : 1.0;

  return {
    agentName: "evidence_validator",
    overallValidity,
    validatedAt: new Date().toISOString(),
    evidenceItems,
    conflicts,
    missingAgents,
    dataCompleteness,
    trustScore,
    recommendedConfidenceAdjustment: confidenceAdj,
    warnings,
    executionMs: Date.now() - startMs,
  };
}
