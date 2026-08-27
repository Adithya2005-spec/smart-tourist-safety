import { Incident } from "./safety-engine";

export type OperationalMetrics = {
  avgAcknowledgementSec: number;
  avgDispatchSec: number;
  avgArrivalTimeSec: number;
  avgResolutionSec: number;
  avgTotalLifecycleSec: number;
  totalIncidents: number;
  activeCount: number;
  resolvedCount: number;
  criticalCount: number;
  dataClassification: "LIVE_MEASURED" | "PROTOTYPE_SIMULATION";
};

export function calculateOperationalMetrics(incidents: Incident[]): OperationalMetrics {
  let ackSum = 0, ackCount = 0;
  let dispatchSum = 0, dispatchCount = 0;
  let arrivalSum = 0, arrivalCount = 0;
  let resSum = 0, resCount = 0;
  let totalLifecycleSum = 0, totalLifecycleCount = 0;

  incidents.forEach((inc) => {
    const created = new Date(inc.createdAt).getTime();

    if (inc.acknowledgedAt) {
      const ack = new Date(inc.acknowledgedAt).getTime();
      const diffSec = Math.max(0, (ack - created) / 1000);
      ackSum += diffSec;
      ackCount++;

      if (inc.assignedAt) {
        const assigned = new Date(inc.assignedAt).getTime();
        dispatchSum += Math.max(0, (assigned - ack) / 1000);
        dispatchCount++;

        if (inc.onSceneAt) {
          const onScene = new Date(inc.onSceneAt).getTime();
          arrivalSum += Math.max(0, (onScene - assigned) / 1000);
          arrivalCount++;
        }
      }
    }

    if (inc.resolvedAt) {
      const resolved = new Date(inc.resolvedAt).getTime();
      resSum += Math.max(0, (resolved - created) / 1000);
      resCount++;

      if (inc.verifiedAt) {
        const verified = new Date(inc.verifiedAt).getTime();
        totalLifecycleSum += Math.max(0, (verified - created) / 1000);
        totalLifecycleCount++;
      }
    }
  });

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED" && i.status !== "VERIFIED").length;
  const resolvedCount = incidents.filter((i) => i.status === "RESOLVED" || i.status === "VERIFIED").length;
  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL" || i.severity === "HIGH").length;

  return {
    avgAcknowledgementSec: ackCount > 0 ? Math.round(ackSum / ackCount) : 14,
    avgDispatchSec: dispatchCount > 0 ? Math.round(dispatchSum / dispatchCount) : 45,
    avgArrivalTimeSec: arrivalCount > 0 ? Math.round(arrivalSum / arrivalCount) : 280,
    avgResolutionSec: resCount > 0 ? Math.round(resSum / resCount) : 540,
    avgTotalLifecycleSec: totalLifecycleCount > 0 ? Math.round(totalLifecycleSum / totalLifecycleCount) : 630,
    totalIncidents: incidents.length,
    activeCount,
    resolvedCount,
    criticalCount,
    dataClassification: "PROTOTYPE_SIMULATION",
  };
}
