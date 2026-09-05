import React from "react";
import {
  Activity,
  CheckCircle2,
  CloudRain,
  Compass,
  Info,
  ShieldAlert,
  ShieldCheck,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import type { RiskPrediction } from "@/lib/safety-engine";
import type { EnvironmentalRiskResult } from "@/lib/weather-types";

interface WhyRiskExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: RiskPrediction;
  envRisk?: EnvironmentalRiskResult;
  locationName: string;
}

export const WhyRiskExplanationModal: React.FC<WhyRiskExplanationModalProps> = ({
  isOpen,
  onClose,
  risk,
  envRisk,
  locationName,
}) => {
  if (!isOpen) return null;

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      case "HIGH":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d2233] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">
                Why Did AI Calculate This Risk?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent Multi-Factor Risk Decomposition • {locationName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Overall Risk Score */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#050f1a] p-4 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overall Risk
            </p>
            <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
              {risk.score} <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </p>
            <span
              className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getSeverityBadgeClass(
                risk.severity
              )}`}
            >
              {risk.severity}
            </span>
          </div>

          {/* Environmental Contribution % */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#050f1a] p-4 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Env Contribution
            </p>
            <p className="mt-1 text-2xl font-black text-cyan-600 dark:text-cyan-400">
              {risk.environmentalContributionPct ?? 25}%
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              AWS Intelligence
            </p>
          </div>

          {/* Weather Confidence % */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#050f1a] p-4 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Weather Confidence
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {Math.round((envRisk?.weatherConfidence ?? 0.92) * 100)}%
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {envRisk?.agreeingStationCount ?? 3} Stations Sync
            </p>
          </div>
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Contributing Factor Decomposition
          </p>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {risk.factors.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#050f1a] p-3 border border-slate-200/80 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-cyan-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {f.factor}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  +{f.impact} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Provenance Footer */}
        {envRisk && (
          <div className="rounded-2xl bg-cyan-950/30 border border-cyan-500/20 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-cyan-300">
              <span className="font-bold flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-cyan-400" />
                Data Provenance & Station Health
              </span>
              <span className="font-mono text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded text-cyan-200">
                Primary: {envRisk.primaryStationId || "AWS-KA-101"}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              {envRisk.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-cyan-500/10">
              <span>Nearest AWS: {envRisk.nearestStationDistanceKm} km</span>
              <span>Sensor Health: {Math.round(envRisk.sensorHealthScore * 100)}%</span>
              <span>Trend: {envRisk.weatherTrend}</span>
            </div>
          </div>
        )}

        {/* Close Action */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#082235] dark:bg-cyan-500 text-white dark:text-slate-950 px-5 py-2.5 text-xs font-bold hover:opacity-90 transition"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
