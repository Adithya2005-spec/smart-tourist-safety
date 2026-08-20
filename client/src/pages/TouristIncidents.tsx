import { RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { CheckCircle2, Globe2, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

const stages = ["CREATED", "VERIFIED", "ASSIGNED", "RESPONDING", "RESOLVED"];

export default function TouristIncidents() {
  const { travellerIncidents, profile, activeState } = useSafety();
  const mine = travellerIncidents.filter((incident) => incident.touristId === profile.touristId);

  return (
    <SafetyShell eyebrow="Traveller workspace" title="My incidents & SOS lifecycle">
      <div className="mx-auto max-w-5xl space-y-5">
        {mine.length === 0 ? (
          <SafetyNotice>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-bold">No active incidents reported for {profile.fullName}.</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your safety geofence and emergency helplines for {activeState.name} are active and ready.
                </p>
              </div>
              <Link
                href="/tourist/sos"
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
              >
                Create SOS Report
              </Link>
            </div>
          </SafetyNotice>
        ) : (
          mine.map((incident) => {
            const stageIndex = stages.indexOf(incident.status);
            const latest = incident.audit[incident.audit.length - 1];
            return (
              <article
                key={incident.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-7 text-slate-900 dark:text-slate-100"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400 dark:text-slate-500">
                      {incident.id}
                    </p>
                    <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                      {incident.type} at {incident.location}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Dispatched on {new Date(incident.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RiskBadge score={incident.riskScore} band={incident.severity} compact />
                    <span className="rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-700 px-3 py-1 text-[10px] font-bold tracking-[.1em] text-cyan-800 dark:text-cyan-300">
                      {incident.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-7 grid grid-cols-5 gap-1.5">
                  {stages.map((stage, index) => (
                    <div key={stage} className="min-w-0">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          index <= stageIndex
                            ? "bg-cyan-600 dark:bg-cyan-400 shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      />
                      <p
                        className={`mt-2 text-[9px] font-bold tracking-[.08em] uppercase truncate ${
                          index <= stageIndex
                            ? "text-cyan-800 dark:text-cyan-300"
                            : "text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        {stage}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 dark:border-slate-800 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400 dark:text-slate-500">
                      Assigned Responder
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {incident.responderName ?? "Awaiting Command Centre Dispatch"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400 dark:text-slate-500">
                      Latest Audit Action
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {latest?.detail ?? "No lifecycle update yet"}
                    </p>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
                  {incident.audit.map((entry) => (
                    <div key={entry.id} className="flex gap-3 text-xs">
                      <div className="mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{entry.action}</p>
                        <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                          {entry.detail} · {new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })
        )}

        <SafetyNotice tone="slate">
          <div className="flex gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <p className="text-xs">
              <strong>Accountability Guarantee:</strong> Every SOS report generated across all 36 Indian territories is logged with an immutable audit trail and state-specific responder telemetry.
            </p>
          </div>
        </SafetyNotice>
      </div>
    </SafetyShell>
  );
}
