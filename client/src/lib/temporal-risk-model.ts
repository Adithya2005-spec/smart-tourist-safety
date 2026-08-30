export interface TemporalRiskFeatures {
  previousRiskScore: number;
  rolling3HourIncidentCount: number;
  historicalIncidentFrequency: number;
  recentTouristDensityMultiplier: number;
  hourOfDay: number;
  dayOfWeek: number;
  recentConnectivityDegradation: boolean;
  recentResponderShortage: boolean;
}

export interface TemporalRiskForecast {
  currentRisk: number;
  trend: "INCREASING" | "STABLE" | "DECREASING";
  trendPercentage: number;
  forecastTag: "PROTOTYPE FORECAST";
  forecastScore1Hour: number;
  forecastScore3Hour: number;
  forecastExplanation: string;
}

export function computeTemporalRiskForecast(
  features: TemporalRiskFeatures,
  baseRiskScore: number = 65
): TemporalRiskForecast {
  const timeFactor = (features.hourOfDay >= 20 || features.hourOfDay <= 4) ? 8 : -3;
  const densityPenalty = (features.recentTouristDensityMultiplier - 1.0) * 12;
  const incidentPenalty = features.rolling3HourIncidentCount * 4;
  const connectivityPenalty = features.recentConnectivityDegradation ? 6 : 0;
  const responderPenalty = features.recentResponderShortage ? 8 : 0;

  const currentRisk = Math.max(10, Math.min(99, Math.round(baseRiskScore + timeFactor + densityPenalty + incidentPenalty + connectivityPenalty + responderPenalty)));
  const delta = currentRisk - features.previousRiskScore;

  const trend = delta > 3 ? "INCREASING" : delta < -3 ? "DECREASING" : "STABLE";
  const trendPercentage = Math.round((delta / Math.max(1, features.previousRiskScore)) * 100);

  const forecastScore1Hour = Math.max(10, Math.min(99, currentRisk + (trend === "INCREASING" ? 4 : trend === "DECREASING" ? -4 : 0)));
  const forecastScore3Hour = Math.max(10, Math.min(99, currentRisk + (trend === "INCREASING" ? 8 : trend === "DECREASING" ? -7 : 1)));

  return {
    currentRisk,
    trend,
    trendPercentage,
    forecastTag: "PROTOTYPE FORECAST",
    forecastScore1Hour,
    forecastScore3Hour,
    forecastExplanation:
      trend === "INCREASING"
        ? `Risk is trending up (+${trendPercentage}%) due to high density (${features.recentTouristDensityMultiplier}x) and late hour (${features.hourOfDay}:00).`
        : `Risk is stable with adequate responder coverage and normal travel movement.`,
  };
}
