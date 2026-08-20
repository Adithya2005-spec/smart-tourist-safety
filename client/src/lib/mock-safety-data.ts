import type { EmergencyContact, Incident, Responder, RiskZone, TravelProfile } from "./safety-engine";

export const touristProfile: TravelProfile = {
  touristId: "TOUR-1042",
  fullName: "Aarav Mehta",
  nationality: "Indian",
  visitWindow: "16–20 August 2026",
  accommodation: "Brigade Road, Bengaluru",
  verification: "VERIFIED",
};

export const seedZones: RiskZone[] = [
  {
    id: "ZONE-01",
    name: "MG Road Transit Corridor",
    center: { lat: 12.9753, lng: 77.6066 },
    radiusM: 420,
    score: 74,
    band: "DANGER",
    incidentCount: 8,
    updatedAt: "2026-08-20T03:20:00.000Z",
    factor: "Elevated recent activity",
  },
  {
    id: "ZONE-02",
    name: "Church Street Junction",
    center: { lat: 12.9764, lng: 77.6015 },
    radiusM: 310,
    score: 48,
    band: "CAUTION",
    incidentCount: 4,
    updatedAt: "2026-08-20T02:50:00.000Z",
    factor: "Crowd density after 20:00",
  },
  {
    id: "ZONE-03",
    name: "Cubbon Park Safety Point",
    center: { lat: 12.9767, lng: 77.5929 },
    radiusM: 360,
    score: 20,
    band: "SAFE",
    incidentCount: 0,
    updatedAt: "2026-08-20T03:10:00.000Z",
    factor: "Verified patrol presence",
  },
  {
    id: "ZONE-04",
    name: "Residency Road Approach",
    center: { lat: 12.9692, lng: 77.6099 },
    radiusM: 280,
    score: 63,
    band: "CAUTION",
    incidentCount: 6,
    updatedAt: "2026-08-20T03:05:00.000Z",
    factor: "Traffic and late-night incidents",
  },
];

export const seedContacts: EmergencyContact[] = [
  { id: "CONTACT-1", name: "Riya Mehta", phone: "+91 98765 10248", relationship: "Sister", primary: true },
  { id: "CONTACT-2", name: "Hotel reception", phone: "+91 80667 40010", relationship: "Accommodation", primary: false },
];

export const seedResponders: Responder[] = [
  { id: "UNIT-04", name: "Unit 04 · Central patrol", specialty: "Field response", availability: "AVAILABLE", eta: "4 min" },
  { id: "MED-02", name: "Med 02 · Ambulance liaison", specialty: "Medical support", availability: "AVAILABLE", eta: "7 min" },
  { id: "UNIT-11", name: "Unit 11 · Women safety cell", specialty: "Safeguarding", availability: "BUSY", eta: "12 min" },
];

export const seedIncidents: Incident[] = [
  {
    id: "INC-1024",
    type: "Suspicious activity",
    severity: "HIGH",
    status: "RESPONDING",
    location: "MG Road, Bengaluru",
    coordinate: { lat: 12.9757, lng: 77.6068 },
    riskScore: 74,
    createdAt: "2026-08-20T03:12:00.000Z",
    touristId: "TOUR-1042",
    responderId: "UNIT-04",
    responderName: "Unit 04 · Central patrol",
    audit: [
      { id: "AUD-1", actor: "TOUR-1042", action: "CREATED", detail: "SOS generated from edge safety layer", at: "2026-08-20T03:12:00.000Z" },
      { id: "AUD-2", actor: "AUTH-101", action: "VERIFIED", detail: "Command centre acknowledged alert", at: "2026-08-20T03:13:00.000Z" },
      { id: "AUD-3", actor: "AUTH-101", action: "ASSIGNED", detail: "Unit 04 assigned to incident", at: "2026-08-20T03:14:00.000Z" },
      { id: "AUD-4", actor: "UNIT-04", action: "RESPONDING", detail: "Responder accepted dispatch", at: "2026-08-20T03:15:00.000Z" },
    ],
  },
  {
    id: "INC-1021",
    type: "Medical",
    severity: "MEDIUM",
    status: "RESOLVED",
    location: "Church Street, Bengaluru",
    coordinate: { lat: 12.9761, lng: 77.6019 },
    riskScore: 48,
    createdAt: "2026-08-20T01:05:00.000Z",
    touristId: "TOUR-1036",
    responderName: "Med 02 · Ambulance liaison",
    resolvedAt: "2026-08-20T01:32:00.000Z",
    notes: "Visitor transferred to hotel care team.",
    audit: [
      { id: "AUD-5", actor: "TOUR-1036", action: "CREATED", detail: "Medical assistance requested", at: "2026-08-20T01:05:00.000Z" },
      { id: "AUD-6", actor: "AUTH-102", action: "RESOLVED", detail: "Case closed with care handoff", at: "2026-08-20T01:32:00.000Z", hash: "0x1f27a0c9…d2f4", integrity: "VERIFIED" },
    ],
  },
];
