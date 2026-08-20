import { SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { Clock3, MapPin, MapPinned, RadioTower, ShieldCheck, StopCircle } from "lucide-react";
import { useState } from "react";

export default function TouristLocation() {
  const { contacts, sharingUntil, startSharing, stopSharing, locationName, activeState } = useSafety();
  const [contactId, setContactId] = useState(
    contacts.find((contact) => contact.primary)?.id ?? contacts[0]?.id ?? "",
  );
  const [minutes, setMinutes] = useState("30");
  const contact = contacts.find((item) => item.id === contactId);

  return (
    <SafetyShell eyebrow="Traveller workspace" title="Live location sharing">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm text-slate-900 dark:text-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                Consent-Controlled Telemetry
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                Share Your Live Location
              </h2>
              <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">
                Temporary encrypted location sharing for travel across {activeState.name}. Sharing automatically terminates after the specified duration.
              </p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
              <RadioTower className="h-6 w-6" />
            </div>
          </div>

          {sharingUntil ? (
            <div className="mt-7 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 p-5">
              <div className="flex items-center gap-3.5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                    Live Location Sharing is Active
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-800 dark:text-emerald-300">
                    Sharing with <strong>{contact?.name ?? "Selected Contact"}</strong> until{" "}
                    {new Date(sharingUntil).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={stopSharing}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-slate-700 transition"
              >
                <StopCircle className="h-4 w-4" />
                Stop Sharing Now
              </button>
            </div>
          ) : (
            <div className="mt-7 grid gap-4">
              <label className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                Choose Emergency Contact or Helpline
                <select
                  value={contactId}
                  onChange={(event) => setContactId(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-cyan-600/20"
                >
                  {contacts.map((item) => (
                    <option key={item.id} value={item.id} className="bg-white dark:bg-slate-800">
                      {item.name} ({item.relationship}) · {item.phone}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                Sharing Duration Limit
                <select
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-cyan-600/20"
                >
                  <option value="15" className="bg-white dark:bg-slate-800">15 minutes (Transit mode)</option>
                  <option value="30" className="bg-white dark:bg-slate-800">30 minutes (Default sightseeing)</option>
                  <option value="60" className="bg-white dark:bg-slate-800">60 minutes (Trek / Long journey)</option>
                  <option value="120" className="bg-white dark:bg-slate-800">120 minutes (Remote exploration)</option>
                </select>
              </label>

              <button
                type="button"
                disabled={!contactId}
                onClick={() => startSharing(Number(minutes))}
                className="mt-2 rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#103653] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-4 py-3.5 text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                Start Time-Limited Live Sharing
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-[#082235] p-6 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-300" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                {activeState.name} Territory
              </span>
            </div>
            <h3 className="text-xl font-bold">Active Local GPS Position</h3>
            <p className="font-mono text-sm text-cyan-200 bg-white/10 p-2.5 rounded-xl border border-white/10">
              {locationName}
            </p>
            <p className="text-xs leading-5 text-slate-300">
              Local GPS telemetry evaluates distance to {activeState.riskZones.length} geofence polygons in {activeState.name}.
            </p>
          </div>

          <SafetyNotice tone="slate">
            <div className="flex gap-3">
              <Clock3 className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
              <p className="text-xs">
                <strong>Zero Uncontrolled Tracking:</strong> Location sharing is explicit, strictly opt-in, and auto-expires to safeguard tourist privacy rights.
              </p>
            </div>
          </SafetyNotice>
        </aside>
      </div>
    </SafetyShell>
  );
}
