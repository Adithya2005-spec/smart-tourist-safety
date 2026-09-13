/**
 * WEATHER & ENVIRONMENT AGENT
 * Wraps multi-signal weather intelligence. Always clearly marks data as SIMULATED
 * since no live weather API is connected. Converts environmental conditions
 * into a structured safety impact score.
 */

import { evaluateWeatherSignal } from "../../client/src/lib/multi-signal-intelligence";
import type { GeoPoint } from "../../client/src/lib/safety-engine";

export interface WeatherWarning {
  type: "HEAVY_RAIN" | "HEAT_STRESS" | "COLD_EXPOSURE" | "HIGH_WIND" | "FLOOD_RISK";
  severity: "MODERATE" | "HIGH" | "EXTREME";
  advisory: string;
}

export interface WeatherAgentOutput {
  agentName: "weather";
  rainfallMm: number;
  temperatureC: number;
  weatherSeverity: number;
  weatherRisk: number;
  impact: "LOW" | "MODERATE" | "HIGH" | "EXTREME";
  conditions: {
    heavyRain: boolean;
    heatStress: boolean;
    coldExposure: boolean;
  };
  warnings: WeatherWarning[];
  anomalyScore: number;
  provenance: "SIMULATED";
  confidence: number;
  executionMs: number;
  timestamp: string;
  dataMode: "SIMULATED";
  disclaimer: string;
}

export function runWeatherAgent(
  location?: GeoPoint,
  overrideRainfall?: number,
  overrideTemp?: number
): WeatherAgentOutput {
  const startMs = Date.now();

  const result = evaluateWeatherSignal(location, overrideRainfall, overrideTemp);

  // Convert weather severity (0-100) to weather risk (0-100) with additional factors
  const rainRisk = Math.min(60, result.rainfallMm * 1.5);
  const heatRisk = result.heatRisk === "SEVERE" ? 30 : result.heatRisk === "MODERATE" ? 15 : 0;
  const coldRisk = result.coldExposureRisk === "FREEZING" ? 25 : result.coldExposureRisk === "MODERATE" ? 10 : 0;
  const weatherRisk = Math.min(100, Math.round(rainRisk + heatRisk + coldRisk));

  const impact: WeatherAgentOutput["impact"] =
    weatherRisk >= 70 ? "EXTREME" : weatherRisk >= 45 ? "HIGH" : weatherRisk >= 25 ? "MODERATE" : "LOW";

  // Produce warnings
  const warnings: WeatherWarning[] = [];
  if (result.heavyRainFlag) {
    warnings.push({ type: "HEAVY_RAIN", severity: "HIGH", advisory: "Avoid open areas, mountain passes, and riverside locations. Heavy rainfall detected (>30mm/hr)." });
  }
  if (result.heatRisk === "SEVERE") {
    warnings.push({ type: "HEAT_STRESS", severity: "EXTREME", advisory: "Extreme heat risk. Avoid outdoor exposure between 11am-4pm. Stay hydrated." });
  } else if (result.heatRisk === "MODERATE") {
    warnings.push({ type: "HEAT_STRESS", severity: "MODERATE", advisory: "Elevated heat conditions. Carry water and seek shade during peak hours." });
  }
  if (result.coldExposureRisk === "FREEZING") {
    warnings.push({ type: "COLD_EXPOSURE", severity: "EXTREME", advisory: "Freezing conditions. Avoid high-altitude routes without appropriate gear." });
  }

  return {
    agentName: "weather",
    rainfallMm: result.rainfallMm,
    temperatureC: result.temperature2mC,
    weatherSeverity: result.weatherSeverity,
    weatherRisk,
    impact,
    conditions: {
      heavyRain: result.heavyRainFlag,
      heatStress: result.heatRisk !== "NONE",
      coldExposure: result.coldExposureRisk !== "NONE",
    },
    warnings,
    anomalyScore: result.weatherAnomalyScore,
    provenance: "SIMULATED",
    confidence: 0.72,
    executionMs: Date.now() - startMs,
    timestamp: new Date().toISOString(),
    dataMode: "SIMULATED",
    disclaimer: "Weather data is SIMULATED — no live weather API is connected. Do not rely on this for real emergency decisions.",
  };
}
