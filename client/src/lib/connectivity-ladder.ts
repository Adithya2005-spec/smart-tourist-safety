export type ConnectivityLevel =
  | "LEVEL_1_FULL_CLOUD"
  | "LEVEL_2_DEGRADED"
  | "LEVEL_3_EDGE_ONLY"
  | "LEVEL_4_STORE_AND_FORWARD"
  | "LEVEL_5_EMERGENCY_FALLBACK";

export interface CapabilityMatrixItem {
  capability: string;
  cloud: boolean;
  degraded: boolean;
  offlineEdge: boolean;
}

export interface ConnectivityLadderStatus {
  currentLevel: ConnectivityLevel;
  levelName: string;
  description: string;
  activeTransport: string;
  matrix: CapabilityMatrixItem[];
}

export function evaluateConnectivityLadder(
  isOnline: boolean,
  latencyMs: number,
  pendingQueueCount: number
): ConnectivityLadderStatus {
  let level: ConnectivityLevel = "LEVEL_1_FULL_CLOUD";
  let levelName = "Level 1: Full Cloud Connectivity";
  let description = "Full multi-state cloud sync, real-time ML analytics, and satellite map feeds active.";
  let transport = "5G / LTE High-Speed Transport";

  if (!isOnline) {
    if (pendingQueueCount > 5) {
      level = "LEVEL_4_STORE_AND_FORWARD";
      levelName = "Level 4: Store-and-Forward Queue";
      levelName = "Store-and-Forward: IndexedDB queue buffering critical event telemetry.";
      transport = "Local Storage Queue Buffer";
    } else {
      level = "LEVEL_3_EDGE_ONLY";
      levelName = "Level 3: Edge-Only Autonomous Mode";
      description = "Zero network signal. Local Haversine geofences and edge risk engine operating offline.";
      transport = "Local Device Offline Loop";
    }
  } else if (latencyMs > 250 || pendingQueueCount > 0) {
    level = "LEVEL_2_DEGRADED";
    levelName = "Level 2: Degraded Connectivity";
    description = "High network latency detected. Prioritizing critical SOS traffic over analytics.";
    transport = "High Latency Mobile Data";
  }

  const matrix: CapabilityMatrixItem[] = [
    { capability: "Emergency SOS Alert Creation", cloud: true, degraded: true, offlineEdge: true },
    { capability: "Local Haversine Risk Calculation", cloud: true, degraded: true, offlineEdge: true },
    { capability: "Offline Cached Safety Map", cloud: true, degraded: true, offlineEdge: true },
    { capability: "Cross-State Cloud Analytics", cloud: true, degraded: false, offlineEdge: false },
    { capability: "Central Incident Event Sync", cloud: true, degraded: true, offlineEdge: false },
    { capability: "Edge Geofence Warning", cloud: true, degraded: true, offlineEdge: true },
  ];

  return {
    currentLevel: level,
    levelName,
    description,
    activeTransport: transport,
    matrix,
  };
}
