import { GeoPoint, Responder } from "../client/src/lib/safety-engine";
import { optimizeResponderAssignment } from "../client/src/lib/responder-engine";

export function getRecommendedRespondersBackend(
  incidentLocation: GeoPoint,
  responders: Responder[]
) {
  return optimizeResponderAssignment(incidentLocation, responders);
}
