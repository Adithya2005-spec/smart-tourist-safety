export interface ModelVersionInfo {
  activeVersion: string;
  candidateVersion: string;
  validationStatus: "PASSED" | "FAILED" | "IN_PROGRESS";
  validationAccuracy: number;
  deployedEdgeNodesCount: number;
  totalEdgeNodesCount: number;
  lastDeploymentTimestamp: string;
}

export function getModelLifecycleInfo(): ModelVersionInfo {
  return {
    activeVersion: "v1.1.4-production",
    candidateVersion: "v1.2.0-federated-candidate",
    validationStatus: "PASSED",
    validationAccuracy: 94.2,
    deployedEdgeNodesCount: 36,
    totalEdgeNodesCount: 36,
    lastDeploymentTimestamp: new Date().toISOString(),
  };
}
