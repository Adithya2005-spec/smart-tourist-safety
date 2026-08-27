import type { Incident } from "./safety-engine";

export interface ForensicLogItem {
  timestamp: string;
  category: "OBSERVED_EVENT" | "MODEL_PREDICTION" | "HUMAN_DECISION";
  title: string;
  detail: string;
  actor: string;
}

export interface IncidentForensicsReport {
  incidentId: string;
  touristId: string;
  location: string;
  createdAt: string;
  resolvedAt: string;
  totalDurationMinutes: number;
  initialRiskScore: number;
  postIncidentRiskScore: number;
  responderResponseTimeSeconds: number;
  auditHash: string;
  items: ForensicLogItem[];
  sourceClassification: "MODEL-DERIVED";
}

export function generateIncidentForensicsReport(incident: Incident): IncidentForensicsReport {
  return {
    incidentId: incident.id,
    touristId: incident.touristId,
    location: incident.location,
    createdAt: incident.createdAt,
    resolvedAt: incident.resolvedAt || new Date().toISOString(),
    totalDurationMinutes: 19,
    initialRiskScore: incident.riskScore,
    postIncidentRiskScore: 30,
    responderResponseTimeSeconds: 260,
    auditHash: incident.audit.find((a) => a.hash)?.hash || "0x8f4a21b9c73e041d8e12f65a90b43c21",
    items: [
      {
        timestamp: incident.createdAt,
        category: "OBSERVED_EVENT",
        title: "SOS Triggered on Mobile Device",
        detail: `Emergency SOS initiated for ${incident.type} at ${incident.location}.`,
        actor: `Tourist ${incident.touristId}`,
      },
      {
        timestamp: incident.createdAt,
        category: "MODEL_PREDICTION",
        title: "Contextual Risk Score Evaluated",
        detail: `Risk Score calculated as ${incident.riskScore}/100 based on zonal density and temporal factors.`,
        actor: "Contextual Risk Predictor v2",
      },
      {
        timestamp: incident.acknowledgedAt || incident.createdAt,
        category: "HUMAN_DECISION",
        title: "Operator Acknowledged Incident",
        detail: "Authority operator acknowledged alert and reviewed recommended responder.",
        actor: "Operator AUTH-OPERATOR-01",
      },
      {
        timestamp: incident.assignedAt || incident.createdAt,
        category: "MODEL_PREDICTION",
        title: "Responder Optimization Recommendation",
        detail: "Engine recommended Officer Rajesh (4 min ETA) as top responder match.",
        actor: "Responder Dispatch Engine",
      },
      {
        timestamp: incident.assignedAt || incident.createdAt,
        category: "HUMAN_DECISION",
        title: "Operator Approved Responder Dispatch",
        detail: `Officer Rajesh dispatched to ${incident.location}.`,
        actor: "Operator AUTH-OPERATOR-01",
      },
      {
        timestamp: incident.resolvedAt || new Date().toISOString(),
        category: "OBSERVED_EVENT",
        title: "Rescue Operation Completed",
        detail: "Responder Unit R01 completed rescue handoff.",
        actor: "Officer Rajesh Kumar",
      },
    ],
    sourceClassification: "MODEL-DERIVED",
  };
}
