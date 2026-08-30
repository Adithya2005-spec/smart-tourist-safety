import React, { useState, useRef, useEffect } from "react";
import {
  processSurakshaIntelligenceQuery,
  type AgentChatMessage,
  type AgentConversationContext,
  type AgentResponseMode,
} from "@/lib/suraksha-intelligence-agent";
import { Brain, Send, ChevronDown, CheckCircle2, AlertTriangle, Shield, UserCheck, Cpu } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What is the highest operational risk zone right now?",
  "How many active incidents are in the queue?",
  "What if tourist density doubles?",
  "Show me the model precision and drift status",
  "Give me a full operational brief",
  "What is Suraksha Link?",
  "What if responder availability falls to 25%?",
];

const MODE_OPTIONS: AgentResponseMode[] = [
  "QUICK ANSWER",
  "DETAILED ANALYSIS",
  "OPERATIONAL BRIEF",
  "RISK ANALYSIS",
  "WHAT-IF ANALYSIS",
];

function EvidencePill({ label, value, tone }: { label: string; value: string; tone?: "rose" | "amber" | "emerald" | "cyan" }) {
  const colors = {
    rose: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  };
  return (
    <div className={`rounded-xl border px-3 py-2 text-xs ${tone ? colors[tone] : "border-white/10 bg-white/5 text-slate-200"}`}>
      <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function AgentMessageBubble({ msg }: { msg: AgentChatMessage }) {
  const isAgent = msg.sender === "AGENT";
  if (!isAgent) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs rounded-2xl rounded-tr-sm bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950">
          {msg.text}
        </div>
      </div>
    );
  }

  const sr = msg.structuredResponse;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-xl bg-cyan-500 text-slate-950">
          <Brain className="h-4 w-4" />
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 flex-1">
          {msg.text}
        </div>
      </div>

      {sr && (
        <div className="ml-9 space-y-3">
          {sr.evidence.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sr.evidence.map((e) => (
                <EvidencePill key={e.label} label={e.label} value={e.value} tone={e.tone} />
              ))}
            </div>
          )}

          {sr.recommendedAction && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
              <UserCheck className="h-4 w-4 flex-shrink-0 text-cyan-300" />
              <div className="flex-1 text-xs">
                <span className="block text-[10px] font-black uppercase text-cyan-300">HITL RECOMMENDED ACTION</span>
                <span className="font-bold text-white">{sr.recommendedAction.title}</span>
              </div>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black text-amber-300">
                REQUIRES APPROVAL
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400">
            {sr.toolsExecuted.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono">
                🔧 {t}()
              </span>
            ))}
            {sr.sources.map((s) => (
              <span key={s} className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5">
                📚 {s}
              </span>
            ))}
          </div>

          <div className="flex gap-3 text-[10px] text-slate-500">
            <span>Model: <strong className="text-slate-300">{sr.modelVersion}</strong></span>
            <span>Confidence: <strong className="text-slate-300">{sr.modelConfidenceLevel}</strong></span>
            <span>Data: <strong className="text-slate-300">{sr.dataQualityLevel}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

export function AskSurakshaPanel({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: "WELCOME",
      sender: "AGENT",
      text: "Hello! I am **Suraksha Intelligence**, your AI-powered Safety Decision Support assistant. I can answer questions about live risk zones, active incidents, model health, What-If scenarios, and more. Ask me anything about tourist safety operations.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AgentResponseMode>("DETAILED ANALYSIS");
  const [isThinking, setIsThinking] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const context: AgentConversationContext = { messages };

  const handleSend = (text = input.trim()) => {
    if (!text) return;
    const userMsg: AgentChatMessage = {
      id: `USER-${Date.now()}`,
      sender: "USER",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const agentMsg = processSurakshaIntelligenceQuery(text, mode, context);
      setMessages((prev) => [...prev, agentMsg]);
      setIsThinking(false);
    }, 900);
  };

  return (
    <div className={`flex flex-col rounded-3xl border border-cyan-900 bg-[#071e2e] overflow-hidden shadow-2xl ${className}`} style={{ minHeight: 480 }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">SURAKSHA INTELLIGENCE</p>
            <p className="text-sm font-black text-white">AI Safety Decision Support</p>
          </div>
        </div>
        {/* Mode Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowModeDropdown((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/10"
          >
            <Cpu className="h-3 w-3" />
            {mode}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showModeDropdown && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded-2xl border border-white/10 bg-[#071e2e] shadow-2xl">
              {MODE_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setShowModeDropdown(false); }}
                  className={`block w-full px-4 py-2.5 text-left text-xs font-bold transition hover:bg-white/5 ${m === mode ? "text-cyan-300" : "text-slate-300"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((m) => (
          <AgentMessageBubble key={m.id} msg={m} />
        ))}
        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-cyan-500/20 text-cyan-300">
              <Brain className="h-4 w-4 animate-pulse" />
            </div>
            <span className="animate-pulse">Suraksha Intelligence is reasoning…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleSend(p)}
              className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/15 transition"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            placeholder="Ask about risk, incidents, model health, What-If scenarios…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500 text-slate-950 disabled:opacity-40 hover:bg-cyan-400 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
