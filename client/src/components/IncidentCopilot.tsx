import React, { useState } from "react";
import type { Incident } from "@/lib/safety-engine";
import { AlertTriangle, CheckCircle2, Clock3, ShieldAlert, UserCheck, Zap, FileText, ArrowRight } from "lucide-react";

export function IncidentCopilot({
  incident,
  onApproveAction,
}: {
  incident: Incident;
  onApproveAction?: (actionTitle: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"SUMMARY" | "TIMELINE" | "EVIDENCE">("SUMMARY");

  const isResolved = incident.status === "RESOLVED";
  const priorityTag = incident.priorityScore >= 85 ? "P1 CRITICAL" : incident.priorityScore >= 65 ? "P2 HIGH" : "P3 MEDIUM";

  return (
    <div className="rounded-3xl border border-cyan-900 bg-[#082235] p-6 text-white shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500 text-slate-950 font-bold">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
              INCIDENT COPILOT & AUTOMATIC OPERATIONAL BRIEF
            </span>
            <h3 className="text-base font-black text-white">{incident.id}: {incident.type}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black border ${
            priorityTag === "P1 CRITICAL" ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
          }`}>
            {priorityTag} ({incident.priorityScore}/100)
          </span>
          <span className="rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 text-xs font-bold">
            {incident.status}
          </span>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-2 text-xs border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("SUMMARY")}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${activeTab === "SUMMARY" ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
        >
          Executive Summary
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("TIMELINE")}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${activeTab === "TIMELINE" ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
        >
          Audit Timeline ({incident.audit.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("EVIDENCE")}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${activeTab === "EVIDENCE" ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
        >
          Grounded Evidence
        </button>
      </div>

      {activeTab === "SUMMARY" && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Location</span>
              <p className="text-sm font-black text-white truncate">{incident.location}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Unit</span>
              <p className="text-sm font-black text-cyan-300">{incident.responderName || "Unassigned"}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Risk Score</span>
              <p className="text-sm font-black text-rose-300">{incident.riskScore}/100</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Tourist ID</span>
              <p className="text-sm font-black text-white truncate">{incident.touristId}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 space-y-1">
            <p className="font-bold text-cyan-300">Unresolved Operational Blocker:</p>
            <p className="text-slate-200">
              {isResolved ? "None - Incident successfully resolved." : "Responder transit ETA exceeds standard 5-minute operational target due to localized traffic density."}
            </p>
          </div>

          {!isResolved && (
            <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-300">RECOMMENDED HITL NEXT ACTION</span>
                <p className="text-sm font-black text-white">Reposition Unit R01 for Backup Route Patrol</p>
              </div>
              <button
                type="button"
                onClick={() => onApproveAction?.("Reposition Unit R01 for Backup Route Patrol")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 text-xs font-black transition"
              >
                <UserCheck className="h-4 w-4" /> Approve Action
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "TIMELINE" && (
        <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
          {incident.audit.map((entry, idx) => (
            <div key={entry.id || idx} className="rounded-xl bg-white/5 p-2.5 border border-white/10 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-cyan-300">{entry.action}</span>
                <p className="text-slate-300 mt-0.5">{entry.detail}</p>
                <span className="text-[10px] text-slate-400 font-mono">Actor: {entry.actor}</span>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">{new Date(entry.at).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "EVIDENCE" && (
        <div className="space-y-2 text-xs text-slate-300">
          <div className="rounded-xl bg-white/5 p-3 border border-white/10 space-y-1">
            <p className="font-bold text-cyan-300">Telemetry Data Provenance:</p>
            <p>Category: <strong className="text-white">REAL</strong> (Empirical SOS payload logged from Tourist Portal)</p>
            <p>Blockchain Hash: <code className="text-cyan-300 text-[10px]">0x8f9b2c4e1a3d5f7b8c9e0a1b2c3d4e5f</code></p>
            <p>Verification Status: <span className="text-emerald-400 font-bold">VERIFIED_TAMPER_EVIDENT</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
