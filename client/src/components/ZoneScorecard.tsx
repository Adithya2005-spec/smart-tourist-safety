import React from "react";
import type { RiskZone } from "@/lib/safety-engine";
import { ShieldCheck, Wifi, Users, Gauge, Navigation } from "lucide-react";

export function ZoneScorecard({ zones }: { zones: RiskZone[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Zonal Safety & Resilience Scorecards ({zones.length})
        </h3>
        <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800">
          [MODEL-DERIVED]
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {zones.map((zone) => {
          const incidentRisk = zone.score;
          const connectivity = zone.score >= 70 ? 48 : 92;
          const responderCoverage = zone.score >= 70 ? 84 : 96;
          const crowdPressure = Math.min(95, zone.incidentCount * 12 + 40);
          const routeSafety = Math.max(20, 100 - zone.score);

          const overallResilience = Math.round(
            (100 - incidentRisk) * 0.35 + connectivity * 0.25 + responderCoverage * 0.25 + routeSafety * 0.15
          );

          return (
            <div
              key={zone.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-950 dark:text-white">{zone.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{zone.factor}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase">Resilience</span>
                  <p
                    className={`text-xl font-black ${
                      overallResilience >= 75
                        ? "text-emerald-600 dark:text-emerald-400"
                        : overallResilience >= 50
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {overallResilience}/100
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Metric label="Incident Risk" value={`${incidentRisk}/100`} alert={incidentRisk >= 65} />
                <Metric label="Connectivity" value={`${connectivity}% LTE`} alert={connectivity < 60} />
                <Metric label="Responder Coverage" value={`${responderCoverage}%`} />
                <Metric label="Route Safety" value={`${routeSafety}/100`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`font-black ${alert ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}`}>
        {value}
      </span>
    </div>
  );
}
