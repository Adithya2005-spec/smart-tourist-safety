import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedContacts, seedIncidents, seedResponders, seedZones, touristProfile } from "@/lib/mock-safety-data";
import { allIndianStates, getStateById, type IndianStateData } from "@/lib/india-safety-data";
import {
  assistantReply,
  canTransition,
  evaluateGeofences,
  incidentTransitionLabel,
  makeId,
  localRiskPredictionService,
  sha256,
  synchronizeQueuedIncidents,
  type EmergencyContact,
  type GeoPoint,
  type Incident,
  type IncidentStatus,
  type IncidentType,
  type Responder,
  type RiskPrediction,
  type RiskZone,
  type TravelProfile,
} from "@/lib/safety-engine";

export type DemoRole = "TOURIST" | "AUTHORITY" | "ADMIN";
export type Language = "en" | "hi" | "kn";

export interface UserSession {
  isAuthenticated: boolean;
  fullName: string;
  email: string;
  phone: string;
  role: DemoRole;
  stateId: string;
  stateName: string;
  digitalId: string;
  joinedDate: string;
}

type SafetyState = {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  online: boolean;
  setOnline: (online: boolean) => void;
  activeStateId: string;
  activeState: IndianStateData;
  setActiveState: (stateId: string) => void;
  allStates: IndianStateData[];
  userSession: UserSession;
  login: (emailOrPhone: string, role: DemoRole, fullName?: string) => void;
  logout: () => void;
  signup: (userData: {
    fullName: string;
    email: string;
    phone: string;
    role: DemoRole;
    stateId: string;
    nationality?: string;
    idType?: string;
    idNumber?: string;
  }) => void;
  zones: RiskZone[];
  incidents: Incident[];
  queuedIncidents: Incident[];
  travellerIncidents: Incident[];
  responders: Responder[];
  contacts: EmergencyContact[];
  location: GeoPoint;
  locationName: string;
  risk: RiskPrediction;
  activeGeofences: ReturnType<typeof evaluateGeofences>;
  pendingSyncCount: number;
  sharingUntil?: string;
  createIncident: (type: IncidentType, notes?: string, forceOffline?: boolean) => Incident;
  transitionIncident: (incidentId: string, status: IncidentStatus, actor: string, detail?: string) => void;
  assignResponder: (incidentId: string, responderId: string) => void;
  recordAudit: (incidentId: string) => Promise<void>;
  verifyAudit: (incidentId: string) => Promise<boolean>;
  setLocation: (location: GeoPoint, name?: string) => void;
  simulateHighRisk: () => void;
  syncQueue: () => void;
  addContact: (contact: Omit<EmergencyContact, "id">) => void;
  deleteContact: (id: string) => void;
  startSharing: (minutes: number) => void;
  stopSharing: () => void;
  guardianReply: (question: string) => string;
  profile: TravelProfile;
};

const SafetyContext = createContext<SafetyState | null>(null);
const STATE_KEY = "safety-portal-state-v2";

type Persisted = Pick<
  SafetyState,
  "role" | "language" | "online" | "activeStateId" | "zones" | "incidents" | "queuedIncidents" | "contacts" | "location" | "locationName" | "sharingUntil"
> & {
  userSession: UserSession;
  profile: TravelProfile;
};

const defaultSession: UserSession = {
  isAuthenticated: true,
  fullName: "Aarav Mehta",
  email: "aarav.mehta@tourist-safety.in",
  phone: "+91 98765 43210",
  role: "TOURIST",
  stateId: "KA",
  stateName: "Karnataka",
  digitalId: "SURAKSHA-IND-KA-2026-9042",
  joinedDate: "2026-08-16",
};

function seedState(): Persisted {
  const authorityDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demoRole") === "authority";
  const defaultStateObj = getStateById("KA") || allIndianStates[0];
  
  return {
    role: authorityDemo ? "AUTHORITY" : "TOURIST",
    language: "en",
    online: true,
    activeStateId: "KA",
    zones: defaultStateObj.riskZones.map((rz) => ({
      id: rz.id,
      name: rz.name,
      center: rz.center,
      radiusM: rz.radiusM,
      score: rz.score,
      band: rz.band,
      incidentCount: rz.incidentCount,
      updatedAt: new Date().toISOString(),
      factor: rz.factor,
    })),
    incidents: seedIncidents,
    queuedIncidents: [],
    contacts: [
      ...seedContacts,
      { id: "STATE-POLICE", name: `${defaultStateObj.name} Tourist Police`, phone: defaultStateObj.emergency.touristPolice, relationship: "Official Helpline", primary: true },
      { id: "STATE-EMERGENCY", name: "National Emergency Service (India)", phone: "112", relationship: "Central Police/Fire/Medical", primary: true },
      { id: "STATE-WOMEN", name: "Women Safety Helpline (India)", phone: defaultStateObj.emergency.womenHelpline, relationship: "Women Safeguard Desk", primary: false },
    ],
    location: defaultStateObj.defaultLocation,
    locationName: defaultStateObj.defaultLocationName,
    sharingUntil: undefined,
    userSession: defaultSession,
    profile: touristProfile,
  };
}

function loadState(): Persisted {
  if (typeof window === "undefined") return seedState();
  try {
    const saved = localStorage.getItem(STATE_KEY);
    const state: Persisted = saved ? { ...seedState(), ...JSON.parse(saved) } : seedState();
    
    // Ensure state ID is valid
    if (!getStateById(state.activeStateId)) {
      state.activeStateId = "KA";
    }

    const authorityDemo = new URLSearchParams(window.location.search).get("demoRole") === "authority";
    return authorityDemo ? { ...state, role: "AUTHORITY" } : state;
  } catch {
    return seedState();
  }
}

export function SafetyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(loadState);

  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  const activeState = useMemo(() => {
    return getStateById(state.activeStateId) || allIndianStates[0];
  }, [state.activeStateId]);

  const risk = useMemo(
    () =>
      localRiskPredictionService.predict({
        historicalIncidentCount: 6,
        recentIncidentCount: 5,
        severity: 7,
        touristDensity: 6,
        hour: 21,
        historicalRisk: 54,
      }),
    [state.activeStateId, state.location],
  );

  const activeGeofences = useMemo(() => evaluateGeofences(state.location, state.zones), [state.location, state.zones]);
  const pendingSyncCount = state.queuedIncidents.length;

  const setActiveState = (stateId: string) => {
    const targetState = getStateById(stateId);
    if (!targetState) return;

    const stateZones: RiskZone[] = targetState.riskZones.map((rz) => ({
      id: rz.id,
      name: rz.name,
      center: rz.center,
      radiusM: rz.radiusM,
      score: rz.score,
      band: rz.band,
      incidentCount: rz.incidentCount,
      updatedAt: new Date().toISOString(),
      factor: rz.factor,
    }));

    const stateContacts: EmergencyContact[] = [
      { id: "STATE-POLICE", name: `${targetState.name} Tourist Police`, phone: targetState.emergency.touristPolice, relationship: "Official Helpline", primary: true },
      { id: "STATE-EMERGENCY", name: "National Emergency Service (India)", phone: "112", relationship: "Central Police/Fire/Medical", primary: true },
      { id: "STATE-WOMEN", name: "Women Safety Helpline", phone: targetState.emergency.womenHelpline, relationship: "Women Safeguard Desk", primary: false },
      { id: "STATE-AMBULANCE", name: `${targetState.name} Medical First Aid`, phone: targetState.emergency.ambulance, relationship: "Ambulance Network", primary: false },
    ];

    setState((prev) => ({
      ...prev,
      activeStateId: targetState.id,
      location: targetState.defaultLocation,
      locationName: targetState.defaultLocationName,
      zones: stateZones,
      contacts: [
        ...stateContacts,
        ...prev.contacts.filter((c) => !c.id.startsWith("STATE-")),
      ],
      profile: {
        ...prev.profile,
        accommodation: `${targetState.capital}, ${targetState.name}`,
      },
    }));
  };

  const login = (emailOrPhone: string, role: DemoRole, fullName?: string) => {
    const name = fullName || (emailOrPhone.includes("@") ? emailOrPhone.split("@")[0].replace(".", " ").toUpperCase() : "Verified User");
    const session: UserSession = {
      isAuthenticated: true,
      fullName: name,
      email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@tourist-safety.in`,
      phone: emailOrPhone.includes("@") ? "+91 98765 43210" : emailOrPhone,
      role,
      stateId: state.activeStateId,
      stateName: activeState.name,
      digitalId: `SURAKSHA-IND-${state.activeStateId}-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setState((prev) => ({
      ...prev,
      role,
      userSession: session,
      profile: {
        ...prev.profile,
        fullName: name,
        touristId: session.digitalId,
      },
    }));
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      userSession: {
        ...defaultSession,
        isAuthenticated: false,
        fullName: "Guest User",
      },
    }));
  };

  const signup = (userData: {
    fullName: string;
    email: string;
    phone: string;
    role: DemoRole;
    stateId: string;
    nationality?: string;
    idType?: string;
    idNumber?: string;
  }) => {
    const targetState = getStateById(userData.stateId) || activeState;
    const session: UserSession = {
      isAuthenticated: true,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      stateId: targetState.id,
      stateName: targetState.name,
      digitalId: `SURAKSHA-IND-${targetState.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    const newProfile: TravelProfile = {
      touristId: session.digitalId,
      fullName: userData.fullName,
      nationality: userData.nationality || "Indian",
      visitWindow: "2026 Season Verified",
      accommodation: `${targetState.capital}, ${targetState.name}`,
      verification: "VERIFIED",
    };

    setState((prev) => ({
      ...prev,
      role: userData.role,
      activeStateId: targetState.id,
      userSession: session,
      profile: newProfile,
    }));

    setActiveState(targetState.id);
  };

  const createIncident = (type: IncidentType, notes?: string, forceOffline?: boolean) => {
    const isOffline = forceOffline ?? !state.online;
    const now = new Date().toISOString();
    const incident: Incident = {
      id: makeId("INC"),
      type,
      severity: risk.score >= 80 ? "CRITICAL" : risk.score >= 65 ? "HIGH" : "MEDIUM",
      status: "CREATED",
      location: `${state.locationName} (${activeState.name})`,
      coordinate: state.location,
      riskScore: risk.score,
      createdAt: now,
      touristId: state.profile.touristId,
      notes,
      audit: [
        {
          id: makeId("AUD"),
          actor: state.profile.touristId,
          action: isOffline ? "PENDING_SYNC" : "CREATED",
          detail: isOffline ? "SOS saved in the local edge queue" : `SOS created through Suraksha Link portal in ${activeState.name}`,
          at: now,
        },
      ],
    };
    setState((previous) =>
      isOffline
        ? { ...previous, queuedIncidents: [incident, ...previous.queuedIncidents] }
        : { ...previous, incidents: [incident, ...previous.incidents] },
    );
    return incident;
  };

  const transitionIncident = (incidentId: string, status: IncidentStatus, actor: string, detail?: string) => {
    setState((previous) => ({
      ...previous,
      incidents: previous.incidents.map((incident) => {
        if (incident.id !== incidentId || !canTransition(incident.status, status)) return incident;
        const at = new Date().toISOString();
        return {
          ...incident,
          status,
          resolvedAt: status === "RESOLVED" ? at : incident.resolvedAt,
          audit: [...incident.audit, { id: makeId("AUD"), actor, action: status, detail: detail ?? incidentTransitionLabel(status), at }],
        };
      }),
    }));
  };

  const assignResponder = (incidentId: string, responderId: string) => {
    const responder = seedResponders.find((item) => item.id === responderId);
    if (!responder) return;
    setState((previous) => ({
      ...previous,
      incidents: previous.incidents.map((incident) => {
        if (incident.id !== incidentId || incident.status !== "VERIFIED") return incident;
        const at = new Date().toISOString();
        return {
          ...incident,
          status: "ASSIGNED",
          responderId,
          responderName: responder.name,
          audit: [...incident.audit, { id: makeId("AUD"), actor: "AUTH-101", action: "ASSIGNED", detail: `${responder.name} assigned`, at }],
        };
      }),
    }));
  };

  const recordAudit = async (incidentId: string) => {
    const incident = state.incidents.find((item) => item.id === incidentId);
    if (!incident || incident.status !== "RESOLVED") return;
    const canonical = JSON.stringify({
      id: incident.id,
      status: incident.status,
      resolvedAt: incident.resolvedAt,
      audit: incident.audit.map(({ actor, action, at }) => ({ actor, action, at })),
    });
    const hash = await sha256(canonical);
    setState((previous) => ({
      ...previous,
      incidents: previous.incidents.map((item) =>
        item.id === incidentId
          ? {
              ...item,
              audit: [
                ...item.audit,
                {
                  id: makeId("AUD"),
                  actor: "AUDIT-SVC",
                  action: "BLOCKCHAIN_AUDIT",
                  detail: "Hash anchored to Pan-India EVM audit simulation layer",
                  at: new Date().toISOString(),
                  hash,
                  integrity: "VERIFIED",
                },
              ],
            }
          : item,
      ),
    }));
  };

  const verifyAudit = async (incidentId: string) => {
    const incident = state.incidents.find((item) => item.id === incidentId);
    return Boolean(incident?.audit.some((entry) => entry.integrity === "VERIFIED" && entry.hash));
  };

  const syncQueue = () => {
    if (!state.online) return;
    setState((previous) => ({
      ...previous,
      incidents: [...synchronizeQueuedIncidents(previous.queuedIncidents), ...previous.incidents],
      queuedIncidents: [],
    }));
  };

  const guardianReply = (question: string) => {
    const q = question.toLowerCase();
    
    // Check if question asks about specific states
    const foundState = allIndianStates.find(
      (s) => q.includes(s.name.toLowerCase()) || q.includes(s.capital.toLowerCase()) || s.popularDestinations.some((d) => q.includes(d.toLowerCase())),
    );

    const targetState = foundState || activeState;

    if (q.includes("emergency") || q.includes("police") || q.includes("helpline") || q.includes("call") || q.includes("number")) {
      return `Emergency Helplines for ${targetState.name}:\n• Police / Central Emergency: 112\n• ${targetState.name} Tourist Police: ${targetState.emergency.touristPolice}\n• Women Helpline: ${targetState.emergency.womenHelpline}\n• Medical / Ambulance: ${targetState.emergency.ambulance}\n• Disaster Management: ${targetState.emergency.disasterManagement}`;
    }

    if (q.includes("advisory") || q.includes("rule") || q.includes("permit") || q.includes("safe") || q.includes("caution")) {
      const adv = targetState.advisories.join("\n• ");
      const dos = targetState.dosAndDonts.dos.join("\n• ");
      const donts = targetState.dosAndDonts.donts.join("\n• ");
      return `Safety Advisories & Guidelines for ${targetState.name}:\n• ${adv}\n\nRecommended Do's:\n• ${dos}\n\nImportant Don'ts:\n• ${donts}`;
    }

    if (q.includes("destination") || q.includes("place") || q.includes("visit") || q.includes("spot") || q.includes("tour")) {
      return `Top Safe Tourist Hotspots in ${targetState.name}:\n• ${targetState.popularDestinations.join("\n• ")}\n\nWeather alert: ${targetState.weatherAlert || "Normal seasonal conditions."}`;
    }

    // Default intelligent assistant fallback
    const base = assistantReply(question, risk, state.zones);
    return `${base}\n\n[Active Territory: ${targetState.name} · Local Police: ${targetState.emergency.touristPolice} · 112]`;
  };

  const value: SafetyState = {
    ...state,
    activeState,
    allStates: allIndianStates,
    userSession: state.userSession || defaultSession,
    travellerIncidents: [...state.queuedIncidents, ...state.incidents],
    responders: seedResponders.map((responder) => ({
      ...responder,
      availability: state.incidents.some((incident) => incident.responderId === responder.id && incident.status !== "RESOLVED")
        ? ("BUSY" as const)
        : responder.availability,
    })),
    risk,
    activeGeofences,
    pendingSyncCount,
    setRole: (role) => setState((previous) => ({ ...previous, role })),
    setLanguage: (language) => setState((previous) => ({ ...previous, language })),
    setOnline: (online) => setState((previous) => ({ ...previous, online })),
    setActiveState,
    login,
    logout,
    signup,
    createIncident,
    transitionIncident,
    assignResponder,
    recordAudit,
    verifyAudit,
    setLocation: (location, name) => setState((previous) => ({ ...previous, location, locationName: name ?? previous.locationName })),
    simulateHighRisk: () => {
      const dangerZone = state.zones.find((z) => z.band === "DANGER") || state.zones[0];
      if (dangerZone) {
        setState((previous) => ({
          ...previous,
          location: dangerZone.center,
          locationName: `${dangerZone.name}, ${activeState.name}`,
        }));
      }
    },
    syncQueue,
    addContact: (contact) => setState((previous) => ({ ...previous, contacts: [...previous.contacts, { ...contact, id: makeId("CONTACT") }] })),
    deleteContact: (id) => setState((previous) => ({ ...previous, contacts: previous.contacts.filter((contact) => contact.id !== id) })),
    startSharing: (minutes) => setState((previous) => ({ ...previous, sharingUntil: new Date(Date.now() + minutes * 60_000).toISOString() })),
    stopSharing: () => setState((previous) => ({ ...previous, sharingUntil: undefined })),
    guardianReply,
  };

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (!context) throw new Error("useSafety must be used within SafetyProvider");
  return context;
}
