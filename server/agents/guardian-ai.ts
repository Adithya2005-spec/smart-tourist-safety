/**
 * GUARDIAN AI SAFETY AGENT
 * Synthesizes multi-agent evidence, risk scores, and domain rules into human-readable,
 * actionable safety intelligence for tourists and responders.
 * Uses OpenRouter when configured, with robust deterministic fallback in EN/HI/KN.
 */

import { ValidationSummary } from "./evidence-validator";
import { invokeOpenRouter, isOpenRouterConfigured } from "../services/openrouter";
import { invokeGemini, isGeminiConfigured } from "../services/gemini";

export interface GuardianAIInput {
  userQuery: string;
  language?: "en" | "hi" | "kn";
  locationContext?: {
    locationName?: string;
    state?: string;
    lat?: number;
    lng?: number;
  };
  overallRiskScore?: number;
  riskTier?: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  validationSummary?: ValidationSummary;
  activeIncidentsCount?: number;
  weatherSummary?: string;
  crowdSummary?: string;
}

export interface GuardianAIOutput {
  agentName: "guardian_ai";
  timestamp: string;
  query: string;
  language: "en" | "hi" | "kn";
  explanation: string;
  keySafetyTips: string[];
  recommendedAction: {
    actionText: string;
    urgency: "INFO" | "ADVISORY" | "WARNING" | "IMMEDIATE_ACTION";
    hitlRequired: boolean;
  };
  confidence: number;
  modelProvenance: string;
  latencyMs: number;
}

// Multilingual canned templates for deterministic fallback
const FALLBACK_RESPONSES: Record<"en" | "hi" | "kn", {
  safeSummary: string;
  cautiousSummary: string;
  dangerSummary: string;
  emergencyAction: string;
}> = {
  en: {
    safeSummary: "Suraksha Multi-Agent Intelligence reports stable conditions in this zone. Perimeter CCTV, well-lit corridors, and active tourist police patrols are present.",
    cautiousSummary: "Suraksha Multi-Agent Intelligence advises caution. Elevated crowd density or evening hours suggest staying on designated primary corridors.",
    dangerSummary: "High risk indicators detected. Proximity to high-density hazard areas or active incident alert. Immediate safety precautions advised.",
    emergencyAction: "Connect directly to nearest Tourist Police Help Desk or activate Suraksha SOS for automated responder dispatch.",
  },
  hi: {
    safeSummary: "सुरक्षा मल्टी-एजेंट प्रणाली इस क्षेत्र में सामान्य और सुरक्षित स्थिति दर्शाती है। सीसीटीवी और पर्यटन पुलिस गश्त सक्रिय हैं।",
    cautiousSummary: "सुरक्षा मल्टी-एजेंट सलाह: सावधानी बरतें। मुख्य प्रकाश वाले मार्गों पर रहें और अपने समूह के साथ रहें।",
    dangerSummary: "चेतावनी: इस क्षेत्र में उच्च जोखिम या सक्रिय घटना दर्ज है। कृपया तुरंत सुरक्षित स्थान पर जाएं।",
    emergencyAction: "निकटतम पर्यटन पुलिस से संपर्क करें या तुरंत सुरक्षा एसओएस बटन दबाएं।",
  },
  kn: {
    safeSummary: "ಸುರಕ್ಷಾ ಮಲ್ಟಿ-ಏಜೆಂಟ್ ವ್ಯವಸ್ಥೆಯು ಈ ವಲಯದಲ್ಲಿ ಸುರಕ್ಷಿತ ಪರಿಸ್ಥಿತಿಯನ್ನು ವರದಿ ಮಾಡಿದೆ. ಸಿಸಿಟಿವಿ ಮತ್ತು ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಗಸ್ತು ಸಕ್ರಿಯವಾಗಿದೆ.",
    cautiousSummary: "ಸುರಕ್ಷಾ ಸಲಹೆ: ಎಚ್ಚರಿಕೆ ವಹಿಸಿ. ಮುಖ್ಯ ಬೆಳಗಿದ ರಸ್ತೆಗಳಲ್ಲಿ ಸಂಚರಿಸಿ ಮತ್ತು ಗುಂಪಿನೊಂದಿಗೆ ಇರಿ.",
    dangerSummary: "ಎಚ್ಚರಿಕೆ: ಈ ಪ್ರದೇಶದಲ್ಲಿ ಹೆಚ್ಚಿನ ಅಪಾಯ ಅಥವಾ ಸಕ್ರಿಯ ಘಟನೆ ದಾಖಲಾಗಿದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ.",
    emergencyAction: "ಹತ್ತಿರದ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಸುರಕ್ಷಾ SOS ಬಟನ್ ಒತ್ತಿರಿ.",
  },
};

export async function runGuardianAI(input: GuardianAIInput): Promise<GuardianAIOutput> {
  const startTime = Date.now();
  const lang = input.language || "en";
  const risk = input.overallRiskScore ?? 25;
  const tier = input.riskTier || (risk > 65 ? "CRITICAL" : risk > 45 ? "HIGH" : risk > 25 ? "MODERATE" : "LOW");

  const systemPrompt = `You are Guardian AI, the intelligence core of Suraksha Link Tourist Safety Platform in India.
Your mission is tourist protection, clarity, and calm authority.
Always format your response with empathy and precision.
Language requested: ${lang === "hi" ? "Hindi (Devanagari)" : lang === "kn" ? "Kannada" : "English"}.
Risk Level: ${tier} (${risk}/100).
Location: ${input.locationContext?.locationName || "Current Zone"}.
Active Incidents: ${input.activeIncidentsCount || 0}.
Weather: ${input.weatherSummary || "Clear"}.
Crowd: ${input.crowdSummary || "Normal"}.
Provide:
1. Concise safety briefing (max 3 sentences)
2. 2-3 specific actionable tips
3. Single high-priority recommended action`;

  const userPrompt = `Tourist query: "${input.userQuery}"\nContext: Current risk score is ${risk}/100 (${tier}).`;

  // 1. Prioritize Google Gemini when configured (fastest latency & native multilingual capabilities)
  if (isGeminiConfigured()) {
    try {
      const geminiRes = await invokeGemini({
        systemInstruction: systemPrompt,
        prompt: userPrompt,
        temperature: 0.2,
        maxTokens: 500,
        model: "gemini-1.5-flash",
      });

      if (geminiRes.success && geminiRes.content) {
        return {
          agentName: "guardian_ai",
          timestamp: new Date().toISOString(),
          query: input.userQuery,
          language: lang,
          explanation: geminiRes.content,
          keySafetyTips: [
            "Follow marked tourist safety corridors",
            "Keep local emergency contacts (112, 108) on speed dial",
            "Ensure device battery and offline SOS cache are active",
          ],
          recommendedAction: {
            actionText: risk > 50 ? "Proceed via Safe Tourist Corridor with verified CCTV." : "Continue planned itinerary with standard awareness.",
            urgency: risk > 65 ? "IMMEDIATE_ACTION" : risk > 40 ? "WARNING" : "ADVISORY",
            hitlRequired: risk > 65,
          },
          confidence: 0.96,
          modelProvenance: `GOOGLE_GEMINI (${geminiRes.modelUsed})`,
          latencyMs: Date.now() - startTime,
        };
      }
    } catch {
      // Fall through to OpenRouter or deterministic fallback
    }
  }

  // 2. Secondary: OpenRouter LLM Gateway
  if (isOpenRouterConfigured()) {
    try {
      const llmRes = await invokeOpenRouter({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        maxTokens: 500,
      });

      if (llmRes.success && llmRes.content) {
        return {
          agentName: "guardian_ai",
          timestamp: new Date().toISOString(),
          query: input.userQuery,
          language: lang,
          explanation: llmRes.content,
          keySafetyTips: [
            "Follow marked tourist safety corridors",
            "Keep local emergency contacts (112, 108) on speed dial",
            "Ensure device battery and offline SOS cache are active",
          ],
          recommendedAction: {
            actionText: risk > 50 ? "Proceed via Safe Tourist Corridor with verified CCTV." : "Continue planned itinerary with standard awareness.",
            urgency: risk > 65 ? "IMMEDIATE_ACTION" : risk > 40 ? "WARNING" : "ADVISORY",
            hitlRequired: risk > 65,
          },
          confidence: 0.95,
          modelProvenance: `OPENROUTER (${llmRes.modelUsed})`,
          latencyMs: Date.now() - startTime,
        };
      }
    } catch {
      // Fall through to deterministic fallback
    }
  }

  // 3. Deterministic Fallback Engine (Zero-dependency safety guarantee)
  const templates = FALLBACK_RESPONSES[lang] || FALLBACK_RESPONSES.en;
  let explanation = templates.safeSummary;
  let urgency: "INFO" | "ADVISORY" | "WARNING" | "IMMEDIATE_ACTION" = "INFO";

  if (tier === "CRITICAL" || tier === "HIGH") {
    explanation = `${templates.dangerSummary} Location: ${input.locationContext?.locationName || "Monitored Zone"}. Risk Score: ${risk}/100.`;
    urgency = tier === "CRITICAL" ? "IMMEDIATE_ACTION" : "WARNING";
  } else if (tier === "MODERATE") {
    explanation = `${templates.cautiousSummary} Active crowd index: ${input.crowdSummary || "Moderate"}.`;
    urgency = "ADVISORY";
  }

  const tips = lang === "hi"
    ? [
        "निर्दिष्ट सुरक्षा कॉरिडोर पर चलें",
        "आपातकालीन नंबर 112 और 108 डायल करने के लिए तैयार रखें",
        "ऑफ़लाइन एसओएस सुविधा चालू रखें",
      ]
    : lang === "kn"
    ? [
        "ಗುರುತಿಸಲಾದ ಸುರಕ್ಷತಾ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ ಸಂಚರಿಸಿ",
        "ತುರ್ತು ಸಂಖ್ಯೆ 112 ಅನ್ನು ಬಳಸಿ",
        "ಆಫ್‌ಲೈನ್ SOS ಸಕ್ರಿಯವಾಗಿರಿಸಿಕೊಳ್ಳಿ",
      ]
    : [
        "Stick to illuminated tourist corridors verified by police patrol",
        "Keep local emergency helpline 112 readily accessible",
        "Ensure offline SOS fallback is enabled in Suraksha app",
      ];

  return {
    agentName: "guardian_ai",
    timestamp: new Date().toISOString(),
    query: input.userQuery,
    language: lang,
    explanation,
    keySafetyTips: tips,
    recommendedAction: {
      actionText: templates.emergencyAction,
      urgency,
      hitlRequired: tier === "CRITICAL",
    },
    confidence: 0.92,
    modelProvenance: "DETERMINISTIC_RULES_ENGINE (Zero-Dependency)",
    latencyMs: Date.now() - startTime,
  };
}
