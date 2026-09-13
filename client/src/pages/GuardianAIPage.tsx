/**
 * GUARDIAN AI DEDICATED PAGE
 * Interactive conversational safety intelligence powered by multi-agent reasoning,
 * OpenRouter LLM gateway, and multilingual fallbacks (EN / HI / KN).
 */

import React, { useState } from "react";
import { SafetyShell, RiskBadge } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { useGuardianAI } from "@/hooks/useGuardianAI";
import { useMultiAgentQuery } from "@/hooks/useMultiAgentQuery";
import { AgentExecutionPanel } from "@/components/AgentExecutionPanel";
import { RiskForecastChart } from "@/components/RiskForecastChart";
import {
  BotMessageSquare,
  Sparkles,
  Send,
  Languages,
  Clock,
  Shield,
  Trash2,
  CheckCircle2,
  Compass,
} from "lucide-react";

export default function GuardianAIPage() {
  const { risk, locationName, activeState, location, online } = useSafety();

  const {
    messages,
    isAsking,
    language,
    setLanguage,
    sendMessage,
    clearChat,
    suggestedQueries,
  } = useGuardianAI("en");

  const {
    execute: executeOrchestrator,
    data: orchestratorData,
    isLoading: isOrchestrating,
  } = useMultiAgentQuery({
    location,
    stateId: activeState.code,
    language,
    isOnline: online,
  });

  const [inputQuery, setInputQuery] = useState("");

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isAsking) return;

    setInputQuery("");

    // 1. Send conversational message to Guardian AI
    sendMessage(text, {
      overallRiskScore: risk.score,
      riskTier: risk.severity || risk.band,
      locationName,
    });

    // 2. Concurrently execute multi-agent orchestrator for trace visualization
    executeOrchestrator(text, {
      language,
      location,
      stateId: activeState.code,
    });
  };

  return (
    <SafetyShell eyebrow="Multi-Agent AI Intelligence" title="Guardian AI Safety Agent">
      <div className="space-y-6">
        {/* Top Header & Controls */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-md p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow">
              <BotMessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Guardian AI
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  OPENROUTER / DETERMINISTIC CORE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Context-grounded tourist protector for {activeState.name} • Multilingual safety advisories
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 p-1 rounded-xl text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  language === "en"
                    ? "bg-indigo-600 text-white font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  language === "hi"
                    ? "bg-indigo-600 text-white font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage("kn")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  language === "kn"
                    ? "bg-indigo-600 text-white font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <RiskBadge score={risk.score} band={risk.severity || risk.band} compact />
          </div>
        </div>

        {/* Main 2-Column Layout: Chat Box on Left, Orchestration Trace on Right */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_.8fr] gap-6">
          {/* Chat Column */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-md flex flex-col h-[680px] shadow-xl overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-br-xs shadow-md"
                          : "bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-xs shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 opacity-80 text-[10px] font-mono">
                        <span className="font-bold flex items-center gap-1">
                          {isUser ? "Tourist" : "Guardian AI"}
                        </span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>

                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Safety Tips from Guardian */}
                      {msg.metadata?.tips && msg.metadata.tips.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1">
                          <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Key Safety Directives:
                          </div>
                          {msg.metadata.tips.map((tip, idx) => (
                            <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommended Action */}
                      {msg.metadata?.actionText && (
                        <div className="mt-2.5 p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-[11px] text-indigo-200">
                          <strong>Action:</strong> {msg.metadata.actionText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isAsking && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/40 text-xs text-slate-400 w-fit">
                  <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                  <span>Guardian AI synthesizing specialist intelligence...</span>
                </div>
              )}
            </div>

            {/* Suggested Prompts */}
            <div className="p-3 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Prompts:
              </span>
              {suggestedQueries.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder={
                  language === "hi"
                    ? "सुरक्षा, मौसम या सुरक्षित मार्ग के बारे में पूछें..."
                    : language === "kn"
                    ? "ಸುರಕ್ಷತೆ, ಹವಾಮಾನ ಅಥವಾ ಸುರಕ್ಷಿತ ಮಾರ್ಗದ ಬಗ್ಗೆ ಕೇಳಿ..."
                    : "Ask about zone safety, weather risk, or safe routes..."
                }
                className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || isAsking}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all active:scale-95 shadow"
              >
                <Send className="w-4 h-4" />
              </button>

              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Multi-Agent Execution Panel & Risk Timeline */}
          <div className="space-y-6">
            <AgentExecutionPanel
              plan={orchestratorData?.plan}
              agentOutputs={orchestratorData?.agentOutputs}
              validation={orchestratorData?.validation}
              isLoading={isOrchestrating}
              totalExecutionMs={orchestratorData?.executionMs}
            />

            <RiskForecastChart stateId={activeState.code} />
          </div>
        </div>
      </div>
    </SafetyShell>
  );
}
