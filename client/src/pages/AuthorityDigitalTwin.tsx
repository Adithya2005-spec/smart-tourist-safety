import React, { useState } from "react";
import { AuthorityAccessDenied, useAuthorityAccess } from "@/components/AuthorityAccess";
import { DigitalTwinMap } from "@/components/DigitalTwinMap";
import { HitlDecisionModal } from "@/components/HitlDecisionModal";
import { SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import type { WhatIfScenarioParameters } from "@/lib/what-if-simulator";
import type { HitlRecommendation } from "@/lib/hitl-engine";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  Compass,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Save,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Zap,
  Cpu,
  UserCheck,
  TrendingUp,
  RadioTower,
  Wifi,
} from "lucide-react";

export default function AuthorityDigitalTwin() {
  const allowed = useAuthorityAccess();
  const {
    incidents,
    zones,
    responders,
    activeState,
    digitalTwin,
    whatIfParams,
    updateWhatIfParams,
    simulatedPrediction,
    scenarioDeltas,
    resourceAllocations,
    cascadingAnalysis,
    prioritizedIncidents,
    scenarioSnapshots,
    saveSnapshot,
    loadSnapshot,
    nextBestActions,
    hitlRecommendations,
    processHitlAction,
    confidenceAI,
  } = useSafety();

  const [activeSubTab, setActiveSubTab] = useState<
    "LIVE_STATE" | "WHAT_IF" | "RESOURCE_OPT" | "SYSTEM_CRASH" | "COMPARISON" | "PRIORITY" | "NEXT_ACTION"
  >("WHAT_IF");

  const [activeHitlModalRec, setActiveHitlModalRec] = useState<HitlRecommendation | null>(null);
  const [newSnapshotName, setNewSnapshotName] = useState("");

  if (!allowed) return <AuthorityAccessDenied />;

  return (
    <SafetyShell
      eyebrow="Authority command centre"
      title={`${activeState.name} Safety Digital Twin & What-If Simulator`}
    >
      {/* HITL Decision Review Modal */}
      {activeHitlModalRec && (
        <HitlDecisionModal
          recommendation={activeHitlModalRec}
          onApprove={(notes) => {
            processHitlAction(activeHitlModalRec, "APPROVED", "AUTH-OPERATOR-01", notes);
            setActiveHitlModalRec(null);
          }}
          onReject={(notes) => {
            processHitlAction(activeHitlModalRec, "REJECTED", "AUTH-OPERATOR-01", notes);
            setActiveHitlModalRec(null);
          }}
          onClose={() => setActiveHitlModalRec(null)}
        />
      )}

      {/* Sub-navigation Tabs Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <NavTab active={activeSubTab === "LIVE_STATE"} onClick={() => setActiveSubTab("LIVE_STATE")} label="1. Live State Twin" />
        <NavTab active={activeSubTab === "WHAT_IF"} onClick={() => setActiveSubTab("WHAT_IF")} label="2. What-If Simulator" />
        <NavTab active={activeSubTab === "RESOURCE_OPT"} onClick={() => setActiveSubTab("RESOURCE_OPT")} label="3. Resource Optimizer" />
        <NavTab active={activeSubTab === "SYSTEM_CRASH"} onClick={() => setActiveSubTab("SYSTEM_CRASH")} label="4. System Crash Data Flow" />
        <NavTab active={activeSubTab === "COMPARISON"} onClick={() => setActiveSubTab("COMPARISON")} label="5. Scenario Comparison Δ" />
        <NavTab active={activeSubTab === "PRIORITY"} onClick={() => setActiveSubTab("PRIORITY")} label="6. Incident Priority (P1-P4)" />
        <NavTab active={activeSubTab === "NEXT_ACTION"} onClick={() => setActiveSubTab("NEXT_ACTION")} label="7. Next Best Action & HITL" />
      </div>

      {/* TAB 1: LIVE STATE */}
      {activeSubTab === "LIVE_STATE" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <StatCard label="Active Tourists" value={digitalTwin.touristCount} detail="Live GPS feeds" />
            <StatCard label="Active Incidents" value={digitalTwin.activeIncidents} detail="Queue total" tone="rose" />
            <StatCard label="Active Responders" value={digitalTwin.activeResponders} detail="Field units" tone="emerald" />
            <StatCard label="Zonal Resilience" value={`${digitalTwin.overallResilienceScore}/100`} detail="Infrastructure score" tone="cyan" />
          </div>
          <DigitalTwinMap />
        </div>
      )}

      {/* TAB 2: WHAT-IF SIMULATOR */}
      {activeSubTab === "WHAT_IF" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-900 bg-[#082235] p-6 text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500 text-slate-950 font-bold">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                    ISOLATED SCENARIO PARAMETERS [SIMULATION]
                  </span>
                  <h3 className="text-base font-black text-white">What-If Infrastructure & Load Controls</h3>
                </div>
              </div>
              <span className="rounded-full bg-cyan-950 border border-cyan-400 px-3 py-1 text-xs font-bold text-cyan-300">
                PROD STATE ISOLATED
              </span>
            </div>

            {/* Slider / Select Controls Grid */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs">
              <ControlGroup
                label="Tourist Density"
                value={whatIfParams.density}
                options={["LOW", "MEDIUM", "HIGH"]}
                onChange={(val) => updateWhatIfParams({ density: val as any })}
              />
              <ControlGroup
                label="Base Risk Level"
                value={whatIfParams.risk}
                options={["LOW", "MEDIUM", "HIGH"]}
                onChange={(val) => updateWhatIfParams({ risk: val as any })}
              />
              <ControlGroup
                label="Connectivity State"
                value={whatIfParams.connectivity}
                options={["FULL", "DEGRADED", "OFFLINE"]}
                onChange={(val) => updateWhatIfParams({ connectivity: val as any })}
              />
              <ControlGroup
                label="Responder Availability"
                value={whatIfParams.responderAvailability}
                options={["100%", "75%", "50%", "25%"]}
                onChange={(val) => updateWhatIfParams({ responderAvailability: val as any })}
              />
              <ControlGroup
                label="Road Corridor State"
                value={whatIfParams.roadAvailability}
                options={["NORMAL", "PARTIAL", "BLOCKED"]}
                onChange={(val) => updateWhatIfParams({ roadAvailability: val as any })}
              />
              <ControlGroup
                label="Incident Queue Load"
                value={whatIfParams.incidentLoad}
                options={["NORMAL", "ELEVATED", "CRITICAL"]}
                onChange={(val) => updateWhatIfParams({ incidentLoad: val as any })}
              />
              <ControlGroup
                label="Weather & Environment"
                value={whatIfParams.environment}
                options={["NORMAL", "ADVERSE"]}
                onChange={(val) => updateWhatIfParams({ environment: val as any })}
              />
            </div>

            {/* Save Snapshot Controls */}
            <div className="flex items-center gap-2 border-t border-white/10 pt-4">
              <input
                type="text"
                value={newSnapshotName}
                onChange={(e) => setNewSnapshotName(e.target.value)}
                placeholder="Enter scenario name to save snapshot..."
                className="rounded-xl bg-white/10 px-3 py-1.5 text-xs text-white outline-none border border-white/10 focus:border-cyan-400 w-72"
              />
              <button
                type="button"
                onClick={() => {
                  if (newSnapshotName.trim()) {
                    saveSnapshot(newSnapshotName);
                    setNewSnapshotName("");
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 text-xs font-black transition"
              >
                <Save className="h-3.5 w-3.5" /> Save Scenario Snapshot
              </button>
            </div>
          </div>

          {/* Saved Snapshots Drawer */}
          {scenarioSnapshots.length > 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Saved Scenario Snapshots ({scenarioSnapshots.length})
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {scenarioSnapshots.map((snap) => (
                  <div key={snap.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{snap.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{snap.modelVersion}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Simulated Risk: <strong className="text-rose-600">{snap.prediction.simulatedRiskScore}/100</strong> · ETA: <strong className="text-cyan-600">{snap.prediction.simulatedAverageEtaMinutes}m</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => loadSnapshot(snap)}
                      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition"
                    >
                      Load Parameters
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DigitalTwinMap />
        </div>
      )}

      {/* TAB 3: RESOURCE OPTIMIZER */}
      {activeSubTab === "RESOURCE_OPT" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  OPTIMIZED RESPONDER ALLOCATION [ESTIMATED / SIMULATED]
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Resource Allocation & Response Time Predictions</h3>
              </div>
              <Compass className="h-5 w-5 text-cyan-600" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {resourceAllocations.map((alloc) => (
                <div key={alloc.responderId} className="rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 p-4 border border-cyan-200 dark:border-cyan-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-950 dark:text-cyan-200">{alloc.responderName} ({alloc.responderId})</span>
                    <span className="rounded-full bg-cyan-500 text-slate-950 px-2.5 py-0.5 text-[10px] font-black">
                      ETA: {alloc.estimatedEtaMinutes} mins
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Reallocate: {alloc.currentZone} → <span className="text-cyan-600 dark:text-cyan-400 font-black">{alloc.recommendedZone}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{alloc.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM CRASH DATA FLOW */}
      {activeSubTab === "SYSTEM_CRASH" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#082235] p-6 text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  SYSTEM CRASH & RESILIENCE FALLBACK DATA FLOW [SIMULATION]
                </span>
                <h2 className="text-xl font-black">{cascadingAnalysis.title}</h2>
              </div>
            </div>

            {/* Embedded Explanation of What Happens to Tourist Data */}
            <div className="rounded-2xl bg-cyan-950/80 p-4 border border-cyan-700/60 space-y-2">
              <h4 className="text-xs font-black uppercase text-cyan-300">What Happens to Tourist Data During a System Crash?</h4>
              <p className="text-xs text-slate-200 leading-relaxed">{cascadingAnalysis.touristDataSafetyDescription}</p>
            </div>

            {/* Dependency Chain Steps */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Cascading Dependency Chain Execution</h4>
              {cascadingAnalysis.dependencyChain.map((step) => (
                <div key={step.stepIndex} className="rounded-2xl bg-white/5 p-4 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-rose-400">Step {step.stepIndex}: {step.failureComponent}</span>
                    <span className="font-mono text-cyan-300">{step.dataSafetyStatus}</span>
                  </div>
                  <p className="text-xs text-slate-300"><strong>Effect:</strong> {step.resultingEffect}</p>
                  <p className="text-xs text-emerald-400"><strong>Mitigation:</strong> {step.mitigationProtocol}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SCENARIO COMPARISON */}
      {activeSubTab === "COMPARISON" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  SCENARIO COMPARISON DELTA [CURRENT vs SIMULATED]
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Metric Delta Evaluation</h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {scenarioDeltas.map((delta, idx) => (
                <div key={idx} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{delta.metricName}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                        delta.isRiskIncrease
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                      }`}
                    >
                      {delta.deltaText}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-black text-slate-900 dark:text-white pt-1">
                    <span>Current: {delta.currentValue}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span>Simulated: {delta.simulatedValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INCIDENT PRIORITY */}
      {activeSubTab === "PRIORITY" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  INCIDENT PRIORITIZATION ENGINE [MODEL-DERIVED]
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">P1-P4 Priority Ranking & Rationale</h3>
              </div>
            </div>

            <div className="space-y-3">
              {prioritizedIncidents.map((pInc) => {
                const priorityBadge =
                  pInc.priorityTier === "P1 CRITICAL"
                    ? "bg-rose-600 text-white"
                    : pInc.priorityTier === "P2 HIGH"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-cyan-500 text-slate-950";

                return (
                  <div key={pInc.incidentId} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-0.5 text-xs font-black ${priorityBadge}`}>
                          {pInc.priorityTier}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">{pInc.incidentId} ({pInc.type})</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{pInc.location}</span>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Why this priority?</p>
                      <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 mt-1 space-y-0.5">
                        {pInc.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: NEXT ACTION & HITL */}
      {activeSubTab === "NEXT_ACTION" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-900 bg-[#082235] p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  NEXT BEST ACTION ENGINE [MODEL-DERIVED + HITL APPROVAL]
                </span>
                <h3 className="text-sm font-black text-white">Authority Approval Workflow</h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {nextBestActions.map((nba) => {
                const hitlState = hitlRecommendations.find((h) => h.recommendedAction.includes(nba.targetUnitId)) || hitlRecommendations[0];

                return (
                  <div key={nba.rank} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                        RANK #{nba.rank} · IMPACT: {nba.expectedImpact}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{nba.confidencePercentage}% Confidence</span>
                    </div>
                    <p className="text-sm font-black text-white">{nba.actionTitle}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{nba.reason}</p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <span className="text-[10px] font-mono text-slate-400">
                        Status: <strong className="text-cyan-300">{hitlState.status}</strong>
                      </span>
                      {hitlState.status === "PENDING" ? (
                        <button
                          type="button"
                          onClick={() => setActiveHitlModalRec(hitlState)}
                          className="inline-flex items-center gap-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 text-xs font-black transition"
                        >
                          <UserCheck className="h-3.5 w-3.5" /> Review & Approve
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Decision Logged
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </SafetyShell>
  );
}

function NavTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
        active
          ? "bg-[#082235] text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm"
          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value, detail, tone = "cyan" }: { label: string; value: string | number; detail: string; tone?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
    </div>
  );
}

function ControlGroup({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] uppercase font-bold text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white/10 p-2 text-xs font-bold text-white outline-none border border-white/10 focus:border-cyan-400"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#082235] text-white">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
