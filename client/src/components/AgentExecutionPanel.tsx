/**
 * AGENT EXECUTION TRANSPARENCY PANEL
 * Visualizes multi-agent orchestration, execution status, provenance badges,
 * latency, and evidence validation in real-time.
 */

import React from "react";
import {
  Cpu,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  Radio,
  MapPin,
  CloudRain,
  Users,
  History,
  Wifi,
} from "lucide-react";
import { AgentExecutionPlan, AgentOutputItem, ValidationSummary } from "../hooks/useMultiAgentQuery";

interface AgentExecutionPanelProps {
  plan?: AgentExecutionPlan | null;
  agentOutputs?: AgentOutputItem[];
  validation?: ValidationSummary | null;
  isLoading?: boolean;
  totalExecutionMs?: number;
}

const AGENT_ICON_MAP: Record<string, React.ReactNode> = {
  planner: <Layers className="w-4 h-4 text-indigo-400" />,
  location: <MapPin className="w-4 h-4 text-emerald-400" />,
  incident: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  weather: <CloudRain className="w-4 h-4 text-cyan-400" />,
  crowd: <Users className="w-4 h-4 text-purple-400" />,
  history: <History className="w-4 h-4 text-blue-400" />,
  connectivity: <Wifi className="w-4 h-4 text-green-400" />,
  evidence_validator: <Shield className="w-4 h-4 text-rose-400" />,
  guardian_ai: <Sparkles className="w-4 h-4 text-amber-300" />,
  responder: <Radio className="w-4 h-4 text-blue-400" />,
};

export const AgentExecutionPanel: React.FC<AgentExecutionPanelProps> = ({
  plan,
  agentOutputs = [],
  validation,
  isLoading = false,
  totalExecutionMs,
}) => {
  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-md p-5 text-slate-100 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Multi-Agent Orchestration Trace
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ORCHESTRATOR ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous specialist agent pipeline with central evidence validation & provenance audit
            </p>
          </div>
        </div>

        {totalExecutionMs !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Total Latency: {totalExecutionMs}ms</span>
          </div>
        )}
      </div>

      {/* Plan Details Pill */}
      {plan && (
        <div className="my-3.5 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Query Intent:</span>
            <span className="font-semibold text-cyan-300 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
              {plan.intent.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Priority:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded uppercase ${
                plan.priority === "critical"
                  ? "bg-rose-950/60 text-rose-300 border border-rose-800/50"
                  : plan.priority === "high"
                  ? "bg-amber-950/60 text-amber-300 border border-amber-800/50"
                  : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
              }`}
            >
              {plan.priority}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Specialists Routed:</span>
            <span className="font-mono text-indigo-300 font-bold">{plan.parallelAgents.length} Parallel + 3 Pipeline</span>
          </div>
        </div>
      )}

      {/* Agent Execution Grid */}
      <div className="mt-3 space-y-2.5">
        {/* If loading and no agent outputs yet */}
        {isLoading && agentOutputs.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span>Dispatching parallel safety intelligence agents...</span>
          </div>
        )}

        {/* Display each agent result */}
        {agentOutputs.map((agent, index) => {
          const mode = agent.dataMode || "DERIVED";
          const isSimulated = mode.includes("SIMULATED") || mode.includes("DEMO");
          const isLive = mode.includes("LIVE");

          return (
            <div
              key={`${agent.agentName}-${index}`}
              className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700">
                  {AGENT_ICON_MAP[agent.agentName] || <Cpu className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 capitalize">
                      {agent.agentName.replace(/_/g, " ")} Agent
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Complete
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Confidence: {(agent.confidence * 100).toFixed(0)}% • Latency: {agent.executionMs || 12}ms
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase border ${
                    isLive
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                      : isSimulated
                      ? "bg-purple-950/60 text-purple-300 border-purple-800/50"
                      : "bg-blue-950/60 text-blue-300 border-blue-800/50"
                  }`}
                >
                  {mode}
                </span>

                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  {agent.timestamp ? new Date(agent.timestamp).toLocaleTimeString() : "Just now"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation Summary Footer */}
      {validation && (
        <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300 font-medium">Evidence Validator:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                validation.overallValidity === "VALID"
                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
                  : "bg-amber-950/60 text-amber-300 border border-amber-800/50"
              }`}
            >
              {validation.overallValidity}
            </span>
            <span className="text-slate-400">
              Trust Score: <strong className="text-white">{validation.trustScore}%</strong>
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Data Completeness: <strong className="text-cyan-300">{validation.dataCompleteness}%</strong>
          </div>
        </div>
      )}
    </div>
  );
};
