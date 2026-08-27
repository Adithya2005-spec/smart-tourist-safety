import React from "react";
import { AuditEntry, IncidentStatus } from "@/lib/safety-engine";
import { CheckCircle2, Clock, Shield, AlertTriangle, UserCheck, Navigation, FileCheck, Hash } from "lucide-react";

type StepDefinition = {
  status: IncidentStatus;
  label: string;
  actorRole: string;
  icon: React.ElementType;
};

const LIFECYCLE_STEPS: StepDefinition[] = [
  { status: "SOS_CREATED", label: "SOS Created", actorRole: "Tourist", icon: AlertTriangle },
  { status: "ACKNOWLEDGED", label: "Acknowledged", actorRole: "Authority Operator", icon: Clock },
  { status: "RESPONDER_ASSIGNED", label: "Responder Assigned", actorRole: "Dispatch Engine", icon: UserCheck },
  { status: "RESPONDER_EN_ROUTE", label: "En Route", actorRole: "Responder Unit", icon: Navigation },
  { status: "ON_SCENE", label: "On Scene", actorRole: "Responder Unit", icon: Shield },
  { status: "RESOLVED", label: "Resolved", actorRole: "Responder Unit", icon: CheckCircle2 },
  { status: "VERIFIED", label: "Chained Audit Verified", actorRole: "Blockchain Ledger", icon: FileCheck },
];

export function IncidentTimeline({
  currentStatus,
  auditTrail,
}: {
  currentStatus: IncidentStatus;
  auditTrail: AuditEntry[];
}) {
  const normalizedStatus = currentStatus === "CREATED" ? "SOS_CREATED" : currentStatus === "ASSIGNED" ? "RESPONDER_ASSIGNED" : currentStatus === "RESPONDING" ? "RESPONDER_EN_ROUTE" : currentStatus;

  const currentStepIndex = LIFECYCLE_STEPS.findIndex((s) => s.status === normalizedStatus);

  return (
    <div className="space-y-6">
      {/* Horizontal Step Indicator */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-800 -z-0" />
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-cyan-600 dark:bg-cyan-400 transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(0, (currentStepIndex / (LIFECYCLE_STEPS.length - 1)) * 100)}%`,
          }}
        />

        {LIFECYCLE_STEPS.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? "border-cyan-600 bg-cyan-600 text-white shadow-lg ring-4 ring-cyan-100 dark:ring-cyan-950 dark:bg-cyan-500"
                    : isDone
                    ? "border-cyan-600 bg-white text-cyan-600 dark:border-cyan-400 dark:bg-slate-900 dark:text-cyan-400"
                    : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`mt-2 text-[10px] font-bold tracking-tight text-center max-w-[70px] ${
                  isCurrent
                    ? "text-cyan-700 dark:text-cyan-300 font-extrabold"
                    : isDone
                    ? "text-slate-900 dark:text-slate-200"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Audit Event Chronological Log */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Event Lifecycle Audit Log ({auditTrail.length} Events)
        </h4>

        <div className="space-y-3">
          {auditTrail.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs"
            >
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-mono text-[10px] font-bold">
                {entry.actorType === "AUTHORITY" ? "AUTH" : entry.actorType === "RESPONDER" ? "RESP" : entry.actorType === "SYSTEM" ? "SYS" : "USER"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {entry.action} <span className="font-normal text-slate-500">by {entry.actor}</span>
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{entry.detail}</p>

                {entry.hash && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 font-mono text-[10px] text-emerald-800 dark:text-emerald-300">
                    <Hash className="h-3 w-3" />
                    <span className="truncate max-w-[240px]">Hash: {entry.hash}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
