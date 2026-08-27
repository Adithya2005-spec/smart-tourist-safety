import React from "react";
import type { ChaosSimulationState, SystemResilienceResponse } from "@/lib/chaos-simulator";
import { AlertTriangle, ShieldCheck, Wifi, WifiOff, Cpu, RefreshCcw, Activity } from "lucide-react";

export function ChaosSimulatorPanel({
  chaosState,
  onToggleChaos,
  resilience,
}: {
  chaosState: ChaosSimulationState;
  onToggleChaos: (key: keyof ChaosSimulationState) => void;
  resilience: SystemResilienceResponse;
}) {
  return (
    <div className="rounded-3xl border border-cyan-900 bg-[#082235] p-6 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500 text-slate-950 font-bold">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                CHAOS & RESILIENCE FAILURE SIMULATOR
              </span>
              <span className="rounded-full bg-cyan-950 border border-cyan-400 px-2 py-0.5 text-[9px] font-black text-cyan-300">
                [SIMULATION]
              </span>
            </div>
            <h3 className="text-sm font-black text-white">Infrastructure Outage & Fallback Test</h3>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">{resilience.resilienceMessage}</p>

      {/* Failure Toggles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <ChaosToggle label="Cloud Outage" active={chaosState.cloudOutage} onClick={() => onToggleChaos("cloudOutage")} />
        <ChaosToggle label="Internet Outage" active={chaosState.internetOutage} onClick={() => onToggleChaos("internetOutage")} />
        <ChaosToggle label="DB Outage" active={chaosState.dbOutage} onClick={() => onToggleChaos("dbOutage")} />
        <ChaosToggle label="GPS Loss" active={chaosState.gpsUnavailable} onClick={() => onToggleChaos("gpsUnavailable")} />
        <ChaosToggle label="AI Service Down" active={chaosState.aiServiceDown} onClick={() => onToggleChaos("aiServiceDown")} />
        <ChaosToggle label="Responder Dropout" active={chaosState.responderUnavailable} onClick={() => onToggleChaos("responderUnavailable")} />
        <ChaosToggle label="Road Closure" active={chaosState.roadClosure} onClick={() => onToggleChaos("roadClosure")} />
      </div>

      {/* Active Mitigation Steps */}
      {resilience.mitigationSteps.length > 0 && (
        <div className="rounded-2xl bg-cyan-950/80 p-3.5 border border-cyan-700/60 space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-cyan-300">Autonomous Mitigation Steps Executed:</p>
          <ul className="space-y-1 text-xs text-slate-200 list-disc list-inside">
            {resilience.mitigationSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChaosToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2.5 rounded-xl border font-bold transition text-left ${
        active
          ? "border-rose-500 bg-rose-500/20 text-rose-300 ring-1 ring-rose-400"
          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className={`h-2 w-2 rounded-full ${active ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
      </div>
    </button>
  );
}
