import { describe, expect, it } from "vitest";
import { canTransition, evaluateGeofences, localRiskPredictionService, predictRisk, synchronizeQueuedIncidents, validateAuditTrail } from "./safety-engine";
import { seedZones } from "./mock-safety-data";

describe("edge safety engine", () => {
  it("detects a position within the MG Road risk geofence using the local Haversine implementation", () => {
    const matches = evaluateGeofences({ lat: 12.9753, lng: 77.6066 }, seedZones);
    expect(matches[0]?.zone.id).toBe("ZONE-01");
    expect(matches[0]?.distanceM).toBeLessThanOrEqual(matches[0]?.zone.radiusM ?? 0);
  });

  it("produces an explainable high-risk prediction for elevated synthetic inputs", () => {
    const result = predictRisk({ historicalIncidentCount: 6, recentIncidentCount: 5, severity: 7, touristDensity: 6, hour: 21, historicalRisk: 54 });
    expect(result.band).toBe("DANGER");
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.factors).toContain("Recent incident activity");
    expect(localRiskPredictionService.predict({ historicalIncidentCount: 6, recentIncidentCount: 5, severity: 7, touristDensity: 6, hour: 21, historicalRisk: 54 })).toEqual(result);
  });

  it("enforces the incident lifecycle transition order", () => {
    expect(canTransition("CREATED", "VERIFIED")).toBe(true);
    expect(canTransition("VERIFIED", "ASSIGNED")).toBe(true);
    expect(canTransition("ASSIGNED", "RESPONDING")).toBe(true);
    expect(canTransition("RESPONDING", "RESOLVED")).toBe(true);
    expect(canTransition("CREATED", "RESOLVED")).toBe(false);
  });

  it("accepts timestamp-ordered audit records and rejects malformed audit entries", () => {
    const valid = [
      { id: "AUD-1", actor: "TOUR-1042", action: "CREATED", detail: "SOS created", at: "2026-08-20T03:12:00.000Z" },
      { id: "AUD-2", actor: "AUTH-101", action: "VERIFIED", detail: "Authority review", at: "2026-08-20T03:13:00.000Z" },
    ];
    expect(validateAuditTrail(valid)).toBe(true);
    expect(validateAuditTrail([{ ...valid[0], at: "not-a-time" }])).toBe(false);
    expect(validateAuditTrail([])).toBe(false);
  });

  it("promotes queued edge incidents only after synchronization and clears the pending marker", () => {
    const [synchronized] = synchronizeQueuedIncidents([{
      id: "INC-EDGE-1",
      type: "Medical",
      severity: "HIGH",
      status: "CREATED",
      location: "Cached local point",
      coordinate: { lat: 12.9753, lng: 77.6066 },
      riskScore: 74,
      createdAt: "2026-08-20T03:20:00.000Z",
      touristId: "TOUR-1042",
      audit: [{ id: "AUD-Q1", actor: "TOUR-1042", action: "PENDING_SYNC", detail: "SOS saved in local queue", at: "2026-08-20T03:20:00.000Z" }],
    }], "2026-08-20T03:21:00.000Z");
    expect(synchronized.audit.some((entry) => entry.action === "PENDING_SYNC")).toBe(false);
    expect(synchronized.audit.at(-1)?.action).toBe("CREATED");
    expect(validateAuditTrail(synchronized.audit)).toBe(true);
  });
});
