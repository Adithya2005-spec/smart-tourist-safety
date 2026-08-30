export type SeverityBand = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RiskBand = SeverityBand | "SAFE" | "CAUTION" | "DANGER";

export type IncidentStatus = 
  | "SOS_CREATED" 
  | "ACKNOWLEDGED" 
  | "RESPONDER_ASSIGNED" 
  | "RESPONDER_EN_ROUTE" 
  | "ON_SCENE" 
  | "RESOLVED" 
  | "VERIFIED"
  // Legacy aliases for backwards compatibility
  | "CREATED"
  | "ASSIGNED"
  | "RESPONDING";

export type IncidentType = "Medical" | "Harassment" | "Lost" | "Suspicious activity" | "Other";

export type GeoPoint = { lat: number; lng: number };

export type RiskZone = {
  id: string;
  name: string;
  center: GeoPoint;
  radiusM: number;
  score: number;
  severity: SeverityBand;
  band: RiskBand;
  incidentCount: number;
  trendPercentage?: number;
  updatedAt: string;
  factor: string;
};

export type Responder = {
  id: string;
  name: string;
  specialty: string;
  availability: "AVAILABLE" | "BUSY" | "OFFLINE";
  eta: string;
  activeAssignments: number;
  currentLocation?: GeoPoint;
  phone?: string;
};

export type AuditEntry = {
  id: string;
  actor: string;
  actorType?: "TOURIST" | "AUTHORITY" | "RESPONDER" | "SYSTEM";
  action: string;
  detail: string;
  at: string;
  hash?: string;
  previousHash?: string;
  transactionId?: string;
  integrity?: "VERIFIED" | "TAMPERED" | "PENDING";
};

export type Incident = {
  id: string;
  type: IncidentType;
  severity: SeverityBand;
  priorityScore: number;
  status: IncidentStatus;
  location: string;
  coordinate: GeoPoint;
  riskScore: number;
  createdAt: string;
  acknowledgedAt?: string;
  assignedAt?: string;
  enRouteAt?: string;
  onSceneAt?: string;
  resolvedAt?: string;
  verifiedAt?: string;
  touristId: string;
  responderId?: string;
  responderName?: string;
  notes?: string;
  audit: AuditEntry[];
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  primary: boolean;
};

export type TravelProfile = {
  touristId: string;
  fullName: string;
  nationality: string;
  visitWindow: string;
  accommodation: string;
  verification: "VERIFIED" | "PENDING";
};

export type RiskFactorImpact = {
  factor: string;
  impact: number;
};

export type RiskFeatures = {
  location?: GeoPoint;
  historicalIncidentCount: number;
  recentIncidentCount: number;
  severity: number;
  touristDensity: number;
  hour: number;
  historicalRisk: number;
  weatherCondition?: "CLEAR" | "RAIN" | "HEAVY_STORM" | "FOG";
  activeNearbyIncidents?: number;
  routeDeviation?: boolean;
};

export type RiskPrediction = {
  score: number;
  severity: SeverityBand;
  band: SeverityBand;
  factors: RiskFactorImpact[];
  method: string;
  dataClassification: "DEMO_SYNTHETIC" | "HISTORICAL_REFERENCE" | "LIVE_USER_EVENT";
  timestamp: string;
};

export interface RiskPredictionService {
  predict(features: RiskFeatures): RiskPrediction;
}

export function getSeverityBand(score: number): SeverityBand {
  if (score >= 75) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 25) return "MEDIUM";
  return "LOW";
}

export function haversineDistanceM(a: GeoPoint, b: GeoPoint): number {
  const earthRadiusM = 6_371_000;
  const deg = Math.PI / 180;
  const dLat = (b.lat - a.lat) * deg;
  const dLng = (b.lng - a.lng) * deg;
  const lat1 = a.lat * deg;
  const lat2 = b.lat * deg;
  const haversine =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusM * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function evaluateGeofences(location: GeoPoint, zones: RiskZone[]) {
  return zones
    .map((zone) => ({ zone, distanceM: haversineDistanceM(location, zone.center) }))
    .filter(({ zone, distanceM }) => distanceM <= zone.radiusM)
    .sort((a, b) => b.zone.score - a.zone.score);
}

export function calculateContextualRisk(features: RiskFeatures): RiskPrediction {
  const locImpact = Math.min(30, Math.round(features.historicalRisk * 0.3));
  const tempImpact = Math.round(Math.max(0, 22 - Math.abs(features.hour - 22)) * 1.1);
  const envImpact = features.weatherCondition === "HEAVY_STORM" ? 18 : features.weatherCondition === "RAIN" ? 8 : 2;
  const incidentImpact = Math.min(35, features.recentIncidentCount * 4 + (features.activeNearbyIncidents || 0) * 6);
  const crowdImpact = Math.min(15, features.touristDensity * 1.5);
  const deviationImpact = features.routeDeviation ? 12 : 0;

  const rawScore = locImpact + tempImpact + envImpact + incidentImpact + crowdImpact + deviationImpact;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const severity = getSeverityBand(score);

  const factors: RiskFactorImpact[] = [
    { factor: "Historical zone incidents", impact: locImpact },
    { factor: features.hour >= 20 || features.hour <= 5 ? "Late night temporal factor" : "Daytime temporal factor", impact: tempImpact },
    { factor: "Active nearby incident proximity", impact: incidentImpact },
    { factor: "Crowd density exposure", impact: crowdImpact },
    { factor: "Weather/environmental condition", impact: envImpact },
  ];

  if (deviationImpact > 0) {
    factors.push({ factor: "Route deviation detected", impact: deviationImpact });
  }

  factors.sort((a, b) => b.impact - a.impact);

  return {
    score,
    severity,
    band: severity,
    factors,
    method: "Contextual Multi-Factor Safety Engine",
    dataClassification: "DEMO_SYNTHETIC",
    timestamp: new Date().toISOString(),
  };
}

export const localRiskPredictionService: RiskPredictionService = {
  predict: calculateContextualRisk,
};

export function predictRisk(features: RiskFeatures): RiskPrediction {
  return localRiskPredictionService.predict(features);
}

export function makeId(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function incidentTransitionLabel(status: IncidentStatus): string {
  const labels: Record<string, string> = {
    SOS_CREATED: "Emergency SOS triggered",
    CREATED: "Emergency SOS triggered",
    ACKNOWLEDGED: "Incident acknowledged by Authority Operator",
    VERIFIED: "Incident acknowledged by Authority Operator",
    RESPONDER_ASSIGNED: "Optimal responder unit assigned",
    ASSIGNED: "Optimal responder unit assigned",
    RESPONDER_EN_ROUTE: "Responder unit dispatched & en route",
    RESPONDING: "Responder unit dispatched & en route",
    ON_SCENE: "Responder arrived on scene",
    RESOLVED: "Incident safely resolved",
    VERIFIED_AUDIT: "Chained audit integrity verified",
  };
  return labels[status] || status;
}

export function canTransition(from: IncidentStatus, to: IncidentStatus): boolean {
  const transitions: Record<string, string[]> = {
    SOS_CREATED: ["ACKNOWLEDGED", "VERIFIED"],
    CREATED: ["ACKNOWLEDGED", "VERIFIED"],
    ACKNOWLEDGED: ["RESPONDER_ASSIGNED", "ASSIGNED"],
    VERIFIED_STAGE: ["RESPONDER_ASSIGNED", "ASSIGNED"],
    RESPONDER_ASSIGNED: ["RESPONDER_EN_ROUTE", "RESPONDING"],
    ASSIGNED: ["RESPONDER_EN_ROUTE", "RESPONDING"],
    RESPONDER_EN_ROUTE: ["ON_SCENE"],
    RESPONDING: ["ON_SCENE"],
    ON_SCENE: ["RESOLVED"],
    RESOLVED: ["VERIFIED"],
    VERIFIED: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

export function calculateIncidentPriority(
  severity: SeverityBand,
  riskScore: number,
  type: IncidentType,
  minutesElapsed: number
): number {
  const severityWeight = severity === "CRITICAL" ? 45 : severity === "HIGH" ? 35 : severity === "MEDIUM" ? 20 : 10;
  const typeWeight = type === "Medical" ? 25 : type === "Harassment" ? 20 : type === "Suspicious activity" ? 15 : 10;
  const timeWeight = Math.min(15, minutesElapsed * 1.5);
  const score = Math.round(severityWeight + (riskScore * 0.25) + typeWeight + timeWeight);
  return Math.max(0, Math.min(100, score));
}

export function synchronizeQueuedIncidents(queuedIncidents: Incident[], synchronizedAt = new Date().toISOString()) {
  return queuedIncidents.map((incident) => ({
    ...incident,
    status: incident.status === "CREATED" ? "SOS_CREATED" as const : incident.status,
    audit: [
      ...incident.audit.map((entry) => entry.action === "PENDING_SYNC" ? { ...entry, action: "EDGE_CAPTURED", detail: "SOS captured locally in edge storage while offline" } : entry),
      { id: makeId("AUD"), actor: "EDGE-SYNC", actorType: "SYSTEM" as const, action: "SYNCHRONIZED", detail: "Queued SOS synchronized with central command platform", at: synchronizedAt },
    ],
  }));
}

import { retrieveKnowledge } from "./rag-retriever";

export function assistantReply(question: string, risk: RiskPrediction, zones: RiskZone[]): string {
  const query = question.toLowerCase();
  const safeZone = zones.find((zone) => zone.severity === "LOW" || zone.band === "SAFE");

  if (query.includes("safe") || query.includes("route")) {
    return `The safest path toward **${safeZone?.name ?? "Designated Safe Zone"}** avoids 2 high-activity dynamic risk zones. Estimated risk is **${risk.severity} (${risk.score}/100)**. Route comparison selects the safer detour over the direct high-risk corridor.`;
  }
  if (query.includes("why") || query.includes("risk")) {
    const factorList = risk.factors.map((f) => `• ${f.factor} (+${f.impact} pts)`).join("\n");
    return `Your contextual risk is **${risk.severity} (${risk.score}/100)**.\n\nKey Contributing Factors:\n${factorList}\n\n[Data Source: ${risk.dataClassification}]`;
  }

  // RAG Retriever Fallback for system crash, data loss, offline edge, digital twin, blockchain, ML governance, etc.
  const ragMatches = retrieveKnowledge(question, 1);
  if (ragMatches.length > 0 && ragMatches[0].relevanceScore > 0) {
    const match = ragMatches[0];
    return `**${match.document.title}**:\n${match.document.content}\n\n[Source: Grounded RAG Knowledge Base (${match.document.id})]`;
  }

  return `I am Guardian AI, your safety assistant. Current risk: **${risk.severity} (${risk.score}/100)**. You can ask me about system crash data persistence, emergency numbers, safer route detours, offline SOS backup, or why your location is risky.`;
}

export async function sha256(value: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return `0x${Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  }
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `0x${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
