import type { SeverityBand } from "./safety-engine";
import { getSeverityBand } from "./safety-engine";

export interface RiskTimelineEvent {
  id: string;
  time: string;
  score: number;
  delta: number;
  severity: SeverityBand;
  eventTitle: string;
  explanation: string;
  factorImpacts: { factor: string; impact: number }[];
}

export interface CounterfactualScenario {
  id: string;
  title: string;
  riskScore: number;
  severity: SeverityBand;
  etaMinutes: number;
  riskReduction: number;
  recommendationReason: string;
  isRecommended: boolean;
}

export function generateRiskExplanationTimeline(currentScore: number): RiskTimelineEvent[] {
  const now = new Date();
  const t0 = new Date(now.getTime() - 25 * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const t1 = new Date(now.getTime() - 18 * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const t2 = new Date(now.getTime() - 10 * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const t3 = new Date(now.getTime() - 3 * 60_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return [
    {
      id: "TL-1",
      time: t0,
      score: 28,
      delta: 0,
      severity: "LOW",
      eventTitle: "Journey Initiated in Safe Zone",
      explanation: "Verified transit start in Cubbon Park safe point corridor.",
      factorImpacts: [{ factor: "Patrol Presence", impact: -12 }],
    },
    {
      id: "TL-2",
      time: t1,
      score: 44,
      delta: +16,
      severity: "MEDIUM",
      eventTitle: "Entered Medium-Risk Zone",
      explanation: "Entered Church Street Junction during peak crowd density window.",
      factorImpacts: [{ factor: "Zonal Density", impact: +16 }],
    },
    {
      id: "TL-3",
      time: t2,
      score: 62,
      delta: +18,
      severity: "HIGH",
      eventTitle: "Nearby Incident & Temporal Shift",
      explanation: "Active incident INC-1042 reported 0.4km away + transition into night exposure window (>20:00).",
      factorImpacts: [
        { factor: "Incident Proximity", impact: +12 },
        { factor: "Night Exposure", impact: +6 },
      ],
    },
    {
      id: "TL-4",
      time: t3,
      score: currentScore,
      delta: currentScore - 62,
      severity: getSeverityBand(currentScore),
      eventTitle: "Route Deviation Detected",
      explanation: "Tourist trajectory deviated from main well-lit corridor onto unmonitored side road.",
      factorImpacts: [{ factor: "Route Deviation", impact: currentScore - 62 }],
    },
  ];
}

export function evaluateCounterfactualScenarios(currentScore: number): CounterfactualScenario[] {
  const currentSev = getSeverityBand(currentScore);

  const routeBScore = Math.max(22, Math.round(currentScore * 0.62));
  const waitScore = Math.max(25, Math.round(currentScore * 0.52));
  const corridorScore = Math.max(18, Math.round(currentScore * 0.42));

  return [
    {
      id: "SCENARIO-CURRENT",
      title: "Current Route (Direct Corridor)",
      riskScore: currentScore,
      severity: currentSev,
      etaMinutes: 14,
      riskReduction: 0,
      recommendationReason: "Crosses high-density unmonitored risk zone INC-1042 corridor.",
      isRecommended: false,
    },
    {
      id: "SCENARIO-ROUTE-B",
      title: "Safer Route B (Monitored Perimeter)",
      riskScore: routeBScore,
      severity: getSeverityBand(routeBScore),
      etaMinutes: 17,
      riskReduction: currentScore - routeBScore,
      recommendationReason: "Adds 3 mins ETA but bypasses active high-risk zone with continuous police patrol coverage.",
      isRecommended: true,
    },
    {
      id: "SCENARIO-WAIT",
      title: "Wait 20 Mins at Police Assistance Post",
      riskScore: waitScore,
      severity: getSeverityBand(waitScore),
      etaMinutes: 34,
      riskReduction: currentScore - waitScore,
      recommendationReason: "Allows night crowd peak to clear while staying at Cubbon Park verified safe point.",
      isRecommended: false,
    },
    {
      id: "SCENARIO-CORRIDOR",
      title: "Stay inside Verified Safe Corridor",
      riskScore: corridorScore,
      severity: getSeverityBand(corridorScore),
      etaMinutes: 19,
      riskReduction: currentScore - corridorScore,
      recommendationReason: "Continuous CCTV and lighting coverage along Metro boulevard.",
      isRecommended: false,
    },
  ];
}
