import React, { useState } from "react";
import { useSafety } from "@/contexts/SafetyContext";
import { Play, SkipForward, RotateCcw, CheckCircle2, ShieldAlert, Sparkles, ChevronRight, SlidersHorizontal, X, ChevronUp, AlertTriangle, Cpu } from "lucide-react";
import { useLocation } from "wouter";

const DEMO_SCENARIO_1 = [
  { step: 1, title: "1. Tourist Starts Journey", desc: "Tourist Aaron initiates journey in Bengaluru District (Risk: LOW)", role: "TOURIST", route: "/tourist" },
  { step: 2, title: "2. Risk is LOW", desc: "Current baseline risk score: 28 (LOW)", role: "TOURIST", route: "/tourist" },
  { step: 3, title: "3. Enter Medium-Risk Zone", desc: "Tourist approaches Church Street Junction area", role: "TOURIST", route: "/tourist/map" },
  { step: 4, title: "4. Risk Increases", desc: "Contextual risk score rises to 48 (MEDIUM)", role: "TOURIST", route: "/tourist" },
  { step: 5, title: "5. Explainable Timeline Shows Why", desc: "Explainable factors breakdown shows zonal density + temporal risk", role: "TOURIST", route: "/tourist" },
  { step: 6, title: "6. Forecast Predicts Increase", desc: "15m, 30m, and 60m future risk forecasts project rising trend (76)", role: "TOURIST", route: "/tourist" },
  { step: 7, title: "7. Safer Route Recommended", desc: "Pre-SOS warning recommends Route B (Monitored Perimeter Route)", role: "TOURIST", route: "/tourist/map" },
  { step: 8, title: "8. Connectivity Degrades", desc: "Cellular signal drops to -112 dBm; system shifts to Degraded Mode", role: "TOURIST", route: "/tourist" },
  { step: 9, title: "9. Edge Safety Mode", desc: "Edge engine handles local geofences & offline risk scoring autonomously", role: "TOURIST", route: "/tourist/map" },
  { step: 10, title: "10. Cloud Outage Simulated", desc: "Simulated cloud outage; local safety loop remains 100% active", role: "TOURIST", route: "/tourist" },
  { step: 11, title: "11. Tourist Remains Operational", desc: "Map navigation and local alerts function without cloud link", role: "TOURIST", route: "/tourist/map" },
  { step: 12, title: "12. Tourist Triggers SOS", desc: "Tourist initiates Emergency SOS alert", role: "TOURIST", route: "/tourist/sos" },
  { step: 13, title: "13. SOS Stored Locally", desc: "SOS payload buffered safely in IndexedDB Store-and-Forward queue", role: "TOURIST", route: "/tourist/sos" },
  { step: 14, title: "14. Connectivity Restored", desc: "Cloud link re-established; queue flush triggered", role: "TOURIST", route: "/tourist/sos" },
  { step: 15, title: "15. Event Synchronizes", desc: "Queued SOS event pushes to cloud event bus", role: "TOURIST", route: "/tourist/sos" },
  { step: 16, title: "16. Authority Receives SOS", desc: "Alert arrives in Authority Command Priority Queue (Score: 82)", role: "AUTHORITY", route: "/authority/incidents" },
  { step: 17, title: "17. AI Recommends Action", desc: "Next Best Action Engine recommends Officer Rajesh (84% confidence)", role: "AUTHORITY", route: "/authority" },
  { step: 18, title: "18. Human Authority Approves", desc: "Operator reviews & approves recommendation (HITL Audit Logged)", role: "AUTHORITY", route: "/authority" },
  { step: 19, title: "19. Responder Assigned", desc: "Officer Rajesh unit assigned to emergency incident", role: "AUTHORITY", route: "/authority/incidents" },
  { step: 20, title: "20. Incident Timeline Updates", desc: "Status updates: EN ROUTE -> ON SCENE", role: "AUTHORITY", route: "/authority/incidents" },
  { step: 21, title: "21. Evidence Graph Updates", desc: "Incident evidence node chain links Tourist to Responder", role: "AUTHORITY", route: "/authority" },
  { step: 22, title: "22. Audit Chain Updates", desc: "SHA-256 hash commitment generated for canonical ledger", role: "AUTHORITY", route: "/authority/audit" },
  { step: 23, title: "23. Incident Resolved", desc: "Rescue operation completed; status set to RESOLVED", role: "AUTHORITY", route: "/authority/incidents" },
  { step: 24, title: "24. Incident Replay Available", desc: "Interactive incident replay player enabled for audit", role: "AUTHORITY", route: "/authority" },
  { step: 25, title: "25. Forensics Generated", desc: "Structured Post-Incident Forensics report generated", role: "AUTHORITY", route: "/authority" },
  { step: 26, title: "26. Analytics Update", desc: "Zonal response metrics and pattern discovery update", role: "AUTHORITY", route: "/authority/analytics" },
  { step: 27, title: "27. System Returns to Normal", desc: "Baseline safe status restored across all operational views", role: "AUTHORITY", route: "/authority" },
];

const DEMO_SCENARIO_2_FAILURE = [
  { step: 1, title: "1. Cloud Outage Triggered", desc: "Simulate central cloud infrastructure failure", role: "AUTHORITY", route: "/authority" },
  { step: 2, title: "2. Poor Connectivity", desc: "Network signal degrades to -118 dBm", role: "TOURIST", route: "/tourist" },
  { step: 3, title: "3. Primary Responder Unavailable", desc: "Field responder unit drops out of coverage", role: "AUTHORITY", route: "/authority" },
  { step: 4, title: "4. EDGE MODE ACTIVATED", desc: "System switches to Level 3 Edge-Only Autonomous Mode", role: "TOURIST", route: "/tourist/map" },
  { step: 5, title: "5. LOCAL SAFETY FUNCTIONS", desc: "Haversine local geofences & cached advisory operate offline", role: "TOURIST", route: "/tourist/map" },
  { step: 6, title: "6. LOCAL EVENT QUEUE", desc: "IndexedDB Store-and-Forward queue buffers event stream", role: "TOURIST", route: "/tourist/sos" },
  { step: 7, title: "7. SOS CREATED OFFLINE", desc: "Tourist triggers Emergency SOS alert while disconnected", role: "TOURIST", route: "/tourist/sos" },
  { step: 8, title: "8. CLOUD RESTORED", desc: "Cloud & network connectivity restored", role: "AUTHORITY", route: "/authority" },
  { step: 9, title: "9. EVENT SYNCHRONIZED", desc: "Background sync flushes queued events to cloud event bus", role: "AUTHORITY", route: "/authority/incidents" },
  { step: 10, title: "10. AUTHORITY DISPATCH", desc: "Authority receives alert & dispatches secondary reserve squad", role: "AUTHORITY", route: "/authority/incidents" },
];

export function DemoSimulatorBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<1 | 2>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { setRole, simulateHighRisk, createIncident, transitionIncident, assignResponder, recordAudit, syncQueue, incidents, toggleChaosState, setOnline } = useSafety();
  const [, setLocation] = useLocation();

  const steps = activeScenario === 1 ? DEMO_SCENARIO_1 : DEMO_SCENARIO_2_FAILURE;
  const activeStep = steps[currentStepIndex];

  const handleExecuteStep = async (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
    const step = steps[stepIndex];

    if (step.role) setRole(step.role as any);
    if (step.route) setLocation(step.route);

    if (activeScenario === 1) {
      if (stepIndex === 2 || stepIndex === 3) simulateHighRisk();
      else if (stepIndex === 7 || stepIndex === 8) setOnline(false);
      else if (stepIndex === 9) toggleChaosState("cloudOutage");
      else if (stepIndex === 11) createIncident("Medical", "27-Step Complete Scenario SOS");
      else if (stepIndex === 13) {
        setOnline(true);
        toggleChaosState("cloudOutage");
      } else if (stepIndex === 14) syncQueue();
      else if (stepIndex === 15) {
        const inc = incidents[0];
        if (inc) transitionIncident(inc.id, "ACKNOWLEDGED", "AUTH-OPERATOR-01");
      } else if (stepIndex === 18) {
        const inc = incidents[0];
        if (inc) assignResponder(inc.id, "R01");
      } else if (stepIndex === 19) {
        const inc = incidents[0];
        if (inc) transitionIncident(inc.id, "RESPONDER_EN_ROUTE", "R01");
      } else if (stepIndex === 22) {
        const inc = incidents[0];
        if (inc) transitionIncident(inc.id, "RESOLVED", "R01");
      } else if (stepIndex === 23) {
        const inc = incidents[0];
        if (inc) recordAudit(inc.id);
      }
    } else {
      if (stepIndex === 0) toggleChaosState("cloudOutage");
      else if (stepIndex === 1) setOnline(false);
      else if (stepIndex === 2) toggleChaosState("responderUnavailable");
      else if (stepIndex === 6) createIncident("Medical", "Failure Recovery Test SOS");
      else if (stepIndex === 7) {
        setOnline(true);
        toggleChaosState("cloudOutage");
        toggleChaosState("responderUnavailable");
      } else if (stepIndex === 8) syncQueue();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-cyan-500/40 bg-[#082235] text-white px-4 py-2.5 text-xs font-bold shadow-2xl transition hover:bg-[#0c2f49] hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <div className="grid h-6 w-6 place-items-center rounded-full bg-cyan-500 text-slate-950">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span>Demo Scenarios ({activeScenario === 1 ? "27-Step" : "Failure Test"})</span>
          <span className="rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 text-[10px] font-black">
            {activeStep.step}/{steps.length}
          </span>
          <ChevronUp className="h-4 w-4 text-cyan-400 transition group-hover:-translate-y-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[620px] z-50 rounded-3xl border border-cyan-900 bg-[#082235] text-white shadow-2xl backdrop-blur-xl p-4 transition-all">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-xl bg-cyan-500 text-slate-950 font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                {activeScenario === 1 ? "SCENARIO 1: COMPLETE 27-STEP STORY" : "SCENARIO 2: SYSTEM FAILURE & RECOVERY"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveScenario(activeScenario === 1 ? 2 : 1);
                  setCurrentStepIndex(0);
                }}
                className="text-[9px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 text-cyan-300 px-2 py-0.5 rounded border border-white/20"
              >
                Switch to Scenario {activeScenario === 1 ? "2 (Failure)" : "1 (27-Step)"}
              </button>
            </div>
            <h3 className="text-xs font-black text-white">{activeStep.title}</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          title="Minimize Demo Panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-300 leading-relaxed">{activeStep.desc}</p>

      {/* Stepper Dots */}
      <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto py-1">
        {steps.map((s, idx) => (
          <button
            key={s.step}
            type="button"
            onClick={() => handleExecuteStep(idx)}
            title={`${s.step}. ${s.title}`}
            className={`h-2 rounded-full transition-all ${
              idx === currentStepIndex
                ? "w-6 bg-cyan-400 ring-2 ring-cyan-300"
                : idx < currentStepIndex
                ? "w-2.5 bg-emerald-400"
                : "w-1.5 bg-slate-700 hover:bg-slate-600"
            }`}
          />
        ))}
      </div>

      {/* Control Actions */}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => handleExecuteStep(0)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Scenario {activeScenario}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExecuteStep(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => handleExecuteStep((currentStepIndex + 1) % steps.length)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-1.5 text-xs font-black transition shadow-sm"
          >
            Next Step <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
