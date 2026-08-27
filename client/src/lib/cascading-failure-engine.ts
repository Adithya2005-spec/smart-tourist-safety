export interface DependencyChainStep {
  stepIndex: number;
  failureComponent: string;
  resultingEffect: string;
  mitigationProtocol: string;
  dataSafetyStatus: string;
}

export interface CascadingFailureAnalysis {
  title: string;
  compoundingRiskScore: number;
  compoundingEtaMinutes: number;
  coverageDropPercentage: number;
  dependencyChain: DependencyChainStep[];
  touristDataSafetyDescription: string;
  sourceClassification: "SIMULATION";
}

export function computeCascadingFailureAnalysis(
  internetOutage: boolean = true,
  responderUnavailable: boolean = true,
  roadBlocked: boolean = true
): CascadingFailureAnalysis {
  return {
    title: "Cascading Infrastructure Failure Analysis",
    compoundingRiskScore: 88,
    compoundingEtaMinutes: 14.5,
    coverageDropPercentage: 54,
    dependencyChain: [
      {
        stepIndex: 1,
        failureComponent: "Internet / Cloud Link Outage",
        resultingEffect: "Central server synchronization delayed",
        mitigationProtocol: "Level 3 Edge-Only Autonomous Mode activated",
        dataSafetyStatus: "PII & SOS buffered locally in IndexedDB encrypted store",
      },
      {
        stepIndex: 2,
        failureComponent: "Primary Responder Dropout",
        resultingEffect: "Officer unit R17 unavailable for direct dispatch",
        mitigationProtocol: "Secondary state police reserve unit alerted via edge SMS fallback",
        dataSafetyStatus: "Emergency contact dispatch payload retained in local queue",
      },
      {
        stepIndex: 3,
        failureComponent: "Road Corridor Blocked",
        resultingEffect: "Primary transit lane obstructed",
        mitigationProtocol: "Connectivity-aware router re-routes via Route B Monitored Corridor",
        dataSafetyStatus: "GPS coordinates continuously logged to device local memory",
      },
    ],
    touristDataSafetyDescription:
      "WHAT HAPPENS TO TOURIST DATA DURING A CRASH: Device switches instantly to Edge Safety Mode. Local Haversine geofencing & risk scoring continue running 100% offline. Emergency SOS payloads are encrypted and stored in the IndexedDB store-and-forward queue. Upon cloud restoration, a background worker automatically synchronizes the queued events with the central authority database.",
    sourceClassification: "SIMULATION",
  };
}
