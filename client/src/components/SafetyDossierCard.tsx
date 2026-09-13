/**
 * SAFETY DOSSIER CARD
 * Compact summary card of unified safety intelligence dossier.
 * Embeddable directly into Tourist Home and Authority Command Centre.
 */

import React from "react";
import { Link } from "wouter";
import { Shield, ArrowRight, AlertTriangle, CloudRain, Users, Wifi, Radio } from "lucide-react";

interface SafetyDossierCardProps {
  locationName?: string;
  riskScore?: number;
  riskTier?: string;
  confidence?: number;
  activeIncidentsCount?: number;
  weatherCondition?: string;
  crowdLevel?: string;
  isOnline?: boolean;
  dossierUrl?: string;
  className?: string;
}

export const SafetyDossierCard: React.FC<SafetyDossierCardProps> = ({
  locationName = "Bengaluru Central Tourist District",
  riskScore = 24,
  riskTier = "LOW",
  confidence = 94,
  activeIncidentsCount = 0,
  weatherCondition = "Clear",
  crowdLevel = "Normal",
  isOnline = true,
  dossierUrl = "/tourist/dossier",
  className = "",
}) => {
  const isDanger = riskTier === "CRITICAL" || riskTier === "DANGER" || riskScore > 65;
  const isWarning = riskTier === "HIGH" || riskTier === "CAUTION" || riskTier === "MEDIUM" || riskTier === "MODERATE" || riskScore > 40;

  return (
    <div
      className={`rounded-xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-md p-5 text-slate-100 shadow-xl relative overflow-hidden ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Unified Intelligence Dossier
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Confidence {confidence}%
            </span>
          </div>
          <h3 className="text-base font-bold text-white">{locationName}</h3>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-lg border text-center ${
              isDanger
                ? "bg-rose-950/70 border-rose-800 text-rose-300"
                : isWarning
                ? "bg-amber-950/70 border-amber-800 text-amber-300"
                : "bg-emerald-950/70 border-emerald-800 text-emerald-300"
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider">{riskTier}</div>
            <div className="text-lg font-black font-mono">{riskScore}/100</div>
          </div>
        </div>
      </div>

      {/* Specialist Agent Pills */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Incidents</div>
            <div className="font-semibold text-white">{activeIncidentsCount} Active</div>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Weather</div>
            <div className="font-semibold text-white">{weatherCondition}</div>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Crowd</div>
            <div className="font-semibold text-white">{crowdLevel}</div>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Network</div>
            <div className="font-semibold text-white">{isOnline ? "Online" : "Offline SOS"}</div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">
          Multi-agent evidence validated & verified
        </span>

        <Link
          href={dossierUrl}
          className="flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Open Full Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
