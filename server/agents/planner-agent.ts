/**
 * SAFETY PLANNER AGENT
 * Classifies user intent and determines which specialist agents to invoke.
 * Intelligent routing — does NOT call every agent for every request.
 */

export type AgentIntent =
  | "location_safety"
  | "incident_query"
  | "weather_query"
  | "crowd_query"
  | "historical_risk"
  | "connectivity_query"
  | "route_request"
  | "responder_query"
  | "what_if_simulation"
  | "general_briefing"
  | "sos_support"
  | "model_health"
  | "system_health";

export type AgentName =
  | "location"
  | "incident"
  | "weather"
  | "crowd"
  | "history"
  | "connectivity"
  | "evidence_validator"
  | "risk_engine"
  | "guardian_ai"
  | "responder"
  | "route";

export interface AgentExecutionPlan {
  requestId: string;
  intent: AgentIntent;
  requiredAgents: AgentName[];
  parallelAgents: AgentName[];
  sequentialAgents: AgentName[];
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

const INTENT_PATTERNS: Record<AgentIntent, string[]> = {
  location_safety: ["safe", "area", "zone", "nearby", "location", "place", "visit", "go to", "is it safe"],
  incident_query: ["incident", "sos", "active", "emergency", "report", "happening", "alert"],
  weather_query: ["weather", "rain", "rainfall", "storm", "wind", "temperature", "flood", "aws", "environmental", "monsoon"],
  crowd_query: ["crowd", "density", "busy", "people", "congestion", "packed", "tourists"],
  historical_risk: ["historical", "history", "pattern", "past", "previous", "trend", "time of day", "evening", "night"],
  connectivity_query: ["connectivity", "network", "signal", "offline", "online", "connection", "internet"],
  route_request: ["route", "path", "way", "directions", "get there", "travel", "safest way", "navigate"],
  responder_query: ["responder", "police", "unit", "dispatch", "assign", "officer", "available"],
  what_if_simulation: ["what if", "simulate", "scenario", "double", "if density", "if responders", "hypothetical"],
  general_briefing: ["brief", "overview", "status", "operational", "summary", "update", "dashboard"],
  sos_support: ["help me", "danger", "injured", "lost", "harassed", "emergency help", "sos"],
  model_health: ["model", "drift", "precision", "calibration", "ml", "accuracy", "brier"],
  system_health: ["system", "health", "uptime", "latency", "server", "performance"],
};

const INTENT_AGENT_MAP: Record<AgentIntent, AgentName[]> = {
  location_safety: ["location", "incident", "weather", "crowd", "history", "connectivity"],
  incident_query: ["incident", "location", "responder"],
  weather_query: ["weather", "location"],
  crowd_query: ["crowd", "location"],
  historical_risk: ["history", "location"],
  connectivity_query: ["connectivity"],
  route_request: ["location", "incident", "weather", "crowd", "route"],
  responder_query: ["responder", "incident", "location"],
  what_if_simulation: ["location", "incident", "crowd", "weather"],
  general_briefing: ["location", "incident", "weather", "crowd", "history", "connectivity"],
  sos_support: ["location", "incident", "responder", "connectivity"],
  model_health: [],
  system_health: [],
};

const PARALLEL_SAFE_AGENTS: AgentName[] = ["location", "incident", "weather", "crowd", "history", "connectivity"];

export function classifyIntent(query: string): AgentIntent {
  const lower = query.toLowerCase();
  let bestIntent: AgentIntent = "general_briefing";
  let bestScore = 0;
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS) as [AgentIntent, string[]][]) {
    const score = patterns.filter((p) => lower.includes(p)).length;
    if (score > bestScore) { bestScore = score; bestIntent = intent; }
  }
  return bestIntent;
}

export function determinePriority(intent: AgentIntent): AgentExecutionPlan["priority"] {
  if (intent === "sos_support") return "critical";
  if (intent === "incident_query" || intent === "location_safety") return "high";
  if (intent === "route_request" || intent === "responder_query") return "medium";
  return "low";
}

export function createExecutionPlan(
  query: string,
  options: { location?: string; stateId?: string; language?: "en" | "hi" | "kn"; touristId?: string; incidentId?: string } = {}
): AgentExecutionPlan {
  const intent = classifyIntent(query);
  const requiredAgents = INTENT_AGENT_MAP[intent] ?? PARALLEL_SAFE_AGENTS;
  const parallelAgents = requiredAgents.filter((a) => PARALLEL_SAFE_AGENTS.includes(a));
  const sequentialAgents: AgentName[] = requiredAgents.length > 0
    ? ["evidence_validator", "risk_engine", "guardian_ai"]
    : [];
  return {
    requestId: `REQ-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    intent,
    requiredAgents: Array.from(new Set([...requiredAgents, ...sequentialAgents])),
    parallelAgents,
    sequentialAgents,
    priority: determinePriority(intent),
    context: { query, location: options.location, stateId: options.stateId ?? "KA", language: options.language ?? "en", touristId: options.touristId, incidentId: options.incidentId },
    plannedAt: new Date().toISOString(),
  };
}
