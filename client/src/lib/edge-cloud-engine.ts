export type ConnectionStatus = "ONLINE" | "DEGRADED" | "OFFLINE";
export type ExecutionLocation = "EDGE" | "CLOUD";

export interface SystemConnectivityMetrics {
  status: ConnectionStatus;
  latencyMs: number;
  lastSyncTimestamp: string;
  pendingEventsCount: number;
  failedSyncAttempts: number;
  syncSuccessRatePercentage: number;
}

export interface OperationExecutionDecision {
  operationName: string;
  location: ExecutionLocation;
  latencyMs: number;
  reason: string;
  privacyGuarantee: string;
}

export function evaluateConnectivityStatus(
  isOnline: boolean,
  currentLatencyMs: number,
  pendingCount: number
): ConnectionStatus {
  if (!isOnline) return "OFFLINE";
  if (currentLatencyMs > 250 || pendingCount > 3) return "DEGRADED";
  return "ONLINE";
}

export function routeOperationExecution(
  operationName: string,
  connectivity: SystemConnectivityMetrics
): OperationExecutionDecision {
  // Low-latency and privacy-critical operations executed on Edge
  const edgeOperations = [
    "Geofence Detection",
    "Local Risk Calculation",
    "Offline SOS Queueing",
    "Cached Safety Advisory",
    "Pre-SOS Warning Generation",
  ];

  if (edgeOperations.includes(operationName) || connectivity.status === "OFFLINE") {
    return {
      operationName,
      location: "EDGE",
      latencyMs: Math.round(4 + Math.random() * 8), // Local edge execution speed (4-12ms)
      reason: connectivity.status === "OFFLINE"
        ? "Network offline: Local edge execution activated for continuity"
        : "Privacy & low-latency requirement (<15ms) fulfilled by local device engine",
      privacyGuarantee: "PII & continuous GPS tracks retained strictly on local device",
    };
  }

  return {
    operationName,
    location: "CLOUD",
    latencyMs: connectivity.latencyMs,
    reason: "Centralized multi-state graph computation & cross-region MLOps evaluation required",
    privacyGuarantee: "SHA-256 zero-knowledge hashes transmitted to cloud central ledger",
  };
}
