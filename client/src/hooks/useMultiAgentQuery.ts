/**
 * MULTI-AGENT QUERY HOOK
 * Orchestrates full multi-agent queries to /api/agent/query with automatic
 * execution state tracking, timing breakdown, and offline safety fallback.
 */

import { useState, useCallback } from "react";

export interface AgentExecutionPlan {
  requestId: string;
  intent: string;
  requiredAgents: string[];
  parallelAgents: string[];
  sequentialAgents: string[];
  priority: "low" | "medium" | "high" | "critical";
  context: {
    query: string;
    location?: string;
    stateId?: string;
    language?: "en" | "hi" | "kn";
    touristId?: string;
    incidentId?: string;
  };
  plannedAt: string;
}

export interface AgentOutputItem {
  agentName: string;
  timestamp: string;
  confidence: number;
  dataMode?: string;
  executionMs?: number;
  [key: string]: any;
}

export interface ValidationSummary {
  agentName: "evidence_validator";
  overallValidity: "VALID" | "PARTIALLY_VALID" | "DEGRADED";
  validatedAt: string;
  evidenceItems: Array<{
    source: string;
    agentName: string;
    timestamp: string;
    data: Record<string, any>;
    freshnessStatus: string;
    integrityStatus: string;
    mode: string;
    confidence: number;
    warnings: string[];
  }>;
  conflicts: Array<{
    field: string;
    agentA: string;
    valueA: any;
    agentB: string;
    valueB: any;
    resolution: string;
  }>;
  missingAgents: string[];
  dataCompleteness: number;
  trustScore: number;
  recommendedConfidenceAdjustment: number;
  warnings: string[];
  executionMs: number;
}

export interface GuardianOutput {
  agentName: "guardian_ai";
  timestamp: string;
  query: string;
  language: "en" | "hi" | "kn";
  explanation: string;
  keySafetyTips: string[];
  recommendedAction: {
    actionText: string;
    urgency: "INFO" | "ADVISORY" | "WARNING" | "IMMEDIATE_ACTION";
    hitlRequired: boolean;
  };
  confidence: number;
  modelProvenance: string;
  latencyMs: number;
}

export interface MultiAgentQueryResult {
  success: boolean;
  runId: string;
  plan: AgentExecutionPlan;
  agentOutputs: AgentOutputItem[];
  validation: ValidationSummary;
  riskAssessment: {
    overallRiskScore: number;
    riskTier: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    confidenceScore: number;
    dataCompleteness: number;
    evaluatedAt: string;
  };
  guardian: GuardianOutput;
  executionMs: number;
}

export interface MultiAgentQueryOptions {
  location?: { lat: number; lng: number };
  stateId?: string;
  language?: "en" | "hi" | "kn";
  touristId?: string;
  incidents?: any[];
  isOnline?: boolean;
}

export function useMultiAgentQuery(initialOptions: MultiAgentQueryOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<MultiAgentQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (query: string, overrideOptions: Partial<MultiAgentQueryOptions> = {}) => {
      if (!query || !query.trim()) return null;

      setIsLoading(true);
      setError(null);

      const mergedOptions = { ...initialOptions, ...overrideOptions };

      try {
        const res = await fetch("/api/agent/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: query.trim(),
            location: mergedOptions.location,
            stateId: mergedOptions.stateId || "KA",
            language: mergedOptions.language || "en",
            touristId: mergedOptions.touristId,
            incidents: mergedOptions.incidents || [],
            isOnline: mergedOptions.isOnline !== false,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "HTTP Error");
          throw new Error(`Agent query failed (${res.status}): ${errText}`);
        }

        const result: MultiAgentQueryResult = await res.json();
        setData(result);
        return result;
      } catch (err: any) {
        const msg = err?.message || "Failed to execute multi-agent query";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [initialOptions]
  );

  return {
    execute,
    isLoading,
    data,
    error,
    clear: () => {
      setData(null);
      setError(null);
    },
  };
}
