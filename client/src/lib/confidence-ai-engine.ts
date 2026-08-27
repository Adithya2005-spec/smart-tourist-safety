export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ConfidencePrediction {
  predictionScore: number;
  confidencePercentage: number;
  confidenceLevel: ConfidenceLevel;
  contributingFactors: string[];
  degradationReasons: string[];
  dataQualityPercentage: number;
  timestamp: string;
  sourceClassification: "MODEL-DERIVED";
}

export function evaluateAIConfidence(
  riskScore: number,
  isOnline: boolean,
  dataQuality: number = 98
): ConfidencePrediction {
  const degradationReasons: string[] = [];
  let confidence = 88;

  if (!isOnline) {
    confidence -= 22;
    degradationReasons.push("Edge offline mode: Live cloud satellite feeds unavailable");
  }

  if (dataQuality < 90) {
    confidence -= 15;
    degradationReasons.push(`Input data quality degraded (${dataQuality}%)`);
  }

  const confidenceLevel: ConfidenceLevel = confidence >= 80 ? "HIGH" : confidence >= 60 ? "MEDIUM" : "LOW";

  return {
    predictionScore: riskScore,
    confidencePercentage: Math.max(35, Math.min(99, confidence)),
    confidenceLevel,
    contributingFactors: [
      "Haversine geofence spatial telemetry",
      "Recent zonal incident momentum",
      "Temporal night-exposure risk curve",
    ],
    degradationReasons: degradationReasons.length ? degradationReasons : ["No significant telemetry degradation"],
    dataQualityPercentage: dataQuality,
    timestamp: new Date().toISOString(),
    sourceClassification: "MODEL-DERIVED",
  };
}
