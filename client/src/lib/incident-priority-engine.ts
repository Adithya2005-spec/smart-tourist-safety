import type { Incident } from "./safety-engine";

export type PriorityTier = "P1 CRITICAL" | "P2 HIGH" | "P3 MEDIUM" | "P4 LOW";

export interface PrioritizedIncident {
  incidentId: string;
  type: string;
  location: string;
  createdAt: string;
  priorityTier: PriorityTier;
  priorityScore: number;
  reasons: string[];
  sourceClassification: "MODEL-DERIVED";
}

export function computeIncidentPriorities(incidents: Incident[]): PrioritizedIncident[] {
  return incidents.map((inc) => {
    let score = inc.riskScore;
    const reasons: string[] = [];

    if (inc.severity === "CRITICAL" || inc.severity === "HIGH") {
      score += 25;
      reasons.push(`High incident severity level (${inc.severity})`);
    }

    if (inc.type === "Medical" || inc.type === "Harassment" || inc.type === "Suspicious activity") {
      score += 20;
      reasons.push(`High-priority emergency type: ${inc.type}`);
    }

    if (!inc.responderId) {
      score += 15;
      reasons.push("Unassigned responder unit (requires immediate dispatch)");
    }

    const priorityTier: PriorityTier =
      score >= 85 ? "P1 CRITICAL" : score >= 65 ? "P2 HIGH" : score >= 45 ? "P3 MEDIUM" : "P4 LOW";

    return {
      incidentId: inc.id,
      type: inc.type,
      location: inc.location,
      createdAt: inc.createdAt,
      priorityTier,
      priorityScore: score,
      reasons: reasons.length ? reasons : ["Standard baseline priority score"],
      sourceClassification: "MODEL-DERIVED",
    };
  });
}
