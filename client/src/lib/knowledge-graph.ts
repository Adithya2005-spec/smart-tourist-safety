import type { Incident } from "./safety-engine";

export interface EvidenceNode {
  id: string;
  label: string;
  type: "TOURIST" | "LOCATION" | "RISK" | "SOS" | "AUTHORITY" | "RESPONDER" | "ACTION" | "RESOLUTION" | "VERIFICATION";
  timestamp: string;
  detail: string;
}

export interface EvidenceEdge {
  fromId: string;
  toId: string;
  relation: string;
}

export interface IncidentEvidenceGraph {
  incidentId: string;
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
}

export interface SimilarIncidentResult {
  incidentId: string;
  type: string;
  similarityScorePercentage: number; // e.g. 94%
  historicalDate: string;
  location: string;
  outcome: string;
  handlingRecommendation: string;
  sourceClassification: "SYNTHETIC" | "REAL";
}

export function buildIncidentEvidenceGraph(incident: Incident): IncidentEvidenceGraph {
  const nodes: EvidenceNode[] = [
    {
      id: "N-TOURIST",
      label: `Tourist: ${incident.touristId}`,
      type: "TOURIST",
      timestamp: incident.createdAt,
      detail: "Verified traveller session on active network",
    },
    {
      id: "N-LOCATION",
      label: `Location: ${incident.location}`,
      type: "LOCATION",
      timestamp: incident.createdAt,
      detail: `Geo coordinates (${incident.coordinate.lat}, ${incident.coordinate.lng})`,
    },
    {
      id: "N-RISK",
      label: `Risk Score: ${incident.riskScore}/100`,
      type: "RISK",
      timestamp: incident.createdAt,
      detail: `Severity Band: ${incident.severity}`,
    },
    {
      id: "N-SOS",
      label: `SOS Triggered (${incident.type})`,
      type: "SOS",
      timestamp: incident.createdAt,
      detail: incident.notes || "Emergency signal captured",
    },
  ];

  const edges: EvidenceEdge[] = [
    { fromId: "N-TOURIST", toId: "N-LOCATION", relation: "LOCATED_AT" },
    { fromId: "N-LOCATION", toId: "N-RISK", relation: "EVALUATED_RISK" },
    { fromId: "N-RISK", toId: "N-SOS", relation: "TRIGGERED_ALERT" },
  ];

  if (incident.acknowledgedAt) {
    nodes.push({
      id: "N-[#082235]",
      label: "Authority Acknowledged",
      type: "AUTHORITY",
      timestamp: incident.acknowledgedAt,
      detail: "Command center operator assigned alert priority",
    });
    edges.push({ fromId: "N-SOS", toId: "N-[#082235]", relation: "RECEIVED_BY" });
  }

  if (incident.responderName) {
    nodes.push({
      id: "N-RESPONDER",
      label: `Responder: ${incident.responderName}`,
      type: "RESPONDER",
      timestamp: incident.assignedAt || incident.createdAt,
      detail: "Field unit dispatched & en route",
    });
    edges.push({ fromId: "N-[#082235]", toId: "N-RESPONDER", relation: "DISPATCHED_UNIT" });
  }

  if (incident.resolvedAt) {
    nodes.push({
      id: "N-RESOLUTION",
      label: "Incident Safely Resolved",
      type: "RESOLUTION",
      timestamp: incident.resolvedAt,
      detail: incident.notes || "Field operation completed successfully",
    });
    edges.push({ fromId: "N-RESPONDER", toId: "N-RESOLUTION", relation: "EXECUTED_RESCUE" });
  }

  if (incident.audit.some((a) => a.hash)) {
    const auditHash = incident.audit.find((a) => a.hash)?.hash;
    nodes.push({
      id: "N-VERIFICATION",
      label: "Cryptographic Ledger Verified",
      type: "VERIFICATION",
      timestamp: incident.resolvedAt || incident.createdAt,
      detail: `SHA-256 Hash Anchor: ${auditHash?.slice(0, 16)}...`,
    });
    edges.push({ fromId: "N-RESOLUTION", toId: "N-VERIFICATION", relation: "ANCHORED_LEDGER" });
  }

  return { incidentId: incident.id, nodes, edges };
}

export function findSimilarIncidents(targetIncident: Incident): SimilarIncidentResult[] {
  return [
    {
      incidentId: "HIST-INC-8042",
      type: targetIncident.type,
      similarityScorePercentage: 94,
      historicalDate: "2026-05-14",
      location: "MG Road, Bengaluru",
      outcome: "Resolved in 14 mins by Field Unit 04 with hotel care handoff",
      handlingRecommendation: "Dispatch rapid motorcycle response unit to avoid main boulevard traffic congestion",
      sourceClassification: "SYNTHETIC",
    },
    {
      incidentId: "HIST-INC-7210",
      type: targetIncident.type,
      similarityScorePercentage: 88,
      historicalDate: "2026-06-22",
      location: "Brigade Road Junction",
      outcome: "Resolved in 18 mins after safe corridor routing",
      handlingRecommendation: "Guide tourist toward Cubbon Park verified CCTV safety point",
      sourceClassification: "SYNTHETIC",
    },
    {
      incidentId: "HIST-INC-6504",
      type: targetIncident.type,
      similarityScorePercentage: 81,
      historicalDate: "2026-07-08",
      location: "Church Street Corridor",
      outcome: "Resolved in 11 mins by Tourist Police squad",
      handlingRecommendation: "Activate local area geofence alert to inform nearby field patrols",
      sourceClassification: "SYNTHETIC",
    },
  ];
}
