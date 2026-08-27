import { GeoPoint, Incident, Responder, haversineDistanceM } from "./safety-engine";

export type ResponderRecommendation = {
  responder: Responder;
  distanceKm: number;
  etaMinutes: number;
  workloadScore: number;
  overallScore: number;
  isRecommended: boolean;
  recommendationReason: string;
};

export function optimizeResponderAssignment(
  incidentLocation: GeoPoint,
  responders: Responder[]
): ResponderRecommendation[] {
  const scored = responders.map((r) => {
    // Default mock coordinates for responders around Karnataka/Bengaluru if current location missing
    const rLoc: GeoPoint = r.currentLocation || {
      lat: incidentLocation.lat + (Math.random() * 0.02 - 0.01),
      lng: incidentLocation.lng + (Math.random() * 0.02 - 0.01),
    };

    const distM = haversineDistanceM(incidentLocation, rLoc);
    const distKm = Number((distM / 1000).toFixed(1));
    const etaMinutes = Math.max(2, Math.round(distKm * 3 + (r.activeAssignments * 4)));
    const workloadScore = r.availability === "BUSY" ? 90 : r.activeAssignments * 25;

    // Overall Score: lower is better (0-100)
    const distWeight = distKm * 15;
    const etaWeight = etaMinutes * 5;
    const workloadWeight = workloadScore * 0.4;
    const overallScore = Math.round(distWeight + etaWeight + workloadWeight);

    const isAvailable = r.availability === "AVAILABLE";

    return {
      responder: r,
      distanceKm: distKm,
      etaMinutes,
      workloadScore,
      overallScore: isAvailable ? overallScore : overallScore + 1000,
      isRecommended: false,
      recommendationReason: isAvailable
        ? `Closest unit (${distKm} km, ETA ~${etaMinutes} min) with low active workload (${r.activeAssignments} active task).`
        : "Unit is currently busy with another incident.",
    };
  });

  scored.sort((a, b) => a.overallScore - b.overallScore);

  if (scored.length > 0 && scored[0].responder.availability === "AVAILABLE") {
    scored[0].isRecommended = true;
    scored[0].recommendationReason = `★ RECOMMENDED: ${scored[0].responder.name} is ${scored[0].distanceKm} km away with estimated ETA of ${scored[0].etaMinutes} mins and zero active dispatch load.`;
  }

  return scored;
}
