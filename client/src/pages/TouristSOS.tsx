import { RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Globe2,
  MapPin,
  MapPinned,
  PhoneCall,
  Shield,
  ShieldAlert,
  Siren,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import type { IncidentType } from "@/lib/safety-engine";
import { Link } from "wouter";

const incidentTypes: IncidentType[] = ["Medical", "Harassment", "Lost", "Suspicious activity", "Other"];

export default function TouristSOS() {
  const { createIncident, online, risk, locationName, profile, activeState } = useSafety();
  const [type, setType] = useState<IncidentType>("Suspicious activity");
  const [notes, setNotes] = useState("");
  const [created, setCreated] = useState<string>();

  const submit = () => {
    const incident = createIncident(type, notes);
    setCreated(incident.id);
  };

  return (
    <SafetyShell eyebrow="Traveller workspace" title="SOS Emergency Command">
      {created ? (
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-6 sm:p-9 shadow-xl shadow-emerald-900/5 text-slate-900 dark:text-slate-100">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-400">
            {online ? "Incident Broadcasted to Command Centre" : "SOS Stored in Local Edge Queue"}
          </p>
          <h2 className="mt-1 text-3xl font-black text-slate-950 dark:text-white">{created}</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
            {online
              ? `Your emergency alert is active in the ${activeState.name} command centre with responder dispatch and hash audit enabled.`
              : "Your safety request is stored encrypted in your local edge queue and will automatically dispatch as soon as connectivity resumes."}
          </p>

          <div className="mt-7 grid gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 sm:grid-cols-3 border border-slate-100 dark:border-slate-800">
            <Data label="Tourist ID" value={profile.touristId} />
            <Data label="Contextual Risk" value={`${risk.score}/100 · ${risk.band}`} />
            <Data label="Active Territory" value={`${activeState.name}`} />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/tourist/incidents"
              className="rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#103653] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-5 py-3 text-xs font-bold transition shadow-sm"
            >
              Track Incident Status & Dispatch
            </Link>
            <Link
              href="/tourist"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-5">
          {/* Quick Helplines Header */}
          <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                  Direct Police Lines
                </span>
                <span className="text-xs font-bold text-rose-950 dark:text-rose-200">
                  {activeState.name} Region
                </span>
              </div>
              <p className="text-xs text-rose-900 dark:text-rose-300 mt-1">
                Central SOS: <strong>{activeState.emergency.police}</strong> · {activeState.name} Tourist Police: <strong>{activeState.emergency.touristPolice}</strong> · Women Helpline: <strong>{activeState.emergency.womenHelpline}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeState.emergency.police.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition"
              >
                <PhoneCall className="h-4 w-4" />
                Call SOS ({activeState.emergency.police})
              </a>
              <a
                href={`tel:${activeState.emergency.touristPolice.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-rose-800 dark:text-rose-300 hover:bg-rose-50"
              >
                <Shield className="h-4 w-4" />
                Tourist Police
              </a>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            {/* SOS Dispatch Form */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-rose-600 dark:text-rose-400">
                    Emergency reporting
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                    Create an SOS Alert
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    Dispatches your exact GPS coordinates, contextual risk score, and profile to the {activeState.name} responder unit.
                  </p>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <Siren className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400 mb-2.5">
                  Select Incident Category
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {incidentTypes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={`rounded-xl border p-3 text-left text-xs font-bold transition-all ${
                        item === type
                          ? "border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20"
                          : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-5 block text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                Optional Situation Note
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  placeholder="Describe your situation or specific landmark (e.g. Near metro station, lost trail, need medical assistance)..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-3 text-xs font-normal text-slate-900 dark:text-slate-100 tracking-normal outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                />
              </label>

              <button
                type="button"
                onClick={submit}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-rose-600/25 transition active:scale-[.98]"
              >
                <ShieldAlert className="h-5 w-5" />
                {online ? `Broadcast Live SOS to ${activeState.name} Police` : "Save SOS to Offline Edge Queue"}
              </button>
            </section>

            {/* Sidebar info */}
            <aside className="space-y-4">
              <SafetyNotice tone={online ? "cyan" : "amber"}>
                <div className="flex gap-3">
                  {online ? (
                    <Clock3 className="h-5 w-5 shrink-0 text-cyan-700 dark:text-cyan-400" />
                  ) : (
                    <WifiOff className="h-5 w-5 shrink-0 text-amber-600" />
                  )}
                  <div>
                    <p className="font-bold">
                      {online ? "Connected Command Centre Response" : "Offline Edge Safety Mode"}
                    </p>
                    <p className="mt-1 text-xs leading-5">
                      {online
                        ? `Live dispatch coordinates with ${activeState.name} Tourist Security Team and audit trails.`
                        : "Cached risk zones and local SOS queue active. Synchronizes automatically when edge connection restores."}
                    </p>
                  </div>
                </div>
              </SafetyNotice>

              {/* Safety Payload */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                  SOS Broadcast Payload
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{activeState.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">State / Territory</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPinned className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{locationName}</p>
                      <p className="text-slate-500 dark:text-slate-400">Edge GPS Coordinate</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Contextual Risk</span>
                    <RiskBadge score={risk.score} band={risk.band} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-950 dark:text-amber-200">24x7 Official Police Desk</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-amber-900 dark:text-amber-300">
                      In severe life-threatening emergencies, dial <strong>112</strong> immediately on your mobile phone.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </SafetyShell>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[.13em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
