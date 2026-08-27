import React, { useState, useEffect } from "react";
import { deterministicReplayScenario, type ReplayFrame } from "@/lib/incident-replay-engine";
import { Play, Pause, SkipForward, RotateCcw, MapPin, ShieldAlert, CheckCircle2, BadgeCheck } from "lucide-react";

export function IncidentReplayPlayer() {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const frame: ReplayFrame = deterministicReplayScenario[currentFrameIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev >= deterministicReplayScenario.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
            INTERACTIVE INCIDENT REPLAY PLAYER [DETERMINISTIC DB SCENARIO]
          </span>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Incident INC-1042 Replay Lifecycle
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 px-3.5 py-1.5 text-xs font-bold transition hover:bg-cyan-500"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause" : "Play Replay"}
          </button>
          <button
            type="button"
            onClick={() => setCurrentFrameIndex(0)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900"
            title="Restart Replay"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Timeline Stepper Controls */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
        {deterministicReplayScenario.map((f, idx) => (
          <button
            key={f.step}
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentFrameIndex(idx);
            }}
            className={`h-2 rounded-full transition-all ${
              idx === currentFrameIndex
                ? "w-8 bg-cyan-500 ring-2 ring-cyan-400"
                : idx < currentFrameIndex
                ? "w-4 bg-emerald-500"
                : "w-2 bg-slate-200 dark:bg-slate-700"
            }`}
            title={`Step ${f.step}: ${f.time}`}
          />
        ))}
      </div>

      {/* Frame Active Display */}
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-cyan-600 dark:text-cyan-400">Timestamp: {frame.time}</span>
          <span className="font-black text-rose-600">Risk Score: {frame.riskScore}/100</span>
        </div>

        <p className="text-sm font-bold text-slate-900 dark:text-white">{frame.eventDescription}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <strong className="text-slate-400">Location:</strong> {frame.locationName}
          </div>
          <div>
            <strong className="text-slate-400">Status:</strong> {frame.incidentStatus}
          </div>
        </div>

        {frame.aiRecommendation && (
          <div className="rounded-xl bg-cyan-100 dark:bg-cyan-950/80 p-2.5 text-xs text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
            <strong>AI Recommendation:</strong> {frame.aiRecommendation}
          </div>
        )}

        {frame.authorityDecision && (
          <div className="rounded-xl bg-emerald-100 dark:bg-emerald-950/80 p-2.5 text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
            <strong>Human HITL Decision:</strong> {frame.authorityDecision}
          </div>
        )}

        {frame.auditHash && (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <BadgeCheck className="h-4 w-4" />
            Audit Hash: {frame.auditHash}
          </div>
        )}
      </div>
    </div>
  );
}
