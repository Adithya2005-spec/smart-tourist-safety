/**
 * INCIDENT INTELLIGENCE AGENT
 * Analyzes incident data: recency weighting, severity clustering, trend detection.
 * DATA: REAL (from incident database/context) or DEMO (seeded incidents)
 */

export interface IncidentSummary {
  id: string;
  type: string;
  severity: string;
  status: string;
  priorityScore: number;
  location: string;
  createdAt: string;
  ageMinutes: number;
  recencyWeight: number;
}

export interface IncidentAgentOutput {
  agentName: "incident";
  incidentCount: number;
  activeCount: number;
  criticalCount: number;
  recentIncidents: IncidentSummary[];
  incidentDensity: number;
  incidentRisk: number;
  trend: "INCREASING" | "STABLE" | "DECREASING";
  clusterDetected: boolean;
  avgPriorityScore: number;
  provenance: "REAL" | "DEMO";
  confidence: number;
  executionMs: number;
  timestamp: string;
  dataMode: "LIVE" | "DATABASE" | "SIMULATED";
}

export interface SimpleIncident {
  id: string;
  type: string;
  severity: string;
  status: string;
  priorityScore: number;
  location: string;
  createdAt: string;
}

export function runIncidentAgent(
  incidents: SimpleIncident[] = [],
  isDemoMode = true
): IncidentAgentOutput {
  const startMs = Date.now();
  const now = new Date();

  const active = incidents.filter((i) => i.status !== "RESOLVED" && i.status !== "VERIFIED");
  const critical = active.filter((i) => i.severity === "CRITICAL" || i.severity === "HIGH");

  // Age and recency weight each incident
  const summarized: IncidentSummary[] = active.slice(0, 10).map((inc) => {
    const ageMs = now.getTime() - new Date(inc.createdAt).getTime();
    const ageMinutes = Math.round(ageMs / 60000);
    // Recency weight: fresh incidents (< 30 min) weighted higher
    const recencyWeight = ageMinutes < 30 ? 1.0 : ageMinutes < 120 ? 0.7 : 0.4;
    return { ...inc, ageMinutes, recencyWeight };
  });

  // Incident risk: weighted by recency and severity
  const severityScores: Record<string, number> = { CRITICAL: 40, HIGH: 25, MEDIUM: 12, LOW: 5 };
  const rawRisk = summarized.reduce((sum, inc) => {
    const base = severityScores[inc.severity] ?? 10;
    return sum + base * inc.recencyWeight;
  }, 0);
  const incidentRisk = Math.min(100, Math.round(rawRisk));

  // Density: incidents per unit area (simplified)
  const incidentDensity = Math.round((active.length / 10) * 100) / 100;

  // Trend: crude — if more than half are recent (< 60 min), increasing
  const recentFreshCount = summarized.filter((i) => i.ageMinutes < 60).length;
  const trend: IncidentAgentOutput["trend"] =
    active.length === 0 ? "STABLE"
    : recentFreshCount >= Math.ceil(active.length / 2) ? "INCREASING"
    : "STABLE";

  // Cluster: if 3+ incidents in same location string
  const locationCounts: Record<string, number> = {};
  active.forEach((i) => { locationCounts[i.location] = (locationCounts[i.location] ?? 0) + 1; });
  const clusterDetected = Object.values(locationCounts).some((c) => c >= 3);

  const avgPriority = active.length > 0
    ? Math.round(active.reduce((s, i) => s + i.priorityScore, 0) / active.length)
    : 0;

  return {
    agentName: "incident",
    incidentCount: incidents.length,
    activeCount: active.length,
    criticalCount: critical.length,
    recentIncidents: summarized,
    incidentDensity,
    incidentRisk,
    trend,
    clusterDetected,
    avgPriorityScore: avgPriority,
    provenance: isDemoMode ? "DEMO" : "REAL",
    confidence: 0.94,
    executionMs: Date.now() - startMs,
    timestamp: new Date().toISOString(),
    dataMode: isDemoMode ? "SIMULATED" : "LIVE",
  };
}
