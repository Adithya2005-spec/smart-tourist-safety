import { AuthorityAccessDenied, useAuthorityAccess } from "@/components/AuthorityAccess";
import { ChaosSimulatorPanel } from "@/components/ChaosSimulatorPanel";
import { DemoSafetyMap } from "@/components/DemoSafetyMap";
import { HitlDecisionModal } from "@/components/HitlDecisionModal";
import { IncidentEvidenceGraphView } from "@/components/IncidentEvidenceGraph";
import { IncidentReplayPlayer } from "@/components/IncidentReplayPlayer";
import { PostIncidentForensicsView } from "@/components/PostIncidentForensicsView";
import { RiskBadge, SafetyShell } from "@/components/SafetyShell";
import { ZoneScorecard } from "@/components/ZoneScorecard";
import { useSafety } from "@/contexts/SafetyContext";
import type { HitlRecommendation } from "@/lib/hitl-engine";
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
  SlidersHorizontal,
  Sparkles,
  Map,
  Compass,
  CheckCircle2,
  UserCheck,
  Zap,
  Play,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function AuthorityCommand() {
  const allowed = useAuthorityAccess();
  const {
    incidents,
    zones,
    responders,
    activeState,
    digitalTwin,
    simulationParams,
    updateSimulationParams,
    zonalCoverage,
    prePositioningRecs,
    getEvidenceGraph,
    nextBestActions,
    hitlRecommendations,
    processHitlAction,
    chaosState,
    toggleChaosState,
    resilienceResponse,
    forensicsReport,
    confidenceAI,
  } = useSafety();

  const [activeHitlModalRec, setActiveHitlModalRec] = useState<HitlRecommendation | null>(null);
  const [showReplay, setShowReplay] = useState(false);

  if (!allowed) return <AuthorityAccessDenied />;

  const active = incidents.filter((incident) => incident.status !== "RESOLVED");
  const critical = active.filter((incident) => ["HIGH", "CRITICAL"].includes(incident.severity));

  const activeIncident = active[0] || incidents[0];
  const evidenceGraph = activeIncident ? getEvidenceGraph(activeIncident) : null;

  return (
    <SafetyShell
      eyebrow="Authority command centre"
      title={`${activeState.name} Emergency Coordination & Decision Command`}
      actions={
        <Link
          href="/authority/incidents"
          className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
        >
          Incident Queue ({active.length})
        </Link>
      }
    >
      {/* HITL Review Modal */}
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

      {/* Top Metrics with Confidence Badge */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={ShieldAlert}
          label="Active Incidents"
          value={digitalTwin.activeIncidents}
          detail={`${activeState.name} active queue`}
          tone="rose"
        />
        <Metric
          icon={AlertTriangle}
          label="AI Model Confidence"
          value={`${confidenceAI.confidencePercentage}% (${confidenceAI.confidenceLevel})`}
          detail="Evaluated telemetry quality"
          tone="amber"
        />
        <Metric
          icon={Activity}
          label="Area Resilience"
          value={`${digitalTwin.overallResilienceScore}/100`}
          detail={`ETA: ${digitalTwin.averageResponseTimeMinutes} mins`}
          tone="cyan"
        />
        <Metric
          icon={UsersRound}
          label="Active Responders"
          value={digitalTwin.activeResponders}
          detail={`${responders.length} total registered`}
          tone="green"
        />
      </div>

      {/* Next Best Action & HITL Decision Bar */}
      <div className="mt-5 rounded-3xl border border-cyan-900 bg-[#082235] p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500 text-slate-950 font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                NEXT BEST ACTION ENGINE [MODEL-DERIVED + HITL APPROVAL]
              </span>
              <h3 className="text-sm font-black text-white">Ranked Decision Recommendations</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowReplay(!showReplay)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
          >
            <Play className="h-3.5 w-3.5" />
            {showReplay ? "Hide Incident Replay" : "Replay Incident Lifecycle"}
          </button>
        </div>

        {/* Next Best Action Items */}
        <div className="grid gap-3 md:grid-cols-2">
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

      {/* Interactive Replay Player */}
      {showReplay && (
        <div className="mt-5">
          <IncidentReplayPlayer />
        </div>
      )}

      {/* Chaos Simulator Control Panel */}
      <div className="mt-5">
        <ChaosSimulatorPanel
          chaosState={chaosState}
          onToggleChaos={toggleChaosState}
          resilience={resilienceResponse}
        />
      </div>

      {/* Main Operational Map & Live Dispatch Feed */}
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

        {/* Resource Pre-Positioning Recommendations */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-slate-900 dark:text-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  AI PRE-POSITIONING ENGINE [MODEL-DERIVED]
                </span>
                <h2 className="mt-0.5 text-base font-black text-slate-950 dark:text-white">
                  Resource Pre-Positioning
                </h2>
              </div>
              <Compass className="h-5 w-5 text-cyan-600" />
            </div>

            <div className="mt-4 space-y-3">
              {prePositioningRecs.map((rec) => (
                <div key={rec.id} className="rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 p-4 border border-cyan-200 dark:border-cyan-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-900 dark:text-cyan-200">{rec.targetZoneName}</span>
                    <span className="rounded-full bg-cyan-500 text-slate-950 px-2 py-0.5 text-[9px] font-black">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Assign: {rec.recommendedResponderName}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Forensics Report & Evidence Graph Grid */}
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <PostIncidentForensicsView report={forensicsReport} />
        </div>

        {evidenceGraph && (
          <div>
            <IncidentEvidenceGraphView graph={evidenceGraph} />
          </div>
        )}
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
  value: number | string;
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
