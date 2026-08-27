import { DemoSafetyMap, ZoneRiskList } from "@/components/DemoSafetyMap";
import { RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { calculateRouteOptions, RouteOption } from "@/lib/route-engine";
import { AlertTriangle, ArrowRight, CheckCircle2, Globe2, Navigation, Route, ShieldCheck, Info, Cpu, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function TouristMap() {
  const { activeGeofences, risk, simulateHighRisk, location, activeState, riskPropagation, routeOperation } = useSafety();

  const executionDecision = routeOperation("Local Risk Calculation");

  const routeOptions = calculateRouteOptions({
    originName: "Current Position",
    origin: location,
    destinationName: `${activeState.capital} Tourist Plaza`,
    destination: { lat: location.lat + 0.015, lng: location.lng + 0.015 },
    stateId: activeState.id,
  });

  const [selectedRouteId, setSelectedRouteId] = useState<string>("ROUTE-B");
  const selectedZone = activeGeofences[0]?.zone;

  const activeRoute = routeOptions.find((r) => r.id === selectedRouteId) || routeOptions[0];

  return (
    <SafetyShell eyebrow="Traveller workspace" title="Safety map & risk propagation">
      <div className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
        <div className="space-y-5">
          {/* Edge/Cloud Execution Router Badge */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  ADAPTIVE EXECUTION ROUTER
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Engine Execution: <strong className="text-cyan-600 dark:text-cyan-400">{executionDecision.location}</strong> ({executionDecision.latencyMs}ms)
                </p>
              </div>
            </div>
            <span className="rounded-full bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 px-3 py-1 text-[11px] font-bold text-cyan-800 dark:text-cyan-300">
              {executionDecision.privacyGuarantee}
            </span>
          </div>

          {selectedZone && (
            <SafetyNotice tone="rose">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-bold text-rose-950 dark:text-rose-200">
                    Local geofence alert: {selectedZone.name} ({activeState.name})
                  </p>
                  <p className="mt-1 text-xs text-rose-900 dark:text-rose-300">
                    You have entered a <strong>{selectedZone.severity || selectedZone.band}</strong> risk zone. Score: <strong>{selectedZone.score}/100</strong>.
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

          {/* Geographic Risk Propagation Explanations */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                GEOGRAPHIC RISK PROPAGATION MODEL [MODEL-DERIVED]
              </span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>

            <div className="space-y-2">
              {riskPropagation.map((prop) => (
                <div key={prop.zoneId} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{prop.zoneName}</p>
                    <span className="text-xs font-black text-rose-600">
                      Score {prop.propagatedScore} (+{prop.delta} pts)
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{prop.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rationale Explanation Box */}
          <div className="rounded-2xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50/70 dark:bg-cyan-950/40 p-4">
            <div className="flex items-start gap-2.5">
              <Info className="h-5 w-5 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-900 dark:text-cyan-300">
                  Route Recommendation Engine Rationale
                </p>
                <p className="mt-1 text-xs text-cyan-950 dark:text-cyan-200 leading-relaxed font-semibold">
                  "{activeRoute.rationale}"
                </p>
                <p className="mt-1 text-[10px] text-cyan-700 dark:text-cyan-400 font-mono">
                  Cost Formula: Cost = (0.2 × Distance) + (0.3 × ETA) + (0.5 × RiskScore) = {activeRoute.cost.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Multi-Route Options Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {routeOptions.map((opt) => (
              <RouteOptionCard
                key={opt.id}
                option={opt}
                active={opt.id === selectedRouteId}
                onSelect={() => setSelectedRouteId(opt.id)}
              />
            ))}
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
              <RiskBadge score={risk.score} band={risk.severity || risk.band} />
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
              Dynamic Risk Zones ({activeState.name})
            </p>
            <div className="mt-4">
              <ZoneRiskList />
            </div>
          </div>
        </aside>
      </div>
    </SafetyShell>
  );
}

function RouteOptionCard({
  option,
  active,
  onSelect,
}: {
  option: RouteOption;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = option.recommendationTag === "RECOMMENDED_SAFER" ? ShieldCheck : Navigation;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border p-4 text-left transition-all flex flex-col justify-between ${
        active
          ? "border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 shadow-sm ring-2 ring-cyan-500/40"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div
            className={`grid h-8 w-8 place-items-center rounded-xl ${
              active
                ? "bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <RiskBadge band={option.severity} compact />
        </div>

        <p className="mt-3 text-xs font-black text-slate-900 dark:text-white leading-tight">{option.name}</p>
        <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {option.distanceKm} km · {option.etaMinutes} min
        </p>

        <span
          className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
            option.recommendationTag === "RECOMMENDED_SAFER"
              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
              : option.recommendationTag === "NOT_RECOMMENDED"
              ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          {option.recommendationLabel}
        </span>
      </div>

      {active && (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-cyan-800 dark:text-cyan-300 border-t border-cyan-200 dark:border-cyan-900 pt-2">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Selected Option
        </div>
      )}
    </button>
  );
}
