import { describe, expect, it } from "vitest";
import {
  detectStateFromCoordinates,
  haversineDistanceKm,
  INTER_STATE_TRANSIT_ROUTES,
} from "./inter-state-geofence";
import { getStateSuggestedQueries } from "./guardian-dynamic-prompts";
import { getStateById } from "./india-safety-data";

describe("Inter-State Geofence & Boundary Detection Engine", () => {
  it("should accurately detect Karnataka for Bengaluru coordinates", () => {
    const state = detectStateFromCoordinates(12.9716, 77.5946);
    expect(state.code).toBe("KA");
    expect(state.name).toBe("Karnataka");
  });

  it("should accurately detect Tamil Nadu for Chennai coordinates", () => {
    const state = detectStateFromCoordinates(13.0827, 80.2707);
    expect(state.code).toBe("TN");
    expect(state.name).toBe("Tamil Nadu");
  });

  it("should accurately detect Goa for Panaji coordinates", () => {
    const state = detectStateFromCoordinates(15.4989, 73.8278);
    expect(state.code).toBe("GA");
    expect(state.name).toBe("Goa");
  });

  it("should accurately detect Maharashtra for Mumbai coordinates", () => {
    const state = detectStateFromCoordinates(18.922, 72.8347);
    expect(state.code).toBe("MH");
    expect(state.name).toBe("Maharashtra");
  });

  it("should accurately detect Delhi for New Delhi coordinates", () => {
    const state = detectStateFromCoordinates(28.6139, 77.209);
    expect(state.code).toBe("DL");
    expect(state.name).toContain("Delhi");
  });

  it("should accurately detect Rajasthan for Jaipur coordinates", () => {
    const state = detectStateFromCoordinates(26.9124, 75.7873);
    expect(state.code).toBe("RJ");
    expect(state.name).toBe("Rajasthan");
  });

  it("should accurately detect Himachal Pradesh for Shimla coordinates", () => {
    const state = detectStateFromCoordinates(31.1048, 77.1734);
    expect(state.code).toBe("HP");
    expect(state.name).toBe("Himachal Pradesh");
  });

  it("should accurately detect Kerala for Kochi coordinates", () => {
    const state = detectStateFromCoordinates(9.9312, 76.2673);
    expect(state.code).toBe("KL");
    expect(state.name).toBe("Kerala");
  });

  it("should calculate Haversine distance between cities accurately", () => {
    // Bengaluru (12.9716, 77.5946) to Chennai (13.0827, 80.2707) is ~290-310 km
    const dist = haversineDistanceKm(12.9716, 77.5946, 13.0827, 80.2707);
    expect(dist).toBeGreaterThan(280);
    expect(dist).toBeLessThan(320);
  });

  it("should provide pre-configured transit routes across state boundaries", () => {
    expect(INTER_STATE_TRANSIT_ROUTES.length).toBeGreaterThanOrEqual(5);
    const kaToTn = INTER_STATE_TRANSIT_ROUTES.find((r) => r.fromState === "KA" && r.toState === "TN");
    expect(kaToTn).toBeDefined();
    expect(kaToTn?.destination.lat).toBeCloseTo(13.08, 1);
  });

  it("should dynamically generate state-specific Guardian AI prompts", () => {
    const rjState = getStateById("RJ");
    expect(rjState).toBeDefined();

    const enPrompts = getStateSuggestedQueries(rjState, "en");
    expect(enPrompts.length).toBeGreaterThanOrEqual(4);
    expect(enPrompts.some((p) => p.includes("Jaipur") || p.includes("Hawa Mahal"))).toBe(true);

    const hiPrompts = getStateSuggestedQueries(rjState, "hi");
    expect(hiPrompts.length).toBeGreaterThanOrEqual(4);
    expect(hiPrompts.some((p) => p.includes("जयपुर") || p.includes("हवा महल"))).toBe(true);

    const knPrompts = getStateSuggestedQueries(rjState, "kn");
    expect(knPrompts.length).toBeGreaterThanOrEqual(4);
    expect(knPrompts.some((p) => p.includes("ಜೈಪುರ") || p.includes("ಹವಾ ಮಹಲ್"))).toBe(true);
  });
});
