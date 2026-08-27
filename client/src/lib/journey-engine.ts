import type { GeoPoint, Incident, RiskZone } from "./safety-engine";

export type JourneyState =
  | "START"
  | "NORMAL"
  | "RISK_INCREASING"
  | "HIGH_RISK"
  | "WARNING"
  | "SOS"
  | "RISK_REDUCED";

export interface JourneyLogEntry {
  timestamp: string;
  state: JourneyState;
  locationName: string;
  riskScore: number;
  triggerEvent: string;
}

export interface PreSOSWarningSignal {
  triggered: boolean;
  severity: "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  reasons: string[];
  recommendedSaferRouteId?: string;
  canDismiss: boolean;
}

export function evaluateJourneyState(
  currentRiskScore: number,
  isRouteDeviated: boolean,
  isConnectivityDegraded: boolean,
  nearbyIncidentsCount: number,
  currentJourneyState: JourneyState = "NORMAL"
): { nextState: JourneyState; logMessage: string } {
  if (currentJourneyState === "SOS") {
    return { nextState: "SOS", logMessage: "Emergency SOS remains active in command queue." };
  }

  if (currentRiskScore >= 75 || (currentRiskScore >= 65 && isRouteDeviated && nearbyIncidentsCount > 0)) {
    return {
      nextState: "WARNING",
      logMessage: "Pre-SOS warning triggered due to high risk score and active surrounding hazards.",
    };
  }

  if (currentRiskScore >= 55 || isRouteDeviated) {
    return {
      nextState: "HIGH_RISK",
      logMessage: "Elevated risk zone entry or route deviation detected.",
    };
  }

  if (currentRiskScore >= 35) {
    return {
      nextState: "RISK_INCREASING",
      logMessage: "Contextual risk increasing based on temporal and zonal factors.",
    };
  }

  if (currentJourneyState === "RISK_REDUCED" && currentRiskScore < 30) {
    return {
      nextState: "NORMAL",
      logMessage: "Safety conditions restored to normal levels.",
    };
  }

  return {
    nextState: "NORMAL",
    logMessage: "Journey proceeding under standard safe conditions.",
  };
}

export function evaluatePreSOSWarning(
  riskScore: number,
  isRouteDeviated: boolean,
  isConnectivityDegraded: boolean,
  nearbyIncidents: Incident[],
  activeZone?: RiskZone
): PreSOSWarningSignal {
  const reasons: string[] = [];

  if (riskScore >= 60) {
    reasons.push(`Current contextual risk score is elevated (${riskScore}/100)`);
  }
  if (activeZone && (activeZone.band === "DANGER" || activeZone.score >= 65)) {
    reasons.push(`Entered high-risk dynamic zone: ${activeZone.name}`);
  }
  if (isRouteDeviated) {
    reasons.push("Significant route deviation from standard transit corridor detected");
  }
  if (nearbyIncidents.length > 0) {
    reasons.push(`${nearbyIncidents.length} active emergency incident(s) reported in immediate vicinity`);
  }
  if (isConnectivityDegraded) {
    reasons.push("Network connectivity degradation detected — edge offline mode active");
  }

  const triggered = reasons.length >= 2 || riskScore >= 70;

  return {
    triggered,
    severity: riskScore >= 75 ? "CRITICAL" : riskScore >= 60 ? "HIGH" : "MEDIUM",
    title: "Pre-SOS Preventive Safety Advisory",
    message: "Your current journey conditions indicate elevated safety risk. A monitored safer route detour is recommended.",
    reasons: reasons.length ? reasons : ["Elevated overall risk signals"],
    recommendedSaferRouteId: "ROUTE-B",
    canDismiss: true,
  };
}
