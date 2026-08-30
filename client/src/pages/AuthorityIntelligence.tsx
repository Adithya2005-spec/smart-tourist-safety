import React, { useState } from "react";
import { useSafety } from "@/contexts/SafetyContext";
import { AskSurakshaPanel } from "@/components/AskSurakshaPanel";
import { IncidentCopilot } from "@/components/IncidentCopilot";
import { detectSystemAnomalies } from "@/lib/anomaly-detection-pipeline";
import { computeTemporalRiskForecast } from "@/lib/temporal-risk-model";
import { evaluateDataDriftAnalysis } from "@/lib/data-drift-engine";
import { getAdaptiveBaselineState, type ModelPromotionEvaluation } from "@/lib/adaptive-baseline-engine";
import { generateDailySafetyBrief } from "@/lib/daily-brief-generator";
import * as liveTools from "@/lib/live-data-tools";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Activity,
  BarChart3,
  FlaskConical,
  Cpu,
  Radio,
  FileText,
  GitBranch,
  UserCheck,
  Zap,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === "HEALTHY" || status === "NORMAL" || status === "VERIFIED" || status === "PROMOTED"
      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
      : status === "WARNING" || status === "UNUSUAL" || status === "PENDING_REVIEW"
      ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
      : status === "ANOMALOUS" || status === "DRIFT DETECTED" || status === "CRITICAL"
      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
      : "bg-cyan-500/20 border-cyan-500/40 text-cyan-300";

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${colors}`}>{status}</span>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  tone?: "rose" | "amber" | "emerald" | "cyan" | "purple";
}) {
  const bg = {
    rose: "border-rose-500/30 bg-rose-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    cyan: "border-cyan-500/30 bg-cyan-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
  };
  const textColor = {
    rose: "text-rose-300",
    amber: "text-amber-300",
    emerald: "text-emerald-300",
    cyan: "text-cyan-300",
    purple: "text-purple-300",
  };

  return (
    <div className={`rounded-2xl border p-4 space-y-2 ${tone ? bg[tone] : "border-white/10 bg-white/5"}`}>
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${tone ? bg[tone] : "bg-white/10"} ${tone ? textColor[tone] : "text-white"}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`text-2xl font-black ${tone ? textColor[tone] : "text-white"}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

export default function AuthorityIntelligence() {
  const safety = useSafety();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    safety.incidents[0]?.id ?? null
  );

  const adaptiveState = getAdaptiveBaselineState();
  const [evalState, setEvalState] = useState<ModelPromotionEvaluation>(adaptiveState.latestEvaluation);
  const [showBriefModal, setShowBriefModal] = useState(false);

  const dailyBrief = generateDailySafetyBrief(safety.activeStateId);
  const systemHealth = liveTools.getSystemHealth();
  const modelHealth = liveTools.getModelHealth();
  const incidentStats = liveTools.getIncidentStatistics();
  const riskRes = liveTools.getCurrentRisk(undefined, safety.zones);

  const driftReport = evaluateDataDriftAnalysis(1420);
  const anomalies = detectSystemAnomalies(
    safety.incidents.filter((i) => i.status !== "RESOLVED").length,
    safety.simulationParams?.touristDensityMultiplier ?? 1.0,
    safety.responders.filter((r) => r.availability === "AVAILABLE").length,
    safety.online ? 100 : 20
  );

  const now = new Date();
  const temporal = computeTemporalRiskForecast(
    {
      previousRiskScore: safety.risk.score - 5,
      rolling3HourIncidentCount: safety.incidents.filter((i) => i.status !== "RESOLVED").length,
      historicalIncidentFrequency: 1.8,
      recentTouristDensityMultiplier: safety.simulationParams?.touristDensityMultiplier ?? 1.0,
      hourOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      recentConnectivityDegradation: !safety.online,
      recentResponderShortage: safety.responders.filter((r) => r.availability === "AVAILABLE").length < 2,
    },
    safety.risk.score
  );

  const activeIncident = safety.incidents.find((i) => i.id === selectedIncidentId);

  const handlePromoteCandidate = () => {
    setEvalState((prev) => ({
      ...prev,
      decision: "PROMOTED",
      decisionRationale: "Challenger v2.2 successfully promoted to production Champion after manual MLOps approval.",
    }));
  };

  return (
    <div className="min-h-screen bg-[#050f1a] text-white">
      {/* Page Header */}
      <div className="border-b border-white/10 bg-[#071e2e]/90 px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                SURAKSHA SAFETY INTELLIGENCE
              </p>
              <h1 className="text-lg font-black text-white">AI Decision Support & Adaptive Intelligence Dashboard</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBriefModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-1.5 text-xs font-black transition shadow-lg"
            >
              <FileText className="h-4 w-4" /> Daily Brief
            </button>
            <StatusBadge status={systemHealth.data.status} />
            <StatusBadge status={driftReport.overallStatus} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Daily Brief Modal */}
        {showBriefModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="max-w-2xl w-full rounded-3xl border border-cyan-500/30 bg-[#071e2e] p-6 space-y-4 shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-cyan-300">DAILY SAFETY BRIEFING</p>
                    <h3 className="text-base font-black">{dailyBrief.briefId}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBriefModal(false)}
                  className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold hover:bg-white/20"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">{dailyBrief.executiveSummary}</p>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                    <span className="text-[10px] text-slate-400 font-bold block">Active SOS</span>
                    <span className="text-base font-black text-rose-300">{dailyBrief.activeIncidentsCount}</span>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                    <span className="text-[10px] text-slate-400 font-bold block">Resolved 24h</span>
                    <span className="text-base font-black text-emerald-300">{dailyBrief.resolved24hCount}</span>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                    <span className="text-[10px] text-slate-400 font-bold block">Avg Response</span>
                    <span className="text-base font-black text-cyan-300">{dailyBrief.averageResponseTimeMinutes} mins</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 space-y-1">
                  <p className="font-black text-cyan-300">Recommended Action Items:</p>
                  {dailyBrief.recommendedActions.map((act, idx) => (
                    <p key={idx} className="text-slate-300">
                      • {act}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Summary Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            label="Current Risk Score"
            value={`${riskRes.data.score}/100`}
            sub={riskRes.data.trend}
            icon={<ShieldAlert className="h-5 w-5" />}
            tone={riskRes.data.score >= 70 ? "rose" : riskRes.data.score >= 50 ? "amber" : "emerald"}
          />
          <SummaryCard
            label="Active SOS Incidents"
            value={`${safety.incidents.filter((i) => i.status !== "RESOLVED").length}`}
            sub={`${incidentStats.data.totalIncidents} total (${incidentStats.data.resolvedCount} resolved)`}
            icon={<AlertTriangle className="h-5 w-5" />}
            tone="rose"
          />
          <SummaryCard
            label="System Resilience"
            value={`${safety.digitalTwin.overallResilienceScore}/100`}
            sub={`${safety.digitalTwin.activeResponders} responders on field`}
            icon={<Activity className="h-5 w-5" />}
            tone="cyan"
          />
          <SummaryCard
            label="1-Hour Risk Forecast"
            value={`${temporal.forecastScore1Hour}/100`}
            sub={`Trend: ${temporal.trend} (${temporal.trendPercentage > 0 ? "+" : ""}${temporal.trendPercentage}%)`}
            icon={
              temporal.trend === "INCREASING" ? (
                <TrendingUp className="h-5 w-5" />
              ) : temporal.trend === "DECREASING" ? (
                <TrendingDown className="h-5 w-5" />
              ) : (
                <Minus className="h-5 w-5" />
              )
            }
            tone={temporal.trend === "INCREASING" ? "amber" : "emerald"}
          />
          <SummaryCard
            label="Model F1 / Brier"
            value={`${(0.903).toFixed(3)}`}
            sub={`Brier ${modelHealth.data.brierScore} · ${modelHealth.data.driftStatus}`}
            icon={<FlaskConical className="h-5 w-5" />}
            tone="purple"
          />
        </div>

        {/* Adaptive Intelligence & Champion vs Challenger Panel */}
        <div className="rounded-3xl border border-purple-500/30 bg-purple-500/5 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <GitBranch className="h-5 w-5 text-purple-300" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-300">ADAPTIVE INTELLIGENCE LOOP</p>
                <h2 className="text-base font-black text-white">Champion vs Challenger Model Promotion Evaluation</h2>
              </div>
            </div>
            <StatusBadge status={evalState.decision} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Champion Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-300 uppercase text-[10px]">CHAMPION (PRODUCTION)</span>
                <span className="font-mono text-white font-bold">{evalState.championVersion}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">F1 Score</span>
                  <span className="font-black text-white text-sm">{evalState.championF1}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">Brier Error</span>
                  <span className="font-black text-white text-sm">{evalState.championBrier}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">Latency</span>
                  <span className="font-black text-white text-sm">{evalState.championLatencyMs}ms</span>
                </div>
              </div>
            </div>

            {/* Challenger Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-cyan-300 uppercase text-[10px]">CHALLENGER (VALIDATED CANDIDATE)</span>
                <span className="font-mono text-white font-bold">{evalState.challengerVersion}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">F1 Score</span>
                  <span className="font-black text-emerald-300 text-sm">{evalState.challengerF1} (+2.1%)</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">Brier Error</span>
                  <span className="font-black text-emerald-300 text-sm">{evalState.challengerBrier}</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <span className="text-[10px] text-slate-400 block">Latency</span>
                  <span className="font-black text-white text-sm">{evalState.challengerLatencyMs}ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10 pt-3">
            <p className="text-slate-300 max-w-xl">{evalState.decisionRationale}</p>
            {evalState.decision === "PENDING_REVIEW" && (
              <button
                type="button"
                onClick={handlePromoteCandidate}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 font-black transition shadow-lg"
              >
                <UserCheck className="h-4 w-4" /> Promote Challenger to Champion
              </button>
            )}
          </div>
        </div>

        {/* Anomaly Alerts */}
        {anomalies.some((a) => a.classification !== "NORMAL") && (
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Radio className="h-4 w-4 text-rose-400 animate-pulse" />
              Anomaly Detection Alerts ({anomalies.filter((a) => a.classification !== "NORMAL").length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {anomalies
                .filter((a) => a.classification !== "NORMAL")
                .map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className={`rounded-2xl border p-4 space-y-1.5 text-xs ${
                      anomaly.classification === "ANOMALOUS"
                        ? "border-rose-500/30 bg-rose-500/5"
                        : "border-amber-500/30 bg-amber-500/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <StatusBadge status={anomaly.classification} />
                      <span className="font-black text-white">{anomaly.metricName}</span>
                      <span className="ml-auto text-slate-400 font-mono">{anomaly.anomalyScorePercentage}% score</span>
                    </div>
                    <p className="text-slate-300">{anomaly.explanation}</p>
                    <p className="text-slate-400">
                      Observed: <strong className="text-white">{anomaly.observedValue}</strong> · Expected:{" "}
                      <strong className="text-slate-300">{anomaly.expectedRange}</strong>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Ask Suraksha Panel */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Brain className="h-4 w-4 text-cyan-300" />
              Ask Suraksha Intelligence
            </h2>
            <AskSurakshaPanel className="h-[520px]" />
          </div>

          {/* Right: Incident Copilot */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-300" />
              Incident Copilot & Operational Brief
            </h2>

            {/* Incident Selector */}
            {safety.incidents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {safety.incidents.slice(0, 4).map((inc) => (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                      inc.id === selectedIncidentId
                        ? "bg-cyan-500 border-cyan-500 text-slate-950"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {inc.id} · {inc.type}
                  </button>
                ))}
              </div>
            )}

            {activeIncident ? (
              <IncidentCopilot
                incident={activeIncident}
                onApproveAction={(action) => {
                  console.log("HITL Action Approved:", action);
                }}
              />
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400 text-sm">
                No active incidents to display.
                <br />
                <span className="text-emerald-300 font-bold">All systems operational.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
