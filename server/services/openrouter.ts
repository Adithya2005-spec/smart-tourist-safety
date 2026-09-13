/**
 * OPENROUTER LLM SERVICE GATEWAY
 * Secure, resilient bridge to OpenRouter models for conversational & explanatory safety agents.
 * Gracefully degrades to deterministic fallbacks when API key is unset or network fails.
 */

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterRequestOptions {
  model?: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface OpenRouterResponse {
  success: boolean;
  content: string;
  modelUsed: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  fallbackUsed: boolean;
  error?: string;
  latencyMs: number;
}

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-haiku";
const DEFAULT_TIMEOUT_MS = 15000;

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 5);
}

export async function invokeOpenRouter(options: OpenRouterRequestOptions): Promise<OpenRouterResponse> {
  const startTime = Date.now();
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    return {
      success: false,
      content: "",
      modelUsed: "none",
      fallbackUsed: true,
      error: "OPENROUTER_API_KEY is not configured. Using deterministic fallback engine.",
      latencyMs: Date.now() - startTime,
    };
  }

  const model = options.model || DEFAULT_MODEL;
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://suraksha-link.local",
        "X-Title": "Suraksha Tourist Safety Platform",
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 1024,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        success: false,
        content: "",
        modelUsed: model,
        fallbackUsed: true,
        error: `OpenRouter API HTTP ${res.status}: ${errText.slice(0, 120)}`,
        latencyMs: Date.now() - startTime,
      };
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "";

    return {
      success: true,
      content: reply,
      modelUsed: data?.model || model,
      usage: data?.usage
        ? {
            promptTokens: data.usage.prompt_tokens || 0,
            completionTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
          }
        : undefined,
      fallbackUsed: false,
      latencyMs: Date.now() - startTime,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isAbort = err.name === "AbortError";
    return {
      success: false,
      content: "",
      modelUsed: model,
      fallbackUsed: true,
      error: isAbort ? "Request to OpenRouter timed out." : (err?.message || "Network error contacting OpenRouter"),
      latencyMs: Date.now() - startTime,
    };
  }
}
