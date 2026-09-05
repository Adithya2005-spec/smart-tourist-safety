import { GeoPoint, SeverityBand, getSeverityBand } from "./safety-engine";

export type MultiSignalRouteBreakdown = {
  incidentRisk: number;
  weatherRisk: number;
  crowdRisk: number;
  connectivityRisk: number;
  hazardRisk: number;
  terrainRisk: number;
  infrastructureProximityScore: number;
};

export type RouteOption = {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  riskScore: number;
  severity: SeverityBand;
  highRiskZonesCrossed: number;
  activeIncidentsEnRoute: number;
  recommendationTag: "RECOMMENDED_SAFER" | "FASTEST_TRANSIT" | "NOT_RECOMMENDED";
  recommendationLabel: string;
  rationale: string;
  cost: number;
  waypoints: GeoPoint[];
  multiSignalRiskBreakdown: MultiSignalRouteBreakdown;
  dataClassification: "DEMO_SYNTHETIC";
};

export type RouteRequest = {
  originName: string;
  origin: GeoPoint;
  destinationName: string;
  destination: GeoPoint;
  stateId: string;
};

export function calculateRouteOptions(req: RouteRequest): RouteOption[] {
  // Deterministic multi-route calculation using synthetic geospatial graph adapter
  const baseDistance = 3.2; // km
  const baseTime = 18; // mins

  // Option A: Direct / Shortest route (crosses high risk zone)
  const routeA: RouteOption = {
    id: "ROUTE-A",
    name: "Direct Transit Corridor",
    distanceKm: Number(baseDistance.toFixed(1)),
    etaMinutes: baseTime,
    riskScore: 74,
    severity: getSeverityBand(74),
    highRiskZonesCrossed: 2,
    activeIncidentsEnRoute: 2,
    recommendationTag: "NOT_RECOMMENDED",
    recommendationLabel: "NOT RECOMMENDED",
    rationale: "Direct shortest route crosses 2 high-risk zones with recent active incident reports and high rainfall accumulation.",
    cost: (0.2 * baseDistance) + (0.3 * baseTime) + (0.5 * 74),
    waypoints: [
      req.origin,
      { lat: req.origin.lat + 0.004, lng: req.origin.lng + 0.003 },
      req.destination,
    ],
    multiSignalRiskBreakdown: {
      incidentRisk: 30,
      weatherRisk: 18,
      crowdRisk: 12,
      connectivityRisk: 4,
      hazardRisk: 6,
      terrainRisk: 4,
      infrastructureProximityScore: 65,
    },
    dataClassification: "DEMO_SYNTHETIC",
  };

  // Option B: Recommended safer detour (bypasses high risk zone)
  const routeB: RouteOption = {
    id: "ROUTE-B",
    name: "Monitored Tourist Perimeter Route",
    distanceKm: Number((baseDistance + 0.5).toFixed(1)),
    etaMinutes: baseTime + 3,
    riskScore: 32,
    severity: getSeverityBand(32),
    highRiskZonesCrossed: 0,
    activeIncidentsEnRoute: 0,
    recommendationTag: "RECOMMENDED_SAFER",
    recommendationLabel: "SAFER ROUTE (LOWER MODELED RISK)",
    rationale: `Route B is 3 minutes longer (0.5 km) but offers substantially lower modeled risk. It avoids high-risk zones in ${req.stateId} and passes within 1.2 km of a Tourist Police Desk.`,
    cost: (0.2 * (baseDistance + 0.5)) + (0.3 * (baseTime + 3)) + (0.5 * 32),
    waypoints: [
      req.origin,
      { lat: req.origin.lat + 0.002, lng: req.origin.lng - 0.004 },
      { lat: req.destination.lat - 0.001, lng: req.destination.lng - 0.002 },
      req.destination,
    ],
    multiSignalRiskBreakdown: {
      incidentRisk: 8,
      weatherRisk: 6,
      crowdRisk: 8,
      connectivityRisk: 2,
      hazardRisk: 4,
      terrainRisk: 4,
      infrastructureProximityScore: 92,
    },
    dataClassification: "DEMO_SYNTHETIC",
  };

  // Option C: Balanced Secondary Way
  const routeC: RouteOption = {
    id: "ROUTE-C",
    name: "Standard Boulevard Way",
    distanceKm: Number((baseDistance + 0.9).toFixed(1)),
    etaMinutes: baseTime + 6,
    riskScore: 48,
    severity: getSeverityBand(48),
    highRiskZonesCrossed: 1,
    activeIncidentsEnRoute: 1,
    recommendationTag: "FASTEST_TRANSIT",
    recommendationLabel: "MODERATE ROUTE",
    rationale: "Alternative commercial boulevard route with moderate crowd density and 1 caution zone.",
    cost: (0.2 * (baseDistance + 0.9)) + (0.3 * (baseTime + 6)) + (0.5 * 48),
    waypoints: [
      req.origin,
      { lat: req.origin.lat - 0.003, lng: req.origin.lng + 0.005 },
      req.destination,
    ],
    multiSignalRiskBreakdown: {
      incidentRisk: 18,
      weatherRisk: 10,
      crowdRisk: 12,
      connectivityRisk: 2,
      hazardRisk: 4,
      terrainRisk: 2,
      infrastructureProximityScore: 78,
    },
    dataClassification: "DEMO_SYNTHETIC",
  };

  return [routeB, routeA, routeC];
}
