export type RiskBand = "SAFE" | "CAUTION" | "DANGER";
export type IncidentStatus = "CREATED" | "VERIFIED" | "ASSIGNED" | "RESPONDING" | "RESOLVED";
export type IncidentType = "Medical" | "Harassment" | "Lost" | "Suspicious activity" | "Other";

export type GeoPoint = { lat: number; lng: number };

export type RiskZone = {
  id: string;
  name: string;
  center: GeoPoint;
  radiusM: number;
  score: number;
  band: RiskBand;
  incidentCount: number;
  updatedAt: string;
  factor: string;
};

export type Responder = {
  id: string;
  name: string;
  specialty: string;
  availability: "AVAILABLE" | "BUSY";
  eta: string;
};

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  detail: string;
  at: string;
  hash?: string;
  integrity?: "VERIFIED" | "PENDING";
};

export type Incident = {
  id: string;
  type: IncidentType;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: IncidentStatus;
  location: string;
  coordinate: GeoPoint;
  riskScore: number;
  createdAt: string;
  touristId: string;
  responderId?: string;
  responderName?: string;
  resolvedAt?: string;
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

export type RiskFeatures = {
  historicalIncidentCount: number;
  recentIncidentCount: number;
  severity: number;
  touristDensity: number;
  hour: number;
  historicalRisk: number;
};

export type RiskPrediction = {
  score: number;
  band: RiskBand;
  factors: string[];
  method: string;
};

export interface RiskPredictionService {
  predict(features: RiskFeatures): RiskPrediction;
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

function calculateSyntheticRisk(features: RiskFeatures): RiskPrediction {
  // Deterministic linear-regression-inspired prototype model. Training inputs are synthetic only.
  const raw =
    9 +
    features.historicalIncidentCount * 0.8 +
    features.recentIncidentCount * 2.6 +
    features.severity * 3.1 +
    features.touristDensity * 0.9 +
    Math.max(0, 22 - Math.abs(features.hour - 22)) * 0.38 +
    features.historicalRisk * 0.22;
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  const band: RiskBand = score >= 70 ? "DANGER" : score >= 40 ? "CAUTION" : "SAFE";
  const factors = [
    features.recentIncidentCount >= 4 ? "Recent incident activity" : "Low recent incident activity",
    features.severity >= 6 ? "Elevated incident severity" : "Moderate incident severity",
    features.touristDensity >= 6 ? "High tourist density" : "Normal tourist density",
  ];
  return { score, band, factors, method: "Synthetic linear-risk model" };
}

/**
 * Explicit local model boundary. A validated remote or on-device model can replace this service
 * without changing the caller contract or the UI's explanation behaviour.
 */
export const localRiskPredictionService: RiskPredictionService = {
  predict: calculateSyntheticRisk,
};

export function predictRisk(features: RiskFeatures): RiskPrediction {
  return localRiskPredictionService.predict(features);
}

export function makeId(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function incidentTransitionLabel(status: IncidentStatus) {
  const labels: Record<IncidentStatus, string> = {
    CREATED: "Incident created",
    VERIFIED: "Incident acknowledged and verified",
    ASSIGNED: "Responder assigned",
    RESPONDING: "Responder en route",
    RESOLVED: "Incident resolved",
  };
  return labels[status];
}

export function canTransition(from: IncidentStatus, to: IncidentStatus) {
  const transitions: Record<IncidentStatus, IncidentStatus[]> = {
    CREATED: ["VERIFIED"],
    VERIFIED: ["ASSIGNED"],
    ASSIGNED: ["RESPONDING"],
    RESPONDING: ["RESOLVED"],
    RESOLVED: [],
  };
  return transitions[from].includes(to);
}

export function validateAuditTrail(entries: AuditEntry[]) {
  if (entries.length === 0) return false;
  return entries.every((entry, index) => {
    const timestamp = Date.parse(entry.at);
    const priorTimestamp = index === 0 ? Number.NEGATIVE_INFINITY : Date.parse(entries[index - 1].at);
    return Boolean(entry.id && entry.actor && entry.action && entry.detail) && !Number.isNaN(timestamp) && timestamp >= priorTimestamp;
  });
}

export function synchronizeQueuedIncidents(queuedIncidents: Incident[], synchronizedAt = new Date().toISOString()) {
  return queuedIncidents.map((incident) => ({
    ...incident,
    audit: [
      ...incident.audit.map((entry) => entry.action === "PENDING_SYNC" ? { ...entry, action: "EDGE_CAPTURED", detail: "SOS captured locally while offline" } : entry),
      { id: makeId("AUD"), actor: "EDGE-SYNC", action: "CREATED", detail: "Queued SOS synchronized with command centre", at: synchronizedAt },
    ],
  }));
}

export function assistantReply(question: string, risk: RiskPrediction, zones: RiskZone[]) {
  const query = question.toLowerCase();
  const safeZone = zones.find((zone) => zone.band === "SAFE");
  if (query.includes("safe") || query.includes("route")) {
    return `The nearest lower-risk option is **${safeZone?.name ?? "the designated safe zone"}**. The prototype safer route is 2.6 km and has an estimated **${safeZone?.band ?? "SAFE"}** risk. It is slightly longer than the fastest route but avoids the highest-risk area.`;
  }
  if (query.includes("emergency") || query.includes("sos") || query.includes("help")) {
    return "If you feel unsafe, press **SOS**. The edge safety layer records your last known location and risk context immediately. If offline, it queues the alert securely on this device for synchronization when connectivity returns. For immediate life-threatening danger, contact local emergency services.";
  }
  if (query.includes("why") || query.includes("risk")) {
    return `The current contextual risk is **${risk.band} (${risk.score}/100)**. Contributing factors include ${risk.factors.map((factor) => factor.toLowerCase()).join(", ")}. This prototype uses transparent synthetic demonstration inputs rather than validated public safety data.`;
  }
  return `I am your local Guardian AI safety assistant. Your current contextual risk is **${risk.band} (${risk.score}/100)**. Ask why an area is risky, request a safer route, or ask what to do in an emergency.`;
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
