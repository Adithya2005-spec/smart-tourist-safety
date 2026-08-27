import React from "react";
import type { IncidentEvidenceGraph } from "@/lib/knowledge-graph";
import { BadgeCheck, ShieldAlert, User, MapPin, AlertTriangle, Building2, ShieldCheck, CheckCircle2, Link2 } from "lucide-react";

export function IncidentEvidenceGraphView({ graph }: { graph: IncidentEvidenceGraph }) {
  const nodeIcons: Record<string, React.ElementType> = {
    TOURIST: User,
    LOCATION: MapPin,
    RISK: AlertTriangle,
    SOS: ShieldAlert,
    AUTHORITY: Building2,
    RESPONDER: ShieldCheck,
    ACTION: ShieldCheck,
    RESOLUTION: CheckCircle2,
    VERIFICATION: BadgeCheck,
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
            INSPECTION EVIDENCE GRAPH
          </span>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Incident Chain: {graph.incidentId}
          </h3>
        </div>
        <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-700 px-2.5 py-0.5 text-[10px] font-bold text-cyan-900 dark:text-cyan-300">
          {graph.nodes.length} Nodes Anchored
        </span>
      </div>

      {/* Nodes Timeline Chain */}
      <div className="mt-5 space-y-3">
        {graph.nodes.map((node, index) => {
          const Icon = nodeIcons[node.type] || Link2;
          const isLast = index === graph.nodes.length - 1;

          return (
            <div key={node.id} className="relative flex items-start gap-3">
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
              )}
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{node.label}</p>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(node.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{node.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
