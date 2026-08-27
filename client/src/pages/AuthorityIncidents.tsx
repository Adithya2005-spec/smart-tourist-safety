import { AuthorityAccessDenied, useAuthorityAccess } from "@/components/AuthorityAccess";
import { RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { useSafety } from "@/contexts/SafetyContext";
import { optimizeResponderAssignment } from "@/lib/responder-engine";
import { CheckCheck, CircleCheck, Clock3, RadioTower, ShieldAlert, UserRoundPlus, Navigation, Sparkles, FileCheck } from "lucide-react";
import { useState } from "react";
import type { Incident, IncidentStatus } from "@/lib/safety-engine";

export default function AuthorityIncidents() {
  const allowed = useAuthorityAccess();
  const { incidents, responders, transitionIncident, assignResponder, recordAudit, activeState } = useSafety();
  const [filter, setFilter] = useState<"ALL" | IncidentStatus>("ALL");

  if (!allowed) return <AuthorityAccessDenied />;

  const visible = filter === "ALL" ? incidents : incidents.filter((incident) => incident.status === filter);

  return (
    <SafetyShell eyebrow="Authority command centre" title={`${activeState.name} Priority Incident Queue`}>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["ALL", "SOS_CREATED", "ACKNOWLEDGED", "RESPONDER_ASSIGNED", "RESPONDER_EN_ROUTE", "ON_SCENE", "RESOLVED"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wider transition ${
              filter === item
                ? "bg-[#082235] text-white shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {visible.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            responders={responders}
            onTransition={transitionIncident}
            onAssign={assignResponder}
            onAudit={recordAudit}
          />
        ))}
      </div>
    </SafetyShell>
  );
}

function IncidentCard({
  incident,
  responders,
  onTransition,
  onAssign,
  onAudit,
}: {
  incident: Incident;
  responders: ReturnType<typeof useSafety>["responders"];
  onTransition: ReturnType<typeof useSafety>["transitionIncident"];
  onAssign: ReturnType<typeof useSafety>["assignResponder"];
  onAudit: ReturnType<typeof useSafety>["recordAudit"];
}) {
  const recommendations = optimizeResponderAssignment(incident.coordinate, responders);
  const bestResponder = recommendations.find((r) => r.isRecommended) || recommendations[0];

  const [selectedResponderId, setSelectedResponderId] = useState(bestResponder?.responder.id || "");

  const handleNextStep = () => {
    if (incident.status === "CREATED" || incident.status === "SOS_CREATED") {
      onTransition(incident.id, "ACKNOWLEDGED", "AUTH-OPERATOR-01");
    } else if (incident.status === "ACKNOWLEDGED") {
      onTransition(incident.id, "RESPONDER_ASSIGNED", "AUTH-OPERATOR-01");
    } else if (incident.status === "ASSIGNED" || incident.status === "RESPONDER_ASSIGNED") {
      onTransition(incident.id, "RESPONDER_EN_ROUTE", incident.responderId || "R01");
    } else if (incident.status === "RESPONDING" || incident.status === "RESPONDER_EN_ROUTE") {
      onTransition(incident.id, "ON_SCENE", incident.responderId || "R01");
    } else if (incident.status === "ON_SCENE") {
      onTransition(incident.id, "RESOLVED", incident.responderId || "R01");
    } else if (incident.status === "RESOLVED") {
      onAudit(incident.id);
    }
  };

  return (
    <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {incident.id}
            </span>
            <span className="rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 px-2.5 py-0.5 text-[10px] font-bold text-cyan-800 dark:text-cyan-300">
              {incident.status}
            </span>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold font-mono text-slate-700 dark:text-slate-300">
              Priority: {incident.priorityScore || 82}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">
            {incident.type} · {incident.location}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tourist ID: <strong className="text-slate-800 dark:text-slate-200">{incident.touristId}</strong> · Triggered: {new Date(incident.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <RiskBadge score={incident.riskScore} band={incident.severity} />
      </div>

      {/* Recommended Responder Banner */}
      {bestResponder && (incident.status === "ACKNOWLEDGED" || incident.status === "VERIFIED" || incident.status === "SOS_CREATED") && (
        <div className="mt-4 rounded-2xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50/70 dark:bg-cyan-950/40 p-4">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-5 w-5 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-900 dark:text-cyan-300">
                AI Responder Assignment Optimization
              </p>
              <p className="mt-1 text-xs text-cyan-950 dark:text-cyan-200 leading-relaxed font-bold">
                {bestResponder.recommendationReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Step-by-Step Lifecycle Controls */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-slate-100 dark:border-slate-800 py-4">
        {(incident.status === "ACKNOWLEDGED" || incident.status === "VERIFIED") && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedResponderId}
              onChange={(e) => setSelectedResponderId(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
            >
              {responders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.eta} ({r.specialty})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onAssign(incident.id, selectedResponderId || "R01")}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-xs font-bold transition"
            >
              <UserRoundPlus className="h-4 w-4" />
              Assign Selected Responder
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleNextStep}
          className="inline-flex items-center gap-2 rounded-xl bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
        >
          {incident.status === "SOS_CREATED" || incident.status === "CREATED" ? (
            <>
              <CheckCheck className="h-4 w-4" /> Step 1: Acknowledge Incident
            </>
          ) : incident.status === "ACKNOWLEDGED" ? (
            <>
              <UserRoundPlus className="h-4 w-4" /> Step 2: Assign Unit R01
            </>
          ) : incident.status === "ASSIGNED" || incident.status === "RESPONDER_ASSIGNED" ? (
            <>
              <Navigation className="h-4 w-4" /> Step 3: Mark Unit En Route
            </>
          ) : incident.status === "RESPONDER_EN_ROUTE" ? (
            <>
              <RadioTower className="h-4 w-4" /> Step 4: Mark Unit On Scene
            </>
          ) : incident.status === "ON_SCENE" ? (
            <>
              <CircleCheck className="h-4 w-4" /> Step 5: Mark Incident Resolved
            </>
          ) : incident.status === "RESOLVED" ? (
            <>
              <FileCheck className="h-4 w-4" /> Step 6: Record Cryptographic Audit Hash
            </>
          ) : (
            "Lifecycle Complete"
          )}
        </button>
      </div>

      {/* Visual Timeline rendering */}
      <div className="mt-5">
        <IncidentTimeline currentStatus={incident.status} auditTrail={incident.audit} />
      </div>
    </article>
  );
}
