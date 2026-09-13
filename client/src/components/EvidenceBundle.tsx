/**
 * EVIDENCE BUNDLE COMPONENT
 * Renders verified multi-agent evidence items with provenance tags,
 * freshness badges, integrity status, and confidence levels.
 */

import React from "react";
import { ShieldCheck, AlertCircle, Clock, Database, Radio, Sparkles } from "lucide-react";
import { ValidationSummary } from "../hooks/useMultiAgentQuery";

interface EvidenceBundleProps {
  validation?: ValidationSummary | null;
  className?: string;
}

export const EvidenceBundle: React.FC<EvidenceBundleProps> = ({
  validation,
  className = "",
}) => {
  if (!validation) return null;

  const items = validation.evidenceItems || [];

  return (
    <div
      className={`rounded-xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-md p-5 text-slate-100 shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              Verified Evidence Bundle
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AUDITED
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Cross-checked evidence records validated for freshness, provenance & sensor consensus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Overall Trust:</span>
          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {validation.trustScore}%
          </span>
        </div>
      </div>

      {/* Warnings & Conflicts */}
      {validation.warnings && validation.warnings.length > 0 && (
        <div className="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            {validation.warnings.map((w, idx) => (
              <div key={idx}>{w}</div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Items Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item, idx) => {
          const isFresh = item.freshnessStatus === "FRESH";
          const isLive = item.mode.includes("LIVE");
          const isSimulated = item.mode.includes("SIMULATED");

          return (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors flex flex-col justify-between gap-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-200 capitalize">
                    {item.agentName.replace(/_/g, " ")} Evidence
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.source}</div>
                </div>

                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase border ${
                    isLive
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/50"
                      : isSimulated
                      ? "bg-purple-950/60 text-purple-300 border-purple-800/50"
                      : "bg-blue-950/60 text-blue-300 border-blue-800/50"
                  }`}
                >
                  {item.mode}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className={isFresh ? "text-emerald-400" : "text-amber-400"}>
                    {item.freshnessStatus}
                  </span>
                </span>
                <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
