import { describe, expect, it } from "vitest";
import { calculateSafeRoutes, isGoogleMapsConfigured } from "./maps";

describe("Maps & Route Safety Service", () => {
  it("computes safe routes between two coordinates using internal geographic model", async () => {
    const origin = { lat: 12.9716, lng: 77.5946 }; // Bengaluru Central
    const destination = { lat: 12.9816, lng: 77.6046 }; // MG Road corridor

    const res = await calculateSafeRoutes({
      origin,
      destination,
      avoidHighRiskZones: true,
      mode: "WALKING",
    });

    expect(res.origin).toEqual(origin);
    expect(res.destination).toEqual(destination);
    expect(res.routes.length).toBeGreaterThanOrEqual(2);
    expect(res.recommendedRouteId).toBeDefined();

    const recommended = res.routes.find((r) => r.id === res.recommendedRouteId);
    expect(recommended).toBeDefined();
    expect(recommended?.isRecommended).toBe(true);
    expect(recommended?.waypoints.length).toBeGreaterThan(0);
    expect(recommended?.totalDistanceKm).toBeGreaterThan(0);
  });

  it("identifies whether Google Maps API is configured based on environment", () => {
    const configured = isGoogleMapsConfigured();
    expect(typeof configured).toBe("boolean");
  });
});
