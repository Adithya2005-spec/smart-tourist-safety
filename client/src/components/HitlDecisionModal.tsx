import React, { useState } from "react";
import type { HitlRecommendation } from "@/lib/hitl-engine";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, UserCheck, X } from "lucide-react";

export function HitlDecisionModal({
  recommendation,
  onApprove,
  onReject,
  onClose,
}: {
  recommendation: HitlRecommendation;
  onApprove: (notes?: string) => void;
  onReject: (notes?: string) => void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-cyan-900 bg-[#082235] p-6 text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500 text-slate-950 font-bold">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                HUMAN-IN-THE-LOOP APPROVAL REVIEW
              </span>
              <h3 className="text-sm font-black text-white">{recommendation.recommendationTitle}</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 space-y-1">
            <p className="font-bold text-cyan-300">Recommended Action:</p>
            <p className="text-white text-sm font-black">{recommendation.recommendedAction}</p>
            <p className="text-slate-300 mt-1">{recommendation.reason}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <p className="text-[10px] uppercase font-bold text-slate-400">Model Confidence</p>
              <p className="text-base font-black text-emerald-400">{recommendation.confidencePercentage}% (HIGH)</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <p className="text-[10px] uppercase font-bold text-slate-400">Alternative Option</p>
              <p className="text-[11px] font-semibold text-slate-300">{recommendation.alternativeAction}</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Operator Approval Rationale / Audit Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter optional audit justification for this approval decision..."
              className="w-full h-20 rounded-xl bg-white/10 p-2.5 text-xs text-white outline-none border border-white/10 focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={() => onReject(notes)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 px-4 py-2 text-xs font-bold transition"
          >
            <XCircle className="h-4 w-4" /> Reject Action
          </button>
          <button
            type="button"
            onClick={() => onApprove(notes)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 text-xs font-black transition shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve Action
          </button>
        </div>
      </div>
    </div>
  );
}
