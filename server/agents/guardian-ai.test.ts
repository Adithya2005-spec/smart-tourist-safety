import { describe, expect, it } from "vitest";
import { runGuardianAI } from "./guardian-ai";

describe("Guardian AI Safety Agent", () => {
  it("generates deterministic English safety guidance for low-risk context", async () => {
    const output = await runGuardianAI({
      userQuery: "Is Cubbon park safe for an evening walk?",
      language: "en",
      overallRiskScore: 20,
      riskTier: "LOW",
      locationContext: { locationName: "Cubbon Park", state: "Karnataka" },
    });

    expect(output.agentName).toBe("guardian_ai");
    expect(output.language).toBe("en");
    expect(output.explanation).toContain("stable conditions");
    expect(output.keySafetyTips.length).toBeGreaterThanOrEqual(3);
    expect(output.recommendedAction.urgency).toBe("INFO");
    expect(output.recommendedAction.hitlRequired).toBe(false);
  });

  it("escalates to IMMEDIATE_ACTION and requires HITL review for critical risk tier", async () => {
    const output = await runGuardianAI({
      userQuery: "I feel unsafe near the alleyway",
      language: "en",
      overallRiskScore: 82,
      riskTier: "CRITICAL",
      locationContext: { locationName: "Commercial St Alley", state: "Karnataka" },
    });

    expect(output.recommendedAction.urgency).toBe("IMMEDIATE_ACTION");
    expect(output.recommendedAction.hitlRequired).toBe(true);
    expect(output.explanation).toContain("High risk indicators detected");
    expect(output.explanation).toContain("Commercial St Alley");
  });

  it("provides localized Hindi response when language is set to hi", async () => {
    const output = await runGuardianAI({
      userQuery: "क्या यह क्षेत्र सुरक्षित है?",
      language: "hi",
      overallRiskScore: 35,
      riskTier: "MODERATE",
    });

    expect(output.language).toBe("hi");
    expect(output.explanation).toContain("सुरक्षा");
    expect(output.keySafetyTips[0]).toContain("सुरक्षा");
  });

  it("provides localized Kannada response when language is set to kn", async () => {
    const output = await runGuardianAI({
      userQuery: "ಇಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿದೆಯೇ?",
      language: "kn",
      overallRiskScore: 25,
      riskTier: "LOW",
    });

    expect(output.language).toBe("kn");
    expect(output.explanation).toContain("ಸುರಕ್ಷಾ");
    expect(output.keySafetyTips[0]).toContain("ಸುರಕ್ಷತಾ");
  });
});
