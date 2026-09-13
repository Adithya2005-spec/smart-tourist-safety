/**
 * GOOGLE GEMINI AI SERVICE
 * High-speed, multilingual reasoning engine powered by Google Gemini (Gemini 2.0 / 1.5 Flash).
 * Directly connects to Google Generative Language REST API.
 * Provides bilingual & multilingual reasoning for Indian tourist safety.
 */

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiGenerateOptions {
  prompt?: string;
  messages?: GeminiMessage[];
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface GeminiResponse {
  success: boolean;
  content: string;
  modelUsed: string;
  latencyMs: number;
  error?: string;
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY || process.env.FIREBASE_API_KEY;
  return Boolean(key && key.trim().length > 5);
}

export async function invokeGemini(options: GeminiGenerateOptions): Promise<GeminiResponse> {
  const startTime = Date.now();
  const apiKey = (process.env.GEMINI_API_KEY || process.env.FIREBASE_API_KEY)?.trim();

  if (!apiKey) {
    return {
      success: false,
      content: "",
      modelUsed: "NONE",
      latencyMs: 0,
      error: "GEMINI_API_KEY is not configured.",
    };
  }

  const model = options.model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let contents: GeminiMessage[] = [];

  if (options.messages && options.messages.length > 0) {
    contents = options.messages;
  } else if (options.prompt) {
    contents = [
      {
        role: "user",
        parts: [{ text: options.prompt }],
      },
    ];
  } else {
    return {
      success: false,
      content: "",
      modelUsed: model,
      latencyMs: 0,
      error: "No prompt or messages provided.",
    };
  }

  const bodyPayload: any = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 0.3,
      maxOutputTokens: options.maxTokens ?? 800,
    },
  };

  if (options.systemInstruction) {
    bodyPayload.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    });

    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        success: false,
        content: "",
        modelUsed: model,
        latencyMs,
        error: `Gemini API Error ${res.status}: ${errText.slice(0, 200)}`,
      };
    }

    const data = await res.json();
    const textContent =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output ||
      "";

    return {
      success: true,
      content: textContent.trim(),
      modelUsed: model,
      latencyMs,
    };
  } catch (error: any) {
    return {
      success: false,
      content: "",
      modelUsed: model,
      latencyMs: Date.now() - startTime,
      error: error?.message || "Failed to reach Gemini endpoint.",
    };
  }
}
