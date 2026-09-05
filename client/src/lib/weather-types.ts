import type { GeoPoint } from "./safety-engine";
import type { DataProvenanceTag } from "./data-provenance";

export type SensorStatus = "HEALTHY" | "DEGRADED" | "ANOMALOUS";
export type AnomalyType = "NORMAL" | "ENVIRONMENTAL_HAZARD" | "SENSOR_HARDWARE_FAULT" | "SPATIAL_DISCREPANCY";
export type EnvironmentalRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface WeatherStation {
  stationId: string;
  name: string;
  stateId: string;
  district: string;
  location: GeoPoint;
  elevationM: number;
  sensorStatus: SensorStatus;
  sensorHealthScore: number; // 0.0 - 1.0
  lastUpdated: string;
  activeSensors: string[];
}

export interface WeatherObservation {
  id: string;
  stationId: string;
  timestamp: string;
  location: GeoPoint;
  temperature: number; // Celsius
  humidity: number; // %
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // degrees 0-360
  rainfall: number; // mm (in last interval)
  solarRadiation: number; // W/m2
  visibility: number; // km
  cloudCover: number; // %
  weatherCondition: "CLEAR" | "CLOUDY" | "RAIN" | "HEAVY_STORM" | "FOG" | "HIGH_WIND";
  dataSource: "AWS_TELEMETRY" | "HISTORICAL_SERIES" | "DEMO_SIMULATION";
  dataQualityScore: number; // 0.0 - 1.0
  sensorStatus: SensorStatus;
}

export interface TimeDerivedWeatherFeatures {
  rollingTemperatureMean: number;
  rollingTemperatureStd: number;
  rollingRainfall30m: number;
  rollingRainfall1h: number;
  rainfallChangeRate: number; // mm/hr
  windChangeRate: number; // km/h/hr
  pressureChangeRate: number; // hPa/hr
  humidityChangeRate: number; // %/hr
  timeSinceLastObservationMinutes: number;
  consecutiveAbnormalObservations: number;
}

export interface WeatherAnomalyResult {
  stationId: string;
  timestamp: string;
  anomalyScore: number; // 0.0 - 1.0
  isAnomaly: boolean;
  confidence: number; // 0.0 - 1.0
  affectedFeatures: string[];
  sensorHealthScore: number; // 0.0 - 1.0
  anomalyType: AnomalyType;
  explanation: string;
  provenance: DataProvenanceTag;
}

export interface EnvironmentalRiskResult {
  environmentalRiskScore: number; // 0 - 100
  environmentalRiskLevel: EnvironmentalRiskLevel;
  weatherAnomalyScore: number; // 0.0 - 1.0
  weatherConfidence: number; // 0.0 - 1.0
  nearbyStationCount: number;
  agreeingStationCount: number;
  flaggedStationCount: number;
  primaryStationId?: string;
  nearestStationDistanceKm: number;
  sensorHealthScore: number; // 0.0 - 1.0
  weatherTrend: "STABLE" | "DETERIORATING" | "IMPROVING" | "VOLATILE";
  contributingFactors: { factor: string; impact: number; icon?: string }[];
  summary: string;
  provenance: DataProvenanceTag;
}
