import { AuthorityAccessDenied, useAuthorityAccess } from "@/components/AuthorityAccess";
import { DemoSafetyMap } from "@/components/DemoSafetyMap";
import { RiskBadge, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock3,
  Globe2,
  MapPin,
  RadioTower,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";

export default function AuthorityCommand() {
  const allowed = useAuthorityAccess();
  const { incidents, zones, responders, activeState } = useSafety();

  if (!allowed) return <AuthorityAccessDenied />;

  const active = incidents.filter((incident) => incident.status !== "RESOLVED");
  const critical = active.filter((incident) => ["HIGH", "CRITICAL"].includes(incident.severity));
  const available = responders.filter((responder) => responder.availability === "AVAILABLE");

  return (
    <SafetyShell
      eyebrow="Authority command centre"
      title={`${activeState.name} Command & Dispatch Center`}
      actions={
        <Link
          href="/authority/incidents"
          className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
        >
          Incident Queue ({active.length})
        </Link>
      }
    >
      {/* Top Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={ShieldAlert} label="Active Incidents" value={active.length} detail={`${activeState.name} active queue`} tone="rose" />
        <Metric icon={AlertTriangle} label="Critical Alerts" value={critical.length} detail="High or critical severity" tone="amber" />
        <Metric icon={Activity} label="High-Risk Zones" value={zones.filter((zone) => zone.band === "DANGER").length} detail={`Evaluated in ${activeState.name}`} tone="cyan" />
        <Metric icon={UsersRound} label="Available Responders" value={available.length} detail={`${responders.length} total registered`} tone="green" />
      </div>

      {/* Main Operational Map & Live Incident Feed */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                  {activeState.name} Operational Map
                </p>
              </div>
              <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                Live Geofences & Responder Positions
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 px-3 py-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
              <i className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <DemoSafetyMap compact />
        </section>

        {/* Live Incident Feed */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-slate-900 dark:text-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                  Live Dispatch Feed
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Priority Queue</h2>
              </div>
              <Link href="/authority/incidents" className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline">
                View all ({active.length})
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {active.slice(0, 4).map((incident) => (
                <Link
                  key={incident.id}
                  href="/authority/incidents"
                  className="block rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 transition hover:border-cyan-400 hover:bg-cyan-50/30 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {incident.id} · {incident.type}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {incident.location} · {incident.touristId}
                      </p>
                    </div>
                    <RiskBadge band={incident.severity} compact />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <span className="text-[10px] font-bold tracking-[.1em] text-cyan-800 dark:text-cyan-300">
                      {incident.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(incident.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <Link
              href="/pan-india"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline"
            >
              <Globe2 className="h-3.5 w-3.5" />
              Pan-India Multi-State Command Center →
            </Link>
          </div>
        </section>
      </div>

      {/* Command Workflow & Integrity Principle */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm text-slate-900 dark:text-slate-100">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
            Official Response Protocol
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            {[
              { icon: ShieldAlert, label: "Capture", text: "SOS enters state queue" },
              { icon: AlertTriangle, label: "Verify", text: "Authority checks triage" },
              { icon: RadioTower, label: "Dispatch", text: "Unit 04 assigned" },
              { icon: Clock3, label: "Resolve", text: "SHA-256 audit anchor" },
            ].map((step, index) => (
              <div key={step.label} className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  {index + 1}. {step.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-[#082235] p-6 text-white shadow-md">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-300">
            Integrity Assurance
          </p>
          <h2 className="mt-1 text-lg font-bold">Resilient Pan-India Coordination</h2>
          <p className="mt-3 text-xs leading-6 text-slate-300">
            The incident and dispatch service operates independently from blockchain latency. Cryptographic audit hashing occurs at resolution to guarantee post-incident transparency without obstructing active life rescue.
          </p>
          <Link
            href="/authority/audit"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200"
          >
            Open Blockchain Audit Workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </SafetyShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  detail: string;
  tone: "rose" | "amber" | "cyan" | "green";
}) {
  const tones = {
    rose: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300",
    amber: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300",
    cyan: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300",
    green: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.13em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black tabular-nums text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
    </div>
  );
}
