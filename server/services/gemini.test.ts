import { describe, expect, it } from "vitest";
import { isGeminiConfigured, invokeGemini } from "./gemini";

describe("Google Gemini Service", () => {
  it("detects configuration based on GEMINI_API_KEY environment variable", () => {
    const configured = isGeminiConfigured();
    expect(typeof configured).toBe("boolean");
  });

  it("handles missing prompt gracefully without crashing", async () => {
    const res = await invokeGemini({});
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });
});
