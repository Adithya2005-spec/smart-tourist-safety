import React, { useState } from "react";
import { useSafety } from "@/contexts/SafetyContext";
import { AskSurakshaPanel } from "@/components/AskSurakshaPanel";
import { IncidentCopilot } from "@/components/IncidentCopilot";
import { detectSystemAnomalies } from "@/lib/anomaly-detection-pipeline";
import { computeTemporalRiskForecast } from "@/lib/temporal-risk-model";
import { evaluateDataDriftAnalysis } from "@/lib/data-drift-engine";
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
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === "HEALTHY" || status === "NORMAL" || status === "VERIFIED"
      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
      : status === "WARNING" || status === "UNUSUAL"
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

  const systemHealth = liveTools.getSystemHealth();
  const modelHealth = liveTools.getModelHealth();
  const incidentStats = liveTools.getIncidentStatistics();
  const riskRes = liveTools.getCurrentRisk(undefined, safety.zones);
  const connRes = liveTools.getConnectivityStatus(safety.online);

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

  return (
    <div className="min-h-screen bg-[#050f1a] text-white">
      {/* Page Header */}
      <div className="border-b border-white/10 bg-[#071e2e]/90 px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                SURAKSHA SAFETY INTELLIGENCE
              </p>
              <h1 className="text-lg font-black text-white">AI Decision Support Dashboard</h1>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <StatusBadge status={systemHealth.data.status} />
            <StatusBadge status={driftReport.overallStatus} />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-300">
              {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
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

        {/* Temporal Forecast Panel */}
        <div className="rounded-3xl border border-cyan-900 bg-[#071e2e] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-black text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-300" />
              Temporal Risk Forecast
            </h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-black text-cyan-300">
              {temporal.forecastTag}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Current Risk", value: `${temporal.currentRisk}/100` },
              { label: "1-Hour Forecast", value: `${temporal.forecastScore1Hour}/100` },
              { label: "3-Hour Forecast", value: `${temporal.forecastScore3Hour}/100` },
              { label: "Trend", value: temporal.trend },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{item.label}</p>
                <p className="text-lg font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">{temporal.forecastExplanation}</p>
        </div>

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

            {/* Model Health Summary */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-2 text-xs">
              <p className="font-black text-purple-300 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Active Model Health
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/5 p-2.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Model Version</p>
                  <p className="font-black text-white">{modelHealth.data.version}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Brier Score</p>
                  <p className="font-black text-emerald-300">{modelHealth.data.brierScore}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Feature Drift</p>
                  <p className="font-black text-cyan-300">{modelHealth.data.driftStatus}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Data Quality</p>
                  <p className="font-black text-white">{modelHealth.data.dataQuality}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
