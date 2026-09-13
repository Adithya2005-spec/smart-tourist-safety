/**
 * MULTI-AGENT SAFETY INTELLIGENCE ROUTE HANDLERS
 * Exposes endpoints for orchestrating specialist agents, Guardian AI,
 * risk forecasting, smart responder allocation, and Resend alerts.
 */

import { Router, Request, Response } from "express";
import { createExecutionPlan, AgentExecutionPlan } from "../agents/planner-agent";
import { runLocationAgent, LocationAgentOutput } from "../agents/location-agent";
import { runIncidentAgent, IncidentAgentOutput } from "../agents/incident-agent";
import { runWeatherAgent, WeatherAgentOutput } from "../agents/weather-agent";
import { runCrowdAgent, CrowdAgentOutput } from "../agents/crowd-agent";
import { runHistoryAgent, HistoryAgentOutput } from "../agents/history-agent";
import { runConnectivityAgent, ConnectivityAgentOutput } from "../agents/connectivity-agent";
import { runEvidenceValidator, AgentOutput } from "../agents/evidence-validator";
import { runGuardianAI } from "../agents/guardian-ai";
import { runResponderAgent } from "../agents/responder-agent";
import { calculateSafeRoutes } from "../services/maps";
import { dispatchEmergencyAlert, getAlertDeduplicationStatus } from "../services/resend-alerts";

export const agentRouter = Router();

// In-memory ring buffer for recent agent execution runs
interface AgentRunRecord {
  id: string;
  query: string;
  plan: AgentExecutionPlan;
  overallRiskScore: number;
  riskTier: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  timestamp: string;
  executionMs: number;
  agentsExecuted: string[];
}

const recentAgentRuns: AgentRunRecord[] = [];
const MAX_SAVED_RUNS = 50;

function saveAgentRun(run: AgentRunRecord) {
  recentAgentRuns.unshift(run);
  if (recentAgentRuns.length > MAX_SAVED_RUNS) {
    recentAgentRuns.pop();
  }
}

// 1. POST /api/agent/plan — Planner Agent only
agentRouter.post("/plan", (req: Request, res: Response) => {
  const { query, location, stateId, language, touristId, incidentId } = req.body || {};
  if (!query || typeof query !== "string") {
    return res.status(400).json({ success: false, error: "Missing required 'query' string parameter" });
  }

  const plan = createExecutionPlan(query, {
    location,
    stateId: stateId || "KA",
    language: language || "en",
    touristId,
    incidentId,
  });

  return res.json({ success: true, plan });
});

// 2. POST /api/agent/query — Complete Orchestrated Multi-Agent Execution
agentRouter.post("/query", async (req: Request, res: Response) => {
  const startTime = Date.now();
  const {
    query,
    location,
    stateId = "KA",
    language = "en",
    touristId,
    incidents = [],
    isOnline = true,
    edgeQueueCount = 0,
    overrideRainfall,
    overrideTemp,
    overrideDensity,
  } = req.body || {};

  if (!query || typeof query !== "string") {
    return res.status(400).json({ success: false, error: "Missing required 'query' string parameter" });
  }

  // 1. Safety Planner Agent classifies and constructs execution plan
  const plan = createExecutionPlan(query, {
    location: location ? `${location.lat},${location.lng}` : undefined,
    stateId,
    language,
    touristId,
  });

  // 2. Parallel Specialist Agent Executions based on Plan
  const agentOutputs: AgentOutput[] = [];

  // Always invoke agents mapped in plan (or default core set)
  const agentsToRun = new Set(plan.parallelAgents);

  if (agentsToRun.has("location")) {
    agentOutputs.push(runLocationAgent(stateId, location) as unknown as AgentOutput);
  }
  if (agentsToRun.has("incident")) {
    agentOutputs.push(runIncidentAgent(incidents, true) as unknown as AgentOutput);
  }
  if (agentsToRun.has("weather")) {
    agentOutputs.push(runWeatherAgent(location, overrideRainfall, overrideTemp) as unknown as AgentOutput);
  }
  if (agentsToRun.has("crowd")) {
    agentOutputs.push(runCrowdAgent(location, overrideDensity) as unknown as AgentOutput);
  }
  if (agentsToRun.has("history")) {
    agentOutputs.push(runHistoryAgent(stateId) as unknown as AgentOutput);
  }
  if (agentsToRun.has("connectivity")) {
    agentOutputs.push(runConnectivityAgent(isOnline, edgeQueueCount) as unknown as AgentOutput);
  }

  // Fallback: If no specialist was selected by plan, run location and history as safe baseline
  if (agentOutputs.length === 0) {
    agentOutputs.push(runLocationAgent(stateId, location) as unknown as AgentOutput);
    agentOutputs.push(runHistoryAgent(stateId) as unknown as AgentOutput);
  }

  // 3. Evidence Validation Agent (Synthesizes freshness, provenance, agreements)
  const validation = runEvidenceValidator(
    agentOutputs,
    agentOutputs.map((a) => a.agentName)
  );

  // 4. Calculate Unified Risk Synthesis
  let riskSum = 0;
  let riskWeightCount = 0;

  for (const out of agentOutputs) {
    if (out.agentName === "weather" && typeof (out as any).weatherRisk === "number") {
      riskSum += (out as any).weatherRisk * 1.2;
      riskWeightCount += 1.2;
    } else if (out.agentName === "crowd" && typeof (out as any).crowdRisk === "number") {
      riskSum += (out as any).crowdRisk * 1.0;
      riskWeightCount += 1.0;
    } else if (out.agentName === "incident" && typeof (out as any).incidentRiskScore === "number") {
      riskSum += (out as any).incidentRiskScore * 1.5;
      riskWeightCount += 1.5;
    } else if (out.agentName === "history" && typeof (out as any).historicalRisk === "number") {
      riskSum += (out as any).historicalRisk * 0.8;
      riskWeightCount += 0.8;
    } else if (out.agentName === "location" && Array.isArray((out as any).nearbyRiskZones)) {
      riskSum += ((out as any).nearbyRiskZones.length > 0 ? 40 : 15) * 1.0;
      riskWeightCount += 1.0;
    } else if (out.agentName === "connectivity" && typeof (out as any).connectivityRisk === "number") {
      riskSum += (out as any).connectivityRisk * 0.7;
      riskWeightCount += 0.7;
    }
  }

  const baseRisk = riskWeightCount > 0 ? Math.round(riskSum / riskWeightCount) : 25;
  // Apply evidence validation confidence adjustment (-10% to +10%)
  const adjustedRisk = Math.min(100, Math.max(0, Math.round(baseRisk * (1 + validation.recommendedConfidenceAdjustment * 0.1))));

  const riskTier: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" =
    adjustedRisk > 65 ? "CRITICAL" : adjustedRisk > 45 ? "HIGH" : adjustedRisk > 25 ? "MODERATE" : "LOW";

  // 5. Guardian AI Synthesis (Natural Language + Action Recommendations)
  const weatherAgent = agentOutputs.find((a) => a.agentName === "weather") as any;
  const crowdAgent = agentOutputs.find((a) => a.agentName === "crowd") as any;
  const incidentAgent = agentOutputs.find((a) => a.agentName === "incident") as any;

  const guardian = await runGuardianAI({
    userQuery: query,
    language,
    locationContext: {
      locationName: stateId ? `Region (${stateId})` : "Current Zone",
      state: stateId,
      lat: location?.lat,
      lng: location?.lng,
    },
    overallRiskScore: adjustedRisk,
    riskTier,
    validationSummary: validation,
    activeIncidentsCount: incidentAgent?.activeCount || 0,
    weatherSummary: weatherAgent?.condition || "Clear",
    crowdSummary: crowdAgent?.crowdLevel || "Normal",
  });

  const totalExecutionMs = Date.now() - startTime;

  // Record run
  const runRecord: AgentRunRecord = {
    id: plan.requestId,
    query,
    plan,
    overallRiskScore: adjustedRisk,
    riskTier,
    timestamp: new Date().toISOString(),
    executionMs: totalExecutionMs,
    agentsExecuted: agentOutputs.map((a) => a.agentName),
  };
  saveAgentRun(runRecord);

  return res.json({
    success: true,
    runId: plan.requestId,
    plan,
    agentOutputs,
    validation,
    riskAssessment: {
      overallRiskScore: adjustedRisk,
      riskTier,
      confidenceScore: Math.round(validation.trustScore),
      dataCompleteness: validation.dataCompleteness,
      evaluatedAt: new Date().toISOString(),
    },
    guardian,
    executionMs: totalExecutionMs,
  });
});

// 3. POST /api/guardian/ask — Dedicated Guardian AI Conversational Endpoint
agentRouter.post("/guardian/ask", async (req: Request, res: Response) => {
  const { query, language = "en", overallRiskScore, riskTier, locationContext } = req.body || {};
  if (!query) {
    return res.status(400).json({ success: false, error: "Missing required 'query' parameter" });
  }

  const result = await runGuardianAI({
    userQuery: query,
    language,
    overallRiskScore: overallRiskScore ?? 25,
    riskTier: riskTier ?? "LOW",
    locationContext,
  });

  return res.json({ success: true, guardian: result });
});

// 4. POST /api/risk/evaluate — Fast Unified Risk Evaluation
agentRouter.post("/risk/evaluate", (req: Request, res: Response) => {
  const { stateId = "KA", location, hour, overrideRainfall, overrideDensity, isOnline = true } = req.body || {};

  const loc: LocationAgentOutput = runLocationAgent(stateId, location);
  const weather: WeatherAgentOutput = runWeatherAgent(location, overrideRainfall);
  const crowd: CrowdAgentOutput = runCrowdAgent(location, overrideDensity, hour);
  const history: HistoryAgentOutput = runHistoryAgent(stateId, hour);
  const conn: ConnectivityAgentOutput = runConnectivityAgent(isOnline);

  const riskScore = Math.round(
    weather.weatherRisk * 0.25 +
    crowd.crowdRisk * 0.25 +
    history.historicalRisk * 0.25 +
    conn.connectivityRisk * 0.15 +
    (loc.nearbyRiskZones.length > 0 ? 10 : 0)
  );

  const tier = riskScore > 65 ? "CRITICAL" : riskScore > 45 ? "HIGH" : riskScore > 25 ? "MODERATE" : "LOW";

  return res.json({
    success: true,
    evaluatedAt: new Date().toISOString(),
    riskScore,
    tier,
    factors: {
      weather: weather.weatherRisk,
      crowd: crowd.crowdRisk,
      history: history.historicalRisk,
      connectivity: conn.connectivityRisk,
      nearbyRiskZones: loc.nearbyRiskZones.length,
    },
  });
});

// 5. GET /api/risk/forecast — Timeline Risk Projection (NOW, +15m, +30m, +60m)
agentRouter.get("/risk/forecast", (req: Request, res: Response) => {
  const stateId = (req.query.stateId as string) || "KA";
  const currentHour = new Date().getHours();

  const historyNow: HistoryAgentOutput = runHistoryAgent(stateId, currentHour);
  const history15: HistoryAgentOutput = runHistoryAgent(stateId, (currentHour + 0.25) % 24);
  const history30: HistoryAgentOutput = runHistoryAgent(stateId, (currentHour + 0.5) % 24);
  const history60: HistoryAgentOutput = runHistoryAgent(stateId, (currentHour + 1) % 24);

  const base = historyNow.historicalRisk;

  const timeline = [
    { label: "NOW", offsetMinutes: 0, projectedRisk: base, confidence: 95, condition: "Measured" },
    { label: "+15m", offsetMinutes: 15, projectedRisk: Math.min(100, Math.round(base * 0.95 + history15.historicalRisk * 0.05)), confidence: 88, condition: "Forecast" },
    { label: "+30m", offsetMinutes: 30, projectedRisk: Math.min(100, Math.round(base * 0.85 + history30.historicalRisk * 0.15 + 2)), confidence: 78, condition: "Forecast" },
    { label: "+60m", offsetMinutes: 60, projectedRisk: Math.min(100, Math.round(base * 0.70 + history60.historicalRisk * 0.30 + 4)), confidence: 65, condition: "Projected Trend" },
  ];

  return res.json({
    success: true,
    stateId,
    timeline,
    trend: timeline[3].projectedRisk > timeline[0].projectedRisk ? "INCREASING" : "STABLE",
  });
});

// 6. POST /api/routes/safe-v2 — Safe Corridors with Maps Service
agentRouter.post("/routes/safe-v2", async (req: Request, res: Response) => {
  const { origin, destination, avoidHighRiskZones = true, mode = "WALKING" } = req.body || {};

  const startLoc = origin || { lat: 12.9716, lng: 77.5946 };
  const destLoc = destination || { lat: 12.9800, lng: 77.6050 };

  const routeSafety = await calculateSafeRoutes({
    origin: startLoc,
    destination: destLoc,
    avoidHighRiskZones,
    mode,
  });

  return res.json({ success: true, ...routeSafety });
});

// 7. POST /api/responders/recommend-v2 — Smart Responder Allocation
agentRouter.post("/responders/recommend-v2", async (req: Request, res: Response) => {
  const { incidentLocation, incidentType, severity, responders } = req.body || {};

  const loc = incidentLocation || { lat: 12.9716, lng: 77.5946 };

  const allocation = await runResponderAgent({
    incidentLocation: loc,
    incidentType: incidentType || "Medical",
    severity: severity || "MEDIUM",
    responders,
  });

  return res.json({ success: true, ...allocation });
});

// 8. POST /api/alerts/send — Resend Emergency Email Alerts
agentRouter.post("/alerts/send", async (req: Request, res: Response) => {
  const {
    incidentId,
    touristName,
    touristPhone,
    location,
    severity = "HIGH",
    incidentType = "Safety Incident",
    description,
    recipientEmails,
    evidenceSummary,
  } = req.body || {};

  if (!incidentId || !location) {
    return res.status(400).json({ success: false, error: "incidentId and location are required" });
  }

  const result = await dispatchEmergencyAlert({
    incidentId,
    touristName,
    touristPhone,
    location,
    severity,
    incidentType,
    description: description || "Automated multi-agent emergency alert dispatched via Suraksha Platform.",
    recipientEmails,
    evidenceSummary,
  });

  return res.json(result);
});

// 9. GET /api/alerts/status/:incidentId — Deduplication and alert dispatch status
agentRouter.get("/alerts/status/:incidentId", (req: Request, res: Response) => {
  const status = getAlertDeduplicationStatus(req.params.incidentId);
  return res.json({ success: true, incidentId: req.params.incidentId, ...status });
});

// 10. GET /api/agent/runs — Execution Log
agentRouter.get("/runs", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    count: recentAgentRuns.length,
    runs: recentAgentRuns,
  });
});

// 11. POST /api/simulation/what-if — Multi-Agent What-If Simulator
agentRouter.post("/simulation/what-if", (req: Request, res: Response) => {
  const {
    baseLocation = { lat: 12.9716, lng: 77.5946 },
    stateId = "KA",
    rainfallShiftMm = 0,
    crowdMultiplier = 1,
    connectivityDrops = false,
  } = req.body || {};

  const baseWeather: WeatherAgentOutput = runWeatherAgent(baseLocation, 0);
  const baseCrowd: CrowdAgentOutput = runCrowdAgent(baseLocation, 50);
  const baseConn: ConnectivityAgentOutput = runConnectivityAgent(true);

  const simWeather: WeatherAgentOutput = runWeatherAgent(baseLocation, rainfallShiftMm);
  const simCrowd: CrowdAgentOutput = runCrowdAgent(baseLocation, Math.min(100, Math.round(50 * crowdMultiplier)));
  const simConn: ConnectivityAgentOutput = runConnectivityAgent(!connectivityDrops);

  const baseScore = Math.round((baseWeather.weatherRisk + baseCrowd.crowdRisk + baseConn.connectivityRisk) / 3);
  const simScore = Math.round((simWeather.weatherRisk + simCrowd.crowdRisk + simConn.connectivityRisk) / 3);

  return res.json({
    success: true,
    scenario: {
      rainfallShiftMm,
      crowdMultiplier,
      connectivityDrops,
    },
    baseline: {
      riskScore: baseScore,
      weatherRisk: baseWeather.weatherRisk,
      crowdRisk: baseCrowd.crowdRisk,
      connectivityRisk: baseConn.connectivityRisk,
    },
    simulated: {
      riskScore: simScore,
      delta: simScore - baseScore,
      weatherRisk: simWeather.weatherRisk,
      crowdRisk: simCrowd.crowdRisk,
      connectivityRisk: simConn.connectivityRisk,
    },
    recommendation: simScore > baseScore + 15
      ? "Scenario projects high escalation. Pre-position responders and issue push advisory."
      : "Scenario remains within manageable operational variance.",
  });
});
