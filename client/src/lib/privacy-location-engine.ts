import type { GeoPoint } from "./safety-engine";

export type LocationPrivacyMode = "EXACT" | "COARSE" | "EXPIRED";

export interface LocationPrivacyPolicy {
  currentMode: LocationPrivacyMode;
  userConsent: boolean;
  purpose: string;
  retentionWindowHours: number;
  expiresAt: string;
  exactCoordinates?: GeoPoint;
  coarseCoordinates?: GeoPoint;
  isSharingActive: boolean;
}

export function generateCoarseLocation(point: GeoPoint): GeoPoint {
  // Round to 2 decimal places (~1.1km grid precision) for privacy preservation
  return {
    lat: Math.round(point.lat * 100) / 100,
    lng: Math.round(point.lng * 100) / 100,
  };
}

export function createLocationPrivacyPolicy(
  exactPoint: GeoPoint,
  isEmergencyActive: boolean = false,
  sharingMinutes: number = 60
): LocationPrivacyPolicy {
  const mode: LocationPrivacyMode = isEmergencyActive ? "EXACT" : "COARSE";
  const now = Date.now();
  const expiresAt = new Date(now + sharingMinutes * 60_000).toISOString();

  return {
    currentMode: mode,
    userConsent: true,
    purpose: isEmergencyActive
      ? "Active Emergency SOS Dispatch & Responder Navigation"
      : "Contextual Zonal Risk Warning & Safe Route Guidance",
    retentionWindowHours: isEmergencyActive ? 72 : 24,
    expiresAt,
    exactCoordinates: isEmergencyActive ? exactPoint : undefined,
    coarseCoordinates: generateCoarseLocation(exactPoint),
    isSharingActive: true,
  };
}
