import { describe, expect, it } from "vitest";
import { dispatchEmergencyAlert, getAlertDeduplicationStatus, isResendConfigured } from "./resend-alerts";

describe("Resend Alerts Service", () => {
  it("should report unconfigured when RESEND_API_KEY is not set", () => {
    delete process.env.RESEND_API_KEY;
    expect(isResendConfigured()).toBe(false);
  });

  it("should record pending status and not crash when API key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const testId = `INC-TEST-${Date.now()}`;

    const result = await dispatchEmergencyAlert({
      incidentId: testId,
      location: { lat: 12.9716, lng: 77.5946, zoneName: "Cubbon Park" },
      severity: "HIGH",
      incidentType: "Medical",
      description: "Test emergency alert",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("PENDING_KEY");
    expect(result.message).toContain("Resend API key not configured");
  });

  it("should deduplicate consecutive alerts for the same incident", async () => {
    delete process.env.RESEND_API_KEY;
    const testId = `INC-DEDUP-${Date.now()}`;

    // First alert
    await dispatchEmergencyAlert({
      incidentId: testId,
      location: { lat: 12.9716, lng: 77.5946 },
      severity: "HIGH",
      incidentType: "Theft",
      description: "First alert",
    });

    // Immediate second alert
    const secondResult = await dispatchEmergencyAlert({
      incidentId: testId,
      location: { lat: 12.9716, lng: 77.5946 },
      severity: "HIGH",
      incidentType: "Theft",
      description: "Duplicate alert",
    });

    expect(secondResult.status).toBe("RATE_LIMITED");

    const status = getAlertDeduplicationStatus(testId);
    expect(status.dispatched).toBe(true);
    expect(status.rateLimited).toBe(true);
  });
});
