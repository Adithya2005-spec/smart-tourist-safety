export interface ChaosSimulationState {
  cloudOutage: boolean;
  internetOutage: boolean;
  dbOutage: boolean;
  gpsUnavailable: boolean;
  aiServiceDown: boolean;
  responderUnavailable: boolean;
  roadClosure: boolean;
}

export const defaultChaosState: ChaosSimulationState = {
  cloudOutage: false,
  internetOutage: false,
  dbOutage: false,
  gpsUnavailable: false,
  aiServiceDown: false,
  responderUnavailable: false,
  roadClosure: false,
};

export interface SystemResilienceResponse {
  activeFailuresCount: number;
  systemMode: "NORMAL_CLOUD" | "DEGRADED_EDGE" | "EMERGENCY_FALLBACK";
  resilienceMessage: string;
  mitigationSteps: string[];
  isSimulated: boolean;
  sourceClassification: "SIMULATION";
}

export function evaluateChaosResilience(state: ChaosSimulationState): SystemResilienceResponse {
  const activeFailures = Object.values(state).filter(Boolean).length;

  if (activeFailures === 0) {
    return {
      activeFailuresCount: 0,
      systemMode: "NORMAL_CLOUD",
      resilienceMessage: "All cloud, network, GPS, and dispatch services operating normally.",
      mitigationSteps: ["Continuous telemetry sync active", "Primary database connected"],
      isSimulated: false,
      sourceClassification: "SIMULATION",
    };
  }

  const steps: string[] = [];

  if (state.cloudOutage || state.internetOutage) {
    steps.push("Switching to EDGE SAFETY MODE — Local Haversine geofences active on device");
    steps.push("SOS queue buffering events locally in IndexedDB store-and-forward buffer");
  }

  if (state.aiServiceDown) {
    steps.push("Activating deterministic policy fallback — AI recommendation replaced by rule engine");
  }

  if (state.gpsUnavailable) {
    steps.push("Falling back to last known cellular cell-tower coarse geohash coordinates");
  }

  if (state.responderUnavailable) {
    steps.push("Triggering multi-agency escalation — Alerting state police secondary reserve unit");
  }

  return {
    activeFailuresCount: activeFailures,
    systemMode: state.cloudOutage || state.internetOutage ? "DEGRADED_EDGE" : "EMERGENCY_FALLBACK",
    resilienceMessage: `Chaos Simulator Active: ${activeFailures} infrastructure component(s) failed. System operating autonomously.`,
    mitigationSteps: steps,
    isSimulated: true,
    sourceClassification: "SIMULATION",
  };
}
