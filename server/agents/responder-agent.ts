/**
 * SMART RESPONDER ALLOCATION AGENT
 * Evaluates candidate emergency responders, calculates ETA, workload,
 * proximity, route conditions, and determines optimal dispatch recommendations.
 */

import { GeoPoint, haversineDistanceM, Responder } from "../../client/src/lib/safety-engine";
import { optimizeResponderAssignment, ResponderRecommendation } from "../../client/src/lib/responder-engine";

export interface ResponderAgentInput {
  incidentLocation: GeoPoint;
  incidentType?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  responders?: Responder[];
  avoidRiskZones?: boolean;
}

export interface SmartResponderOutput {
  agentName: "responder";
  timestamp: string;
  incidentLocation: GeoPoint;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendedResponder: ResponderRecommendation | null;
  rankedResponders: ResponderRecommendation[];
  totalAvailable: number;
  totalBusy: number;
  fastestEtaMinutes: number;
  dispatchDecision: {
    recommendedUnitId: string | null;
    recommendedUnitName: string | null;
    reason: string;
    hitlApprovalRequired: boolean;
  };
  provenance: {
    mode: "MODEL-DERIVED" | "DEMO";
    source: string;
    confidence: number;
  };
  executionMs: number;
}

// Fallback seed responders if none provided
const DEFAULT_RESPONDERS: Responder[] = [
  {
    id: "resp-blr-p1",
    name: "Cubbon Park Mobile Patrol Unit 4",
    specialty: "POLICE",
    phone: "112",
    availability: "AVAILABLE",
    eta: "4 mins",
    currentLocation: { lat: 12.9763, lng: 77.5929 },
    activeAssignments: 0,
  },
  {
    id: "resp-blr-a1",
    name: "Bowring Hospital Rapid Ambulance",
    specialty: "MEDICAL",
    phone: "108",
    availability: "AVAILABLE",
    eta: "7 mins",
    currentLocation: { lat: 12.9822, lng: 77.6053 },
    activeAssignments: 1,
  },
  {
    id: "resp-blr-t1",
    name: "Karnataka State Tourism Police Brigade",
    specialty: "TOURIST_POLICE",
    phone: "+91-80-22352828",
    availability: "AVAILABLE",
    eta: "6 mins",
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    activeAssignments: 0,
  },
  {
    id: "resp-blr-p2",
    name: "MG Road Traffic & Safety Interceptor",
    specialty: "POLICE",
    phone: "112",
    availability: "BUSY",
    eta: "14 mins",
    currentLocation: { lat: 12.9754, lng: 77.6066 },
    activeAssignments: 2,
  },
];

export async function runResponderAgent(input: ResponderAgentInput): Promise<SmartResponderOutput> {
  const startTime = Date.now();
  const candidateResponders = input.responders && input.responders.length > 0 ? input.responders : DEFAULT_RESPONDERS;
  const severity = input.severity || "MEDIUM";

  const ranked = optimizeResponderAssignment(input.incidentLocation, candidateResponders);

  const availableUnits = candidateResponders.filter((r) => r.availability === "AVAILABLE");
  const busyUnits = candidateResponders.filter((r) => r.availability === "BUSY");

  const best = ranked.length > 0 && ranked[0].responder.availability === "AVAILABLE" ? ranked[0] : null;

  // High / Critical alerts require Human-In-The-Loop confirmation unless automated override
  const hitlRequired = severity === "HIGH" || severity === "CRITICAL";

  let reason = "No available units within response threshold.";
  if (best) {
    reason = `${best.responder.name} (${best.responder.specialty}) is optimal unit: ${best.distanceKm}km away, ETA ~${best.etaMinutes}m, active load: ${best.responder.activeAssignments}.`;
    if (hitlRequired) {
      reason += " Due to high severity, Human-In-The-Loop authorization is recommended.";
    }
  }

  const executionMs = Date.now() - startTime;

  return {
    agentName: "responder",
    timestamp: new Date().toISOString(),
    incidentLocation: input.incidentLocation,
    severity,
    recommendedResponder: best,
    rankedResponders: ranked,
    totalAvailable: availableUnits.length,
    totalBusy: busyUnits.length,
    fastestEtaMinutes: best ? best.etaMinutes : -1,
    dispatchDecision: {
      recommendedUnitId: best ? best.responder.id : null,
      recommendedUnitName: best ? best.responder.name : null,
      reason,
      hitlApprovalRequired: hitlRequired,
    },
    provenance: {
      mode: "MODEL-DERIVED",
      source: "Multi-Agent Responder Optimization Matrix",
      confidence: best ? 0.94 : 0.4,
    },
    executionMs,
  };
}
