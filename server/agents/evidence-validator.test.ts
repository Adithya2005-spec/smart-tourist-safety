import { describe, expect, it } from "vitest";
import { runEvidenceValidator, AgentOutput } from "./evidence-validator";

describe("Evidence Validation Agent", () => {
  it("should validate fresh agent outputs and return valid status", () => {
    const mockOutputs: AgentOutput[] = [
      {
        agentName: "weather",
        timestamp: new Date().toISOString(),
        dataMode: "SIMULATED",
        confidence: 0.9,
      },
      {
        agentName: "location",
        timestamp: new Date().toISOString(),
        dataMode: "LIVE",
        confidence: 0.95,
      },
    ];

    const result = runEvidenceValidator(mockOutputs, ["weather", "location"]);
    expect(result.agentName).toBe("evidence_validator");
    expect(result.overallValidity).toBe("VALID");
    expect(result.dataCompleteness).toBe(100);
    expect(result.trustScore).toBeGreaterThan(80);
  });

  it("should detect missing agents and adjust completeness score", () => {
    const mockOutputs: AgentOutput[] = [
      {
        agentName: "weather",
        timestamp: new Date().toISOString(),
        dataMode: "SIMULATED",
        confidence: 0.85,
      },
    ];

    const result = runEvidenceValidator(mockOutputs, ["weather", "incident", "crowd"]);
    expect(result.missingAgents).toContain("incident");
    expect(result.missingAgents).toContain("crowd");
    expect(result.dataCompleteness).toBeLessThan(100);
  });
});
