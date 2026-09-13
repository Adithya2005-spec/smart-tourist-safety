import { AIChatBox, type Message } from "@/components/AIChatBox";
import { RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { BotMessageSquare, Globe2, MapPin, MapPinned, ShieldCheck, Sparkles, Database, FileText } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import { getStateSuggestedQueries } from "@/lib/guardian-dynamic-prompts";

export default function TouristGuardian() {
  const { guardianReply, risk, locationName, zones, activeState, setActiveState, allStates } = useSafety();
  const prevStateRef = useRef<string>(activeState.code);

  const getGreeting = (stateName: string, statePolice: string) =>
    `Namaste! I am Guardian AI, your Pan-India Safety Decision Assistant. I operate strictly using **Grounded Application Context** from the Safety Knowledge Graph.\n\nYou are currently in **${stateName}** (**${locationName}**).\nCurrent risk: **${risk.severity || risk.band} (${risk.score}/100)**.\nLocal Police Helpline: **${statePolice}** (or **112** for Central SOS).\n\nAsk me about local risk factors, safer route alternatives, emergency numbers, or historical incident similarities.`;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getGreeting(activeState.name, activeState.emergency.touristPolice),
    },
  ]);

  // Update greeting and chat context if active state changes
  useEffect(() => {
    if (prevStateRef.current !== activeState.code) {
      setMessages((prev) => {
        if (prev.length <= 1) {
          return [
            {
              role: "assistant",
              content: getGreeting(activeState.name, activeState.emergency.touristPolice),
            },
          ];
        }
        return [
          ...prev,
          {
            role: "assistant",
            content: `📍 **Grounding Switched to ${activeState.name} (${activeState.capital})**\nEmergency Tourist Police: **${activeState.emergency.touristPolice || "112"}** | Central SOS: **112**\nKnowledge Graph and suggested prompts are now localized to ${activeState.name}.`,
          },
        ];
      });
      prevStateRef.current = activeState.code;
    }
  }, [activeState.code, activeState.name, activeState.emergency.touristPolice, activeState.capital]);

  const dynamicPrompts = useMemo(() => {
    return getStateSuggestedQueries(activeState, "en");
  }, [activeState]);

  const respond = (question: string) => {
    setMessages((previous) => [
      ...previous,
      { role: "user", content: question },
      { role: "assistant", content: guardianReply(question) },
    ]);
  };

  const safe = zones.find((zone) => zone.band === "SAFE" || zone.severity === "LOW");

  return (
    <SafetyShell
      eyebrow="Traveller workspace"
      title="Guardian AI Decision Assistant"
      actions={
        <div className="flex items-center gap-2">
          {/* Quick State Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs shadow-xs">
            <MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <select
              aria-label="Active Indian State"
              value={activeState.id}
              onChange={(e) => setActiveState(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              {allStates.map((st) => (
                <option key={st.id} value={st.id} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/tourist/guardian-ai"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Launch Multi-Agent Intelligence
          </Link>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.55fr]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                <BotMessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Grounded Safety Decision Assistant
                  </p>
                  <span className="rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-700 px-2 py-0.5 text-[9px] font-black uppercase text-cyan-800 dark:text-cyan-300">
                    KNOWLEDGE GRAPH GROUNDED
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Active in <strong className="text-cyan-700 dark:text-cyan-300">{activeState.name} ({activeState.code})</strong> · Dynamic Prompts Active
                </p>
              </div>
            </div>
            <RiskBadge score={risk.score} band={risk.severity || risk.band} compact />
          </div>
          <AIChatBox
            messages={messages}
            onSendMessage={respond}
            height="560px"
            placeholder={`Ask about ${activeState.name} safety advisories, emergency numbers, or safer route options…`}
            suggestedPrompts={dynamicPrompts}
            className="rounded-none border-0 shadow-none bg-transparent"
          />
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl bg-[#082235] p-6 text-white shadow-md">
            <Sparkles className="h-5 w-5 text-cyan-300" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-cyan-300">
              Structured Knowledge Graph Context
            </p>
            <h2 className="mt-1 text-xl font-black">
              State-Grounded Intelligence: {activeState.name}
            </h2>
            <div className="mt-5 space-y-4 text-xs">
              <Context icon={MapPin} label="Active State" value={`${activeState.name} (${activeState.capital})`} />
              <Context icon={MapPinned} label="Current location" value={locationName} />
              <Context icon={ShieldCheck} label="Nearest safe point" value={safe?.name ?? "Cubbon Park Safety Point"} />
              <Context icon={Database} label="Grounding Pipeline" value="Safety Knowledge Graph + Verified Emergency DB" />
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <Link
                href="/pan-india"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200"
              >
                <Globe2 className="h-3.5 w-3.5" />
                Switch State Explorer (36 States) →
              </Link>
            </div>
          </div>

          <SafetyNotice tone="slate">
            <p className="text-xs">
              <strong>Grounding Guarantee:</strong> Guardian AI is explicitly restricted to verified application data, preventing hallucinated emergency numbers, responders, or safety conditions.
            </p>
          </SafetyNotice>
        </aside>
      </div>
    </SafetyShell>
  );
}

function Context({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-cyan-300 shrink-0" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
