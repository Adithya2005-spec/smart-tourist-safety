/**
 * GUARDIAN AI CHAT HOOK
 * Conversational management for Guardian AI with support for multilingual (EN/HI/KN),
 * quick prompt suggestions, and structured safety advisories.
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { GuardianOutput } from "./useMultiAgentQuery";
import type { IndianStateData } from "@/lib/india-safety-data";
import { getStateSuggestedQueries } from "@/lib/guardian-dynamic-prompts";

export interface ChatMessage {
  id: string;
  role: "user" | "guardian";
  content: string;
  timestamp: string;
  language: "en" | "hi" | "kn";
  metadata?: {
    confidence?: number;
    urgency?: "INFO" | "ADVISORY" | "WARNING" | "IMMEDIATE_ACTION";
    provenance?: string;
    tips?: string[];
    actionText?: string;
  };
}

export function useGuardianAI(
  defaultLanguage: "en" | "hi" | "kn" = "en",
  state?: IndianStateData
) {
  const [language, setLanguage] = useState<"en" | "hi" | "kn">(defaultLanguage);
  const prevStateCodeRef = useRef<string | undefined>(state?.code);

  const getWelcomeMessage = useCallback(
    (lang: "en" | "hi" | "kn", activeState?: IndianStateData): string => {
      const stateName = activeState?.name || "India";
      const police = activeState?.emergency?.touristPolice || "112";

      if (lang === "hi") {
        return `नमस्ते! मैं सुरक्षा गार्जियन एआई हूँ। मैं **${stateName}** में आपकी सुरक्षा, मौसम, भीड़ और सुरक्षित मार्गों की निगरानी करता हूँ।\nपर्यटन पुलिस: **${police}** | आपातकालीन SOS: **112**।\nनीचे दिए गए सुझावों में से चुनें या कोई भी प्रश्न पूछें।`;
      }
      if (lang === "kn") {
        return `ನಮಸ್ಕಾರ! ನಾನು ಸುರಕ್ಷಾ ಗಾರ್ಡಿಯನ್ AI. **${stateName}** ನಲ್ಲಿ ನಿಮ್ಮ ಸುರಕ್ಷತೆ, ಹವಾಮಾನ ಮತ್ತು ಸುರಕ್ಷಿತ ಮಾರ್ಗಗಳನ್ನು ನಾನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತೇನೆ.\nಪ್ರವಾಸಿ ಪೊಲೀಸ್: **${police}** | ತುರ್ತು SOS: **112**.\nಕೆಳಗಿನ ಸಲಹೆಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.`;
      }
      return `Hello! I am Guardian AI, your intelligent tourist safety companion for **${stateName}**.\n\nActive State: **${stateName}** (${activeState?.capital || "Regional Capital"})\nTourist Police Helpline: **${police}** | Central SOS: **112**\n\nI monitor real-time zone risk, crowd surges, weather hazards, and safe corridors. How may I assist you?`;
    },
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "guardian",
      content: getWelcomeMessage(defaultLanguage, state),
      timestamp: new Date().toISOString(),
      language: defaultLanguage,
      metadata: {
        confidence: 0.98,
        urgency: "INFO",
        provenance: "GUARDIAN_CORE",
      },
    },
  ]);
  const [isAsking, setIsAsking] = useState(false);

  // Dynamically compute suggested queries whenever active state or language changes
  const suggestedQueries = useMemo(() => {
    return getStateSuggestedQueries(state, language);
  }, [state, language]);

  // Reactive effect when user changes state in dropdown/selector
  useEffect(() => {
    if (!state) return;

    if (prevStateCodeRef.current && prevStateCodeRef.current !== state.code) {
      // If user only had the default welcome message, refresh it directly
      setMessages((prev) => {
        if (prev.length <= 1 && prev[0]?.id.startsWith("msg-welcome")) {
          return [
            {
              id: `msg-welcome-${state.code}`,
              role: "guardian",
              content: getWelcomeMessage(language, state),
              timestamp: new Date().toISOString(),
              language,
              metadata: {
                confidence: 0.98,
                urgency: "INFO",
                provenance: "GUARDIAN_CORE",
              },
            },
          ];
        }

        // Otherwise append an in-chat state transition notice
        const switchNotice: ChatMessage = {
          id: `state-switch-${state.code}-${Date.now()}`,
          role: "guardian",
          content:
            language === "hi"
              ? `📍 **राज्य परिवर्तन: ${state.name} (${state.capital})**\nगार्जियन एआई अब **${state.name}** के सत्यापित डेटा से जुड़ गया है।\n• पर्यटन पुलिस: **${state.emergency?.touristPolice || "112"}** | SOS: **112**\n• मुख्य सुरक्षित केंद्र: **${state.safePoints?.[0]?.name || state.capital}**\nसुझाए गए प्रश्न ${state.name} के अनुसार अपडेट कर दिए गए हैं।`
              : language === "kn"
              ? `📍 **ರಾಜ್ಯ ಬದಲಾವಣೆ: ${state.name} (${state.capital})**\nಗಾರ್ಡಿಯನ್ AI ಈಗ **${state.name}** ನ ದೃಢೀಕೃತ ತುರ್ತು ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ.\n• ಪ್ರವಾಸಿ ಪೊಲೀಸ್: **${state.emergency?.touristPolice || "112"}** | SOS: **112**\n• ಮುಖ್ಯ ಸುರಕ್ಷಿತ ಸ್ಥಳ: **${state.safePoints?.[0]?.name || state.capital}**\nಪ್ರಶ್ನೆ ಸಲಹೆಗಳು ${state.name} ಗೆ ಅಪ್‌ಡೇಟ್ ಆಗಿವೆ.`
              : `📍 **State Grounding Switched to ${state.name} (${state.capital})**\nGuardian AI is now grounded in **${state.name}**'s verified security and emergency infrastructure.\n• Tourist Police: **${state.emergency?.touristPolice || "112"}** | Central SOS: **112**\n• Primary Safe Zone: **${state.safePoints?.[0]?.name || state.capital}**\nPrompts below have been dynamically updated for ${state.name}.`,
          timestamp: new Date().toISOString(),
          language,
          metadata: {
            confidence: 0.99,
            urgency: "INFO",
            provenance: "STATE_ROUTER",
          },
        };
        return [...prev, switchNotice];
      });
    }

    prevStateCodeRef.current = state.code;
  }, [state?.code, language, getWelcomeMessage, state]);

  const sendMessage = useCallback(
    async (
      queryText: string,
      context?: {
        overallRiskScore?: number;
        riskTier?: string;
        locationName?: string;
      }
    ) => {
      if (!queryText || !queryText.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: queryText.trim(),
        timestamp: new Date().toISOString(),
        language,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsAsking(true);

      try {
        const res = await fetch("/api/guardian/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryText.trim(),
            language,
            overallRiskScore: context?.overallRiskScore ?? 25,
            riskTier: context?.riskTier ?? "LOW",
            locationContext: {
              locationName: context?.locationName || "Monitored Tourist Zone",
            },
          }),
        });

        if (!res.ok) {
          throw new Error(`Guardian AI response error: ${res.status}`);
        }

        const data = await res.json();
        const guardian: GuardianOutput = data.guardian;

        const aiMsg: ChatMessage = {
          id: `guardian-${Date.now()}`,
          role: "guardian",
          content: guardian.explanation,
          timestamp: guardian.timestamp,
          language: guardian.language,
          metadata: {
            confidence: guardian.confidence,
            urgency: guardian.recommendedAction?.urgency,
            provenance: guardian.modelProvenance,
            tips: guardian.keySafetyTips,
            actionText: guardian.recommendedAction?.actionText,
          },
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: any) {
        const fallbackMsg: ChatMessage = {
          id: `guardian-${Date.now()}`,
          role: "guardian",
          content:
            language === "hi"
              ? "सुरक्षा प्रणाली सामान्य रूप से कार्य कर रही है। आपातकालीन स्थिति में तुरंत 112 डायल करें या एसओएस का उपयोग करें।"
              : language === "kn"
              ? "ಸುರಕ್ಷಾ ವ್ಯವಸ್ಥೆ ಸಾಮಾನ್ಯವಾಗಿದೆ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಗೆ ಕರೆ ಮಾಡಿ."
              : "Suraksha system active. Zone perimeter remains monitored. In emergency, tap SOS or contact 112 directly.",
          timestamp: new Date().toISOString(),
          language,
          metadata: {
            confidence: 0.85,
            urgency: "ADVISORY",
            provenance: "OFFLINE_FALLBACK",
          },
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsAsking(false);
      }
    },
    [language]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isAsking,
    language,
    setLanguage,
    sendMessage,
    clearChat,
    suggestedQueries,
  };
}
