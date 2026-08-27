import type { GeoPoint, Responder, RiskZone } from "./safety-engine";

export interface AreaDigitalTwinState {
  areaId: string;
  areaName: string;
  touristCount: number;
  activeResponders: number;
  activeIncidents: number;
  roadAvailabilityPercentage: number;
  connectivityQualityPercentage: number;
  environmentalRiskScore: number;
  averageResponseTimeMinutes: number;
  overallResilienceScore: number;
  lastUpdated: string;
  isSimulated: boolean;
}

export interface DigitalTwinSimulationParams {
  touristDensityMultiplier: number; // 0.5x to 3.0x
  incidentRateMultiplier: number; // 0.5x to 4.0x
  responderAvailabilityFactor: number; // 0.2 to 1.0
  roadClosureFactor: number; // 0.3 to 1.0 (1.0 = all open)
  connectivityQualityFactor: number; // 0.1 to 1.0 (1.0 = full LTE/5G)
}

export const defaultSimulationParams: DigitalTwinSimulationParams = {
  touristDensityMultiplier: 1.0,
  incidentRateMultiplier: 1.0,
  responderAvailabilityFactor: 1.0,
  roadClosureFactor: 1.0,
  connectivityQualityFactor: 1.0,
};

export function computeDigitalTwinState(
  baseState: Partial<AreaDigitalTwinState>,
  params: DigitalTwinSimulationParams = defaultSimulationParams,
  baseZones: RiskZone[] = [],
  baseResponders: Responder[] = []
): AreaDigitalTwinState {
  const isSimulated =
    params.touristDensityMultiplier !== 1.0 ||
    params.incidentRateMultiplier !== 1.0 ||
    params.responderAvailabilityFactor !== 1.0 ||
    params.roadClosureFactor !== 1.0 ||
    params.connectivityQualityFactor !== 1.0;

  const baseTourists = baseState.touristCount ?? 1420;
  const simulatedTourists = Math.round(baseTourists * params.touristDensityMultiplier);

  const baseIncidents = baseState.activeIncidents ?? 2;
  const simulatedIncidents = Math.round(baseIncidents * params.incidentRateMultiplier);

  const totalResponders = baseResponders.length || 3;
  const simulatedResponders = Math.max(1, Math.round(totalResponders * params.responderAvailabilityFactor));

  const roadAvailability = Math.round(100 * params.roadClosureFactor);
  const connectivityQuality = Math.round(100 * params.connectivityQualityFactor);

  // Expected response time calculation formula
  // Base time = 5 mins; penalized by road closures, responder deficit, and high tourist density
  const responderDeficit = Math.max(0, totalResponders - simulatedResponders);
  const densityPenalty = (params.touristDensityMultiplier - 1.0) * 2.5;
  const roadPenalty = (1.0 - params.roadClosureFactor) * 8.0;
  const expectedResponseTime = Math.max(3, Math.round(5 + responderDeficit * 3.5 + densityPenalty + roadPenalty));

  // Area resilience score calculation (0 to 100)
  const coverageScore = Math.min(100, Math.round((simulatedResponders / Math.max(1, simulatedIncidents + 1)) * 40));
  const roadScore = roadAvailability * 0.3;
  const connectivityScore = connectivityQuality * 0.3;
  const resilienceScore = Math.max(15, Math.min(99, Math.round(coverageScore + roadScore + connectivityScore)));

  return {
    areaId: baseState.areaId ?? "TWIN-KA-BLR",
    areaName: baseState.areaName ?? "Bengaluru Tourist District",
    touristCount: simulatedTourists,
    activeResponders: simulatedResponders,
    activeIncidents: simulatedIncidents,
    roadAvailabilityPercentage: roadAvailability,
    connectivityQualityPercentage: connectivityQuality,
    environmentalRiskScore: Math.round(35 * params.incidentRateMultiplier),
    averageResponseTimeMinutes: expectedResponseTime,
    overallResilienceScore: resilienceScore,
    lastUpdated: new Date().toISOString(),
    isSimulated,
  };
}
