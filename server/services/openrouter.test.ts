import { describe, expect, it } from "vitest";
import { invokeOpenRouter, isOpenRouterConfigured } from "./openrouter";

describe("OpenRouter LLM Service", () => {
  it("should report unconfigured when OPENROUTER_API_KEY is not set", () => {
    delete process.env.OPENROUTER_API_KEY;
    expect(isOpenRouterConfigured()).toBe(false);
  });

  it("should gracefully degrade to fallback when API key is missing", async () => {
    delete process.env.OPENROUTER_API_KEY;
    const response = await invokeOpenRouter({
      messages: [{ role: "user", content: "Is this zone safe?" }],
    });

    expect(response.success).toBe(false);
    expect(response.fallbackUsed).toBe(true);
    expect(response.error).toContain("OPENROUTER_API_KEY is not configured");
  });
});
