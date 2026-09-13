import { describe, expect, it } from "vitest";
import { classifyIntent, createExecutionPlan, determinePriority } from "./planner-agent";

describe("Safety Planner Agent", () => {
  it("should classify location safety queries accurately", () => {
    const intent = classifyIntent("Is Cubbon Park safe to visit tonight?");
    expect(intent).toBe("location_safety");
  });

  it("should classify weather queries accurately", () => {
    const intent = classifyIntent("What is the rainfall and weather forecast for Bengaluru?");
    expect(intent).toBe("weather_query");
  });

  it("should classify route queries accurately", () => {
    const intent = classifyIntent("What is the safest route directions to the hotel?");
    expect(intent).toBe("route_request");
  });

  it("should assign critical priority to SOS/emergency intents", () => {
    const priority = determinePriority("sos_support");
    expect(priority).toBe("critical");
  });

  it("should build a structured execution plan with parallel and sequential agents", () => {
    const plan = createExecutionPlan("Is MG Road safe right now?", {
      location: "12.9716,77.5946",
      stateId: "KA",
      language: "en",
    });

    expect(plan.requestId).toMatch(/^REQ-/);
    expect(plan.requiredAgents.length).toBeGreaterThan(0);
    expect(plan.sequentialAgents).toContain("evidence_validator");
    expect(plan.sequentialAgents).toContain("guardian_ai");
  });
});
