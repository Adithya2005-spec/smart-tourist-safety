import { DemoSafetyMap, ZoneRiskList } from "@/components/DemoSafetyMap";
import { RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { AlertTriangle, ArrowRight, CheckCircle2, Globe2, Navigation, Route, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function TouristMap() {
  const { activeGeofences, risk, simulateHighRisk, zones, activeState } = useSafety();
  const [route, setRoute] = useState<"safest" | "fastest">("safest");
  const selectedZone = activeGeofences[0]?.zone;

  return (
    <SafetyShell eyebrow="Traveller workspace" title="Safety map & geofences">
      <div className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
        <div className="space-y-5">
          {selectedZone && (
            <SafetyNotice tone="rose">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-bold text-rose-950 dark:text-rose-200">
                    Local geofence alert: {selectedZone.name} ({activeState.name})
                  </p>
                  <p className="mt-1 text-xs text-rose-900 dark:text-rose-300">
                    You have entered a <strong>{selectedZone.band.toLowerCase()}</strong> risk zone. Distance, radius, and risk factors are calculated on this device using the Haversine formula.
                  </p>
                </div>
              </div>
            </SafetyNotice>
          )}

          <DemoSafetyMap
            onSelectZone={(zoneId) => {
              if (zoneId.includes("Z1") || zoneId === "ZONE-01") simulateHighRisk();
            }}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <RouteOption
              active={route === "safest"}
              onClick={() => setRoute("safest")}
              icon={ShieldCheck}
              title="Recommended safer route"
              distance="2.6 km · 34 min"
              risk="SAFE"
              description={`Bypasses active high-density zones in ${activeState.name}; monitored by Tourist Police.`}
            />
            <RouteOption
              active={route === "fastest"}
              onClick={() => setRoute("fastest")}
              icon={Navigation}
              title="Fastest transit route"
              distance="2.1 km · 27 min"
              risk="DANGER"
              description="Direct shortest path crosses elevated-activity transit zone."
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                  Area Profile · {activeState.name}
                </p>
                <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Contextual Risk</h2>
              </div>
              <RiskBadge score={risk.score} band={risk.band} />
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-600 dark:text-slate-300">
              Risk combines zonal history, recent incident telemetry, tourist density, time of day, and weather signals for <strong>{activeState.name}</strong>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 px-3.5 py-2 text-xs font-bold text-white transition"
                onClick={simulateHighRisk}
              >
                Simulate high-risk alarm <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/pan-india"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                <Globe2 className="h-3.5 w-3.5" />
                Change State
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
              Zone Monitor ({activeState.name})
            </p>
            <div className="mt-4">
              <ZoneRiskList />
            </div>
          </div>

          <SafetyNotice tone="slate">
            <p className="text-xs">
              <strong>Offline Resilience:</strong> This map and its Haversine mathematical geofence remain fully functional when GPS satellite lock or offline cached map assets are used.
            </p>
          </SafetyNotice>
        </aside>
      </div>
    </SafetyShell>
  );
}

function RouteOption({
  active,
  onClick,
  icon: Icon,
  title,
  distance,
  risk,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  distance: string;
  risk: "SAFE" | "DANGER";
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition-all ${
        active
          ? "border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/30 shadow-sm ring-1 ring-cyan-500/30"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${
            active
              ? "bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <RiskBadge band={risk} compact />
      </div>
      <p className="mt-5 text-sm font-bold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-400">{distance}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
      {active && (
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-800 dark:text-cyan-300">
          <CheckCircle2 className="h-4 w-4" />
          Selected for Navigation
        </div>
      )}
    </button>
  );
}
