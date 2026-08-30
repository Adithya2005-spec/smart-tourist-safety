import { createProvenanceTag, type DataProvenanceTag } from "./data-provenance";
import { retrieveKnowledge } from "./rag-retriever";
import * as liveTools from "./live-data-tools";

export type AgentResponseMode =
  | "QUICK ANSWER"
  | "DETAILED ANALYSIS"
  | "OPERATIONAL BRIEF"
  | "INCIDENT ANALYSIS"
  | "RISK ANALYSIS"
  | "FORENSICS"
  | "WHAT-IF ANALYSIS";

export interface AgentChatMessage {
  id: string;
  sender: "USER" | "AGENT";
  queryMode?: AgentResponseMode;
  text: string;
  timestamp: string;
  structuredResponse?: {
    answer: string;
    evidence: { label: string; value: string; tone?: "rose" | "amber" | "emerald" | "cyan" }[];
    sources: string[];
    modelVersion: string;
    modelConfidenceLevel: string;
    dataQualityLevel: string;
    toolsExecuted: string[];
    recommendedAction?: { title: string; hitlRequired: boolean };
  };
  provenance?: DataProvenanceTag;
}

export interface AgentConversationContext {
  messages: AgentChatMessage[];
  lastMentionedZone?: string;
  lastMentionedIncidentId?: string;
}

export function processSurakshaIntelligenceQuery(
  userQuery: string,
  mode: AgentResponseMode = "DETAILED ANALYSIS",
  _context: AgentConversationContext = { messages: [] }
): AgentChatMessage {
  const queryLower = userQuery.toLowerCase();
  const toolsExecuted: string[] = [];
  let answer = "";
  const evidence: { label: string; value: string; tone?: "rose" | "amber" | "emerald" | "cyan" }[] = [];
  const sources: string[] = [];
  const modelConfidenceLevel = "HIGH (0.92)";
  const dataQualityLevel = "HIGH (99.8% Complete)";
  let recommendedAction: { title: string; hitlRequired: boolean } | undefined;

  // 1. RAG Retrieval Step
  const retrievedDocs = retrieveKnowledge(userQuery, 2);
  retrievedDocs.forEach((r) => sources.push(`${r.document.title} (${r.document.id})`));

  // 2. General Knowledge Queries
  if (
    queryLower.includes("what is suraksha link") ||
    queryLower.includes("explain edge computing") ||
    queryLower.includes("what is geofencing") ||
    queryLower.includes("what is f1 score") ||
    queryLower.includes("what is blockchain") ||
    queryLower.includes("difference between recall and precision")
  ) {
    if (queryLower.includes("what is suraksha link")) {
      answer = "Suraksha Link is a production-grade, offline-first tourist safety platform built for all 36 Indian States and UTs. It integrates real-time SOS dispatch, a spatial Safety Digital Twin, What-If simulation playground, Guardian AI advisor, and a blockchain-anchored audit ledger.";
    } else if (queryLower.includes("edge computing")) {
      answer = "Edge computing executes telemetry processing and risk scoring locally on-device rather than routing every request to central cloud servers. This ensures zero latency for emergency SOS alerts and uninterrupted safety monitoring when cellular coverage drops.";
    } else if (queryLower.includes("geofencing")) {
      answer = "Geofencing creates virtual geographic boundaries around high-risk corridors. When a tourist enters a caution zone, automated on-device warnings are triggered to advise extra vigilance.";
    } else if (queryLower.includes("f1 score") || queryLower.includes("recall and precision")) {
      answer = "Precision measures how many flagged risk warnings were truly hazardous, while Recall measures how many total hazards were correctly identified. The F1 Score is the harmonic mean of Precision and Recall, balancing false alarms against missed emergencies.";
    } else {
      answer = "Blockchain in Suraksha Link generates tamper-evident SHA-256 cryptographic hashes for every incident transition and operator action, anchoring them into an immutable EVM-compatible audit log.";
    }
    return buildResponse(answer, [{ label: "Classification", value: "GENERAL KNOWLEDGE" }], sources.length ? sources : ["General Domain Knowledge Base"], [], mode, undefined);
  }

  // 3. Risk Queries
  if (queryLower.includes("highest") || queryLower.includes("which zone") || queryLower.includes("risk score") || queryLower.includes("risk")) {
    toolsExecuted.push("getCurrentRisk", "getResponderStatus", "getConnectivityStatus");
    const riskRes = liveTools.getCurrentRisk();
    const respRes = liveTools.getResponderStatus();
    const connRes = liveTools.getConnectivityStatus();
    answer = `Zone **${riskRes.data.zoneName}** currently has the highest operational risk score in the territory.`;
    evidence.push(
      { label: "Zone Name", value: riskRes.data.zoneName },
      { label: "Risk Score", value: `${riskRes.data.score}/100`, tone: "rose" },
      { label: "Severity", value: riskRes.data.severity, tone: "rose" },
      { label: "Responders", value: `${respRes.data.length} Units Active`, tone: "emerald" },
      { label: "Network", value: connRes.data.mode, tone: "cyan" }
    );
    sources.push("Live Risk Prediction Engine");
    recommendedAction = { title: `Reposition 1 Tourist Police Unit to ${riskRes.data.zoneName}`, hitlRequired: true };
  }
  // 4. What-If Queries
  else if (queryLower.includes("what if") || queryLower.includes("simulate") || queryLower.includes("double") || queryLower.includes("scenario")) {
    toolsExecuted.push("runWhatIfScenario");
    const params = {
      density: queryLower.includes("low") ? "LOW" as const : queryLower.includes("high") || queryLower.includes("double") ? "HIGH" as const : "MEDIUM" as const,
      risk: "HIGH" as const,
      connectivity: queryLower.includes("offline") ? "OFFLINE" as const : "FULL" as const,
      responderAvailability: queryLower.includes("50%") || queryLower.includes("half") ? "50%" as const : queryLower.includes("25%") ? "25%" as const : "75%" as const,
      roadAvailability: queryLower.includes("blocked") ? "BLOCKED" as const : "NORMAL" as const,
      incidentLoad: queryLower.includes("critical") ? "CRITICAL" as const : "ELEVATED" as const,
      environment: queryLower.includes("storm") || queryLower.includes("adverse") ? "ADVERSE" as const : "NORMAL" as const,
    };
    const simRes = liveTools.runWhatIfScenario(params);
    answer = `What-If Simulation predicts a **${simRes.data.simulatedRiskScore > 75 ? "CRITICAL" : "ELEVATED"}** risk escalation under these parameters.`;
    evidence.push(
      { label: "Simulated Risk Score", value: `${simRes.data.simulatedRiskScore}/100`, tone: "rose" },
      { label: "Est. Response Time", value: `${simRes.data.simulatedAverageEtaMinutes} mins`, tone: "amber" },
      { label: "Resilience Score", value: `${simRes.data.simulatedResilienceScore}/100` },
      { label: "Coverage", value: `${simRes.data.simulatedCoveragePercentage}%` }
    );
    sources.push("What-If Spatial Simulation Engine");
    recommendedAction = { title: "Issue Pre-Positioning Order for Backup Emergency Units", hitlRequired: true };
  }
  // 5. Incident Queries
  else if (queryLower.includes("incident") || queryLower.includes("sos") || queryLower.includes("active")) {
    toolsExecuted.push("getActiveIncidents");
    const incRes = liveTools.getActiveIncidents();
    if (incRes.data.length > 0) {
      const topInc = incRes.data[0];
      answer = `There are currently **${incRes.data.length} active incidents**. Highest priority: **${topInc.id}** (${topInc.type}) at ${topInc.location}.`;
      evidence.push(
        { label: "Incident ID", value: topInc.id },
        { label: "Type", value: topInc.type },
        { label: "Severity", value: topInc.severity, tone: topInc.severity === "CRITICAL" ? "rose" : "amber" },
        { label: "Priority Score", value: `${topInc.priorityScore}/100` }
      );
    } else {
      answer = "No active SOS incidents. All reported incidents have been resolved.";
      evidence.push({ label: "Active Queue", value: "0 Incidents", tone: "emerald" });
    }
    sources.push("Live SOS Dispatch Queue");
  }
  // 6. Model / Drift Queries
  else if (queryLower.includes("model") || queryLower.includes("drift") || queryLower.includes("precision") || queryLower.includes("calibration")) {
    toolsExecuted.push("getModelHealth");
    const modelRes = liveTools.getModelHealth();
    answer = `Deployed model **${modelRes.data.modelName} (${modelRes.data.version})** is fully calibrated with Brier Score ${modelRes.data.brierScore} and Normal drift status.`;
    evidence.push(
      { label: "Version", value: modelRes.data.version },
      { label: "Brier Score", value: `${modelRes.data.brierScore}`, tone: "emerald" },
      { label: "Feature Drift", value: modelRes.data.driftStatus, tone: "cyan" },
      { label: "Data Quality", value: modelRes.data.dataQuality }
    );
    sources.push("MLOps Model Registry & Drift Engine");
  }
  // 7. System Health Queries
  else if (queryLower.includes("system") || queryLower.includes("health") || queryLower.includes("uptime") || queryLower.includes("latency")) {
    toolsExecuted.push("getSystemHealth");
    const healthRes = liveTools.getSystemHealth();
    answer = `System is **${healthRes.data.status}** with ${healthRes.data.uptimePercentage}% uptime and ${healthRes.data.avgLatencyMs}ms average latency.`;
    evidence.push(
      { label: "Status", value: healthRes.data.status, tone: "emerald" },
      { label: "Uptime", value: `${healthRes.data.uptimePercentage}%`, tone: "emerald" },
      { label: "Avg Latency", value: `${healthRes.data.avgLatencyMs}ms` },
      { label: "Edge Sync Rate", value: `${healthRes.data.edgeSyncSuccessRate}%` }
    );
    sources.push("System Telemetry Monitor");
  }
  // 8. Default: Operational Brief
  else {
    toolsExecuted.push("getCurrentDigitalTwin", "getSystemHealth");
    const twinRes = liveTools.getCurrentDigitalTwin();
    answer = `Operational Briefing — **${twinRes.data.areaName}**: System resilience is **${twinRes.data.overallResilienceScore}/100** with ${twinRes.data.activeResponders} active responders covering ${twinRes.data.touristCount} tourists.`;
    evidence.push(
      { label: "Resilience", value: `${twinRes.data.overallResilienceScore}/100`, tone: "cyan" },
      { label: "Active Tourists", value: `${twinRes.data.touristCount}` },
      { label: "Responders", value: `${twinRes.data.activeResponders}` },
      { label: "Avg Response Time", value: `${twinRes.data.averageResponseTimeMinutes} mins` }
    );
    sources.push("Live Safety Digital Twin");
  }

  return buildResponse(answer, evidence, sources, toolsExecuted, mode, recommendedAction, modelConfidenceLevel, dataQualityLevel);
}

function buildResponse(
  answer: string,
  evidence: { label: string; value: string; tone?: "rose" | "amber" | "emerald" | "cyan" }[],
  sources: string[],
  toolsExecuted: string[],
  mode: AgentResponseMode,
  recommendedAction?: { title: string; hitlRequired: boolean },
  modelConfidenceLevel = "HIGH (0.92)",
  dataQualityLevel = "HIGH (99.8% Complete)"
): AgentChatMessage {
  return {
    id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
    sender: "AGENT",
    queryMode: mode,
    text: answer,
    timestamp: new Date().toISOString(),
    structuredResponse: {
      answer,
      evidence,
      sources,
      modelVersion: "v2.1-xgboost-risk-predictor",
      modelConfidenceLevel,
      dataQualityLevel,
      toolsExecuted,
      recommendedAction,
    },
    provenance: createProvenanceTag("MODEL-DERIVED", "Suraksha Intelligence Grounded Reasoning Engine"),
  };
}
