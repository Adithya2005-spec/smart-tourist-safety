import React from "react";
import { Activity, AlertTriangle, CheckCircle2, ShieldCheck, Cpu, Sliders } from "lucide-react";

export function ModelHealthPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
            MLOps & Model Governance [MODEL-DERIVED]
          </span>
          <h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
            Risk Prediction Model Health & Calibration
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            STABLE DRIFT (0.024)
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
            <Cpu className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Feature Drift Index</span>
          </div>
          <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">1.8% Delta</p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            KS-statistic vs 30-day baseline distribution
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
            <Activity className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Brier Calibration Score</span>
          </div>
          <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">0.042 (Calibrated)</p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Probability accuracy vs empirical outcomes
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
            <Sliders className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Input Data Quality</span>
          </div>
          <p className="mt-2 text-xl font-black text-slate-900 dark:text-white">99.8% Complete</p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            0.2% missing feature imputation rate
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <strong>Model Governance Notice:</strong> Risk prediction probabilities are continuously calibrated using historical incident logs. Calibration is evaluated over 1,000+ synthetic/empirical incident validation samples.
      </div>
    </div>
  );
}
