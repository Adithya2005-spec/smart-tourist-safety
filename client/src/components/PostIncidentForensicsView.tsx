import React from "react";
import type { IncidentForensicsReport } from "@/lib/forensics-engine";
import { FileText, CheckCircle2, UserCheck, Cpu, Eye, BadgeCheck } from "lucide-react";

export function PostIncidentForensicsView({ report }: { report: IncidentForensicsReport }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
            POST-INCIDENT FORENSICS REPORT [AUDITED]
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Forensic Audit Report: {report.incidentId}
          </h3>
        </div>
        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          Duration: {report.totalDurationMinutes} mins
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Initial Risk vs Final</p>
          <p className="text-sm font-black text-slate-900 dark:text-white mt-1">
            {report.initialRiskScore} → {report.postIncidentRiskScore} pts
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Responder Response</p>
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {report.responderResponseTimeSeconds} seconds
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold">SHA-256 Ledger Anchor</p>
          <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 mt-1 truncate">
            {report.auditHash}
          </p>
        </div>
      </div>

      {/* Categorized Forensics Timeline */}
      <div className="mt-4 space-y-3">
        {report.items.map((item, index) => {
          const categoryTag =
            item.category === "OBSERVED_EVENT"
              ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700"
              : item.category === "MODEL_PREDICTION"
              ? "bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700"
              : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";

          return (
            <div key={index} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase border ${categoryTag}`}>
                  [{item.category.replace("_", " ")}]
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{item.title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.detail}</p>
              <p className="text-[10px] font-bold text-slate-400 italic">Actor: {item.actor}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
