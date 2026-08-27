import React from "react";
import { Activity, Cpu, Database, Network, ShieldCheck, Zap, BarChart3, Clock, AlertCircle } from "lucide-react";

export function SystemHealthPanel() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-[#082235] p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-300">
              <Activity className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wider">System Observability & Latency Monitor</p>
            </div>
            <h3 className="mt-1 text-xl font-black">Platform Operational Health</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-bold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            SYSTEM OPERATIONAL
          </span>
        </div>
      </div>

      {/* Latency Percentiles Card Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HealthCard icon={Zap} label="API Latency (P50)" value="42 ms" target="< 100 ms" status="EXCELLENT" />
        <HealthCard icon={Network} label="API Latency (P95)" value="88 ms" target="< 200 ms" status="OPTIMAL" />
        <HealthCard icon={Clock} label="API Latency (P99)" value="140 ms" target="< 300 ms" status="STABLE" />
        <HealthCard icon={Cpu} label="Risk Inference Latency" value="12 ms" target="< 50 ms" status="FAST" />
      </div>

      {/* Observability Metrics Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            Infrastructure Latency & Depth
          </h4>
          <div className="mt-4 space-y-3">
            <MetricRow label="SOS Propagation Latency" value="135 ms" status="Pass" />
            <MetricRow label="Database Query Latency" value="18 ms" status="Pass" />
            <MetricRow label="IndexedDB Offline Queue Depth" value="0 events" status="Clear" />
            <MetricRow label="Queue Sync Success Rate" value="99.8 %" status="Pass" />
            <MetricRow label="System Error Rate (24h)" value="0.02 %" status="Nominal" />
          </div>
        </div>

        {/* Structured Logging Event Sample */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm font-mono text-xs">
          <h4 className="text-sm font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            Structured Telemetry Log Stream
          </h4>
          <div className="rounded-2xl bg-slate-950 p-4 text-slate-300 space-y-2 overflow-x-auto leading-relaxed">
            <p className="text-cyan-400">[2026-08-26T20:00:46Z] INFO</p>
            <p><span className="text-slate-500">CORR-ID:</span> CORR-INC-1042</p>
            <p><span className="text-slate-500">EVENT:</span> SOS_PROPAGATED</p>
            <p><span className="text-slate-500">ACTOR:</span> TOURIST (SL-KA-9042)</p>
            <p><span className="text-slate-500">LATENCY:</span> 132 ms</p>
            <p><span className="text-slate-500">STATUS:</span> SUCCESS (200 OK)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthCard({ icon: Icon, label, value, target, status }: { icon: React.ElementType; label: string; value: string; target: string; status: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tabular-nums">{value}</p>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Target: {target}</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">{status}</span>
      </div>
    </div>
  );
}

function MetricRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-600 dark:text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{value}</span>
        <span className="rounded-md bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">{status}</span>
      </div>
    </div>
  );
}
