import { AuthorityAccessDenied, useAuthorityAccess } from "@/components/AuthorityAccess";
import { ModelHealthPanel } from "@/components/ModelHealthPanel";
import { SafetyShell } from "@/components/SafetyShell";
import { SystemHealthPanel } from "@/components/SystemHealthPanel";
import { useSafety } from "@/contexts/SafetyContext";
import { calculateOperationalMetrics } from "@/lib/metrics-engine";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { ChartNoAxesCombined, Clock3, ShieldAlert, Cpu, Activity, CheckCircle2, BarChart2, Search, Network, Layers, GitBranch } from "lucide-react";
import { useState } from "react";

export default function AuthorityAnalytics() {
  const allowed = useAuthorityAccess();
  const { incidents, zones, activeState, getSimilarIncidents, discoveredPatterns, federatedLearningState, modelLifecycleInfo, connectivityLadder } = useSafety();
  const [activeTab, setActiveTab] = useState<"OPERATIONAL" | "SIMILARITY" | "FEDERATED" | "CONNECTIVITY" | "ML_EVAL" | "SYSTEM_HEALTH">("OPERATIONAL");

  if (!allowed) return <AuthorityAccessDenied />;

  const metrics = calculateOperationalMetrics(incidents);
  const targetIncident = incidents[0];
  const similarIncidents = targetIncident ? getSimilarIncidents(targetIncident) : [];

  const severityData = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((name) => ({
    name,
    value: incidents.filter((i) => i.severity === name).length,
  }));

  const zoneData = zones.map((zone) => ({
    name: zone.name.replace(" Corridor", "").replace(" Zone", ""),
    risk: zone.score,
    incidents: zone.incidentCount,
  }));

  return (
    <SafetyShell eyebrow="Authority command centre" title={`${activeState.name} Operational Intelligence & Analytics`}>
      {/* Top Tab Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <TabButton
          active={activeTab === "OPERATIONAL"}
          onClick={() => setActiveTab("OPERATIONAL")}
          icon={BarChart2}
          label="Real Operational Metrics"
        />
        <TabButton
          active={activeTab === "SIMILARITY"}
          onClick={() => setActiveTab("SIMILARITY")}
          icon={Search}
          label="Incident Similarity Engine"
        />
        <TabButton
          active={activeTab === "FEDERATED"}
          onClick={() => setActiveTab("FEDERATED")}
          icon={Network}
          label="Federated Learning Demo"
        />
        <TabButton
          active={activeTab === "CONNECTIVITY"}
          onClick={() => setActiveTab("CONNECTIVITY")}
          icon={Layers}
          label="Connectivity Ladder (5-Level)"
        />
        <TabButton
          active={activeTab === "ML_EVAL"}
          onClick={() => setActiveTab("ML_EVAL")}
          icon={Cpu}
          label="MLOps Model Lifecycle"
        />
        <TabButton
          active={activeTab === "SYSTEM_HEALTH"}
          onClick={() => setActiveTab("SYSTEM_HEALTH")}
          icon={Activity}
          label="System Health & Latency"
        />
      </div>

      {activeTab === "OPERATIONAL" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Clock3}
              label="Avg Acknowledgement Time"
              value={`${metrics.avgAcknowledgementSec} s`}
              detail="T_acknowledged - T_created"
            />
            <MetricCard
              icon={Clock3}
              label="Avg Dispatch Time"
              value={`${metrics.avgDispatchSec} s`}
              detail="T_assigned - T_acknowledged"
            />
            <MetricCard
              icon={Clock3}
              label="Avg Responder Arrival Time"
              value={`${Math.round(metrics.avgArrivalTimeSec / 60)} min`}
              detail="T_on_scene - T_assigned"
            />
            <MetricCard
              icon={Clock3}
              label="Avg Incident Resolution"
              value={`${Math.round(metrics.avgResolutionSec / 60)} min`}
              detail="T_resolved - T_created"
            />
          </div>

          {/* Safety Pattern Discovery Section */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  SAFETY PATTERN DISCOVERY ENGINE [SYNTHETIC DATA]
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Discovered Historical Incident Correlations</h3>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {discoveredPatterns.map((pat) => (
                <div key={pat.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{pat.patternTitle}</span>
                    <span className="rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 px-2 py-0.5 text-[9px] font-black">
                      {pat.confidenceScore}% CONFIDENCE
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{pat.relationshipDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "FEDERATED" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#082235] p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  FEDERATED LEARNING SIMULATION ADAPTER [SIMULATED]
                </span>
                <h2 className="text-xl font-black">{federatedLearningState.globalModelVersion}</h2>
              </div>
              <span className="rounded-full bg-cyan-500 text-slate-950 px-3 py-1 text-xs font-black">
                ROUND #{federatedLearningState.roundNumber} ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Demonstrates multi-region federated weight aggregation. Raw regional tourist telemetry remains strictly stored on local regional edge servers (Karnataka, Goa, Kerala), transmitting encrypted model gradient updates to aggregate the global safety predictor.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {federatedLearningState.regionalNodes.map((node) => (
                <div key={node.regionId} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{node.regionName}</span>
                    <span className="text-xs font-bold text-emerald-400">{node.localAccuracy}% Acc</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Samples Logged: {node.localSamplesCount}</p>
                  <p className="text-[10px] font-mono text-cyan-300 border-t border-white/10 pt-2">{node.privacyGuarantee}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "CONNECTIVITY" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  5-LEVEL CONNECTIVITY DEGRADATION LADDER [MEASURED]
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">
                  Active Status: {connectivityLadder.levelName}
                </h3>
              </div>
              <span className="rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-700 px-3 py-1 text-xs font-bold text-cyan-800 dark:text-cyan-300">
                Transport: {connectivityLadder.activeTransport}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">{connectivityLadder.description}</p>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Feature Availability Matrix Across Connectivity Levels
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2">System Safety Capability</th>
                      <th className="py-2">Cloud Level 1</th>
                      <th className="py-2">Degraded Level 2</th>
                      <th className="py-2">Offline Edge Level 3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                    {connectivityLadder.matrix.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-bold">{row.capability}</td>
                        <td className="py-3 text-emerald-600 dark:text-emerald-400 font-black">YES</td>
                        <td className="py-3 text-emerald-600 dark:text-emerald-400 font-black">{row.degraded ? "YES" : "LIMITED"}</td>
                        <td className="py-3 font-black">{row.offlineEdge ? <span className="text-emerald-600 dark:text-emerald-400">YES</span> : <span className="text-slate-400">QUEUED</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "SIMILARITY" && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  HISTORICAL PATTERN MATCHING [SYNTHETIC DEMO DATA]
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">
                  Incident Similarity Lookup ({similarIncidents.length} matches found)
                </h3>
              </div>
              <Search className="h-5 w-5 text-cyan-600" />
            </div>

            <div className="mt-5 space-y-3">
              {similarIncidents.map((sim) => (
                <div key={sim.incidentId} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{sim.incidentId}</span>
                      <span className="rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-700 px-2.5 py-0.5 text-[10px] font-black text-cyan-900 dark:text-cyan-300">
                        {sim.similarityScorePercentage}% MATCH
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{sim.historicalDate} · {sim.location}</span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    Past Outcome: {sim.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "ML_EVAL" && (
        <div className="space-y-6">
          <ModelHealthPanel />

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  MLOps MODEL UPDATE PIPELINE [MEASURED]
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Active Model Version: {modelLifecycleInfo.activeVersion}</h3>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                VALIDATION: {modelLifecycleInfo.validationStatus} ({modelLifecycleInfo.validationAccuracy}%)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Candidate Model <strong>{modelLifecycleInfo.candidateVersion}</strong> has passed multi-region validation tests and is deployed across <strong>{modelLifecycleInfo.deployedEdgeNodesCount}/{modelLifecycleInfo.totalEdgeNodesCount} edge nodes</strong>.
            </p>
          </div>
        </div>
      )}

      {activeTab === "SYSTEM_HEALTH" && <SystemHealthPanel />}
    </SafetyShell>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
        active
          ? "bg-[#082235] text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950"
          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: { icon: React.ElementType; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
        <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
      </div>
      <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] font-mono text-slate-400 dark:text-slate-500">{detail}</p>
    </div>
  );
}
