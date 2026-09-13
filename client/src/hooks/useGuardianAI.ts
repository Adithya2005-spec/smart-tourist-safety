/**
 * GUARDIAN AI CHAT HOOK
 * Conversational management for Guardian AI with support for multilingual (EN/HI/KN),
 * quick prompt suggestions, and structured safety advisories.
 */

import { useState, useCallback } from "react";
import { GuardianOutput } from "./useMultiAgentQuery";

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

export const SUGGESTED_QUERIES: Record<"en" | "hi" | "kn", string[]> = {
  en: [
    "Is it safe to walk around Cubbon Park right now?",
    "Where is the nearest tourist police help desk?",
    "What is the weather and crowd risk in Bengaluru today?",
    "Show me the safest route to MG Road metro station",
  ],
  hi: [
    "क्या इस समय कब्बन पार्क के आसपास घूमना सुरक्षित है?",
    "निकटतम पर्यटन पुलिस सहायता केंद्र कहाँ है?",
    "आज बेंगलुरु में मौसम और भीड़ का जोखिम क्या है?",
    "एमजी रोड मेट्रो स्टेशन का सबसे सुरक्षित मार्ग दिखाएं",
  ],
  kn: [
    "ಈ ಸಮಯದಲ್ಲಿ ಕಬ್ಬನ್ ಪಾರ್ಕ್ ಸುತ್ತಲೂ ನಡೆಯುವುದು ಸುರಕ್ಷಿತವೇ?",
    "ಹತ್ತಿರದ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?",
    "ಇಂದು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹವಾಮಾನ ಮತ್ತು ಜನಸಂದಣಿಯ ಅಪಾಯವೇನು?",
    "ಎಂಜಿ ರಸ್ತೆ ಮೆಟ್ರೋ ನಿಲ್ದಾಣಕ್ಕೆ ಸುರಕ್ಷಿತ ಮಾರ್ಗವನ್ನು ತೋರಿಸಿ",
  ],
};

export function useGuardianAI(defaultLanguage: "en" | "hi" | "kn" = "en") {
  const [language, setLanguage] = useState<"en" | "hi" | "kn">(defaultLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "guardian",
      content:
        defaultLanguage === "hi"
          ? "नमस्ते! मैं सुरक्षा गार्जियन एआई हूँ। मैं आपके क्षेत्र की सुरक्षा, मौसम, भीड़ और सुरक्षित मार्गों की निगरानी करता हूँ। आप मुझसे कुछ भी पूछ सकते हैं।"
          : defaultLanguage === "kn"
          ? "ನಮಸ್ಕಾರ! ನಾನು ಸುರಕ್ಷಾ ಗಾರ್ಡಿಯನ್ AI. ನಿಮ್ಮ ಪ್ರದೇಶದ ಸುರಕ್ಷತೆ, ಹವಾಮಾನ ಮತ್ತು ಸುರಕ್ಷಿತ ಮಾರ್ಗಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ."
          : "Hello! I am Guardian AI, your intelligent tourist safety companion. I monitor real-time zone risk, crowd density, weather hazards, and verified corridors. How may I assist you?",
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
    suggestedQueries: SUGGESTED_QUERIES[language] || SUGGESTED_QUERIES.en,
  };
}
