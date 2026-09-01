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
  getSeverityBand,
  calculateIncidentPriority,
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

import { computeDigitalTwinState, defaultSimulationParams, type DigitalTwinSimulationParams } from "@/lib/digital-twin-engine";
import { computeRiskForecast, computeRiskPropagation } from "@/lib/risk-forecasting-engine";
import { evaluateJourneyState, evaluatePreSOSWarning, type JourneyState } from "@/lib/journey-engine";
import { routeOperationExecution } from "@/lib/edge-cloud-engine";
import { createLocationPrivacyPolicy, generateCoarseLocation } from "@/lib/privacy-location-engine";
import {
  createSOSIncident,
  updateIncidentStatus,
  createEmergencyContact,
  deleteEmergencyContact,
  createLocationShare,
  upsertProfile,
} from "@/lib/supabase-service";
import { evaluateCounterfactualScenarios, generateRiskExplanationTimeline } from "@/lib/explainable-ai-engine";
import { computeZonalCoverage, generatePrePositioningRecommendations } from "@/lib/responder-coverage-engine";
import { buildIncidentEvidenceGraph, findSimilarIncidents } from "@/lib/knowledge-graph";
import { getRolePermissions, type ExtendedRole } from "@/lib/rbac-engine";
import { activeSafetyPolicies, evaluateSafetyPolicies } from "@/lib/policy-engine";
import { evaluateAIConfidence } from "@/lib/confidence-ai-engine";
import { createHitlRecommendation, processHitlDecision, type HitlRecommendation } from "@/lib/hitl-engine";
import { deterministicReplayScenario } from "@/lib/incident-replay-engine";
import { generateIncidentForensicsReport } from "@/lib/forensics-engine";
import { discoverSafetyPatterns } from "@/lib/pattern-discovery-engine";
import { getFederatedLearningState } from "@/lib/federated-learning-engine";
import { getModelLifecycleInfo } from "@/lib/model-lifecycle-engine";
import { evaluateConnectivityLadder } from "@/lib/connectivity-ladder";
import { defaultChaosState, evaluateChaosResilience, type ChaosSimulationState } from "@/lib/chaos-simulator";
import { evaluateSafetyCorridors } from "@/lib/safety-corridors-engine";
import { calculateResilienceScore } from "@/lib/resilience-score-engine";
import { generateNextBestActions } from "@/lib/next-best-action-engine";
import { defaultWhatIfParameters, computeWhatIfSimulation, type WhatIfScenarioParameters, type SimulatedStatePrediction } from "@/lib/what-if-simulator";
import { computeScenarioComparison } from "@/lib/scenario-comparison";
import { computeResourceOptimizer } from "@/lib/resource-optimizer";
import { computeCascadingFailureAnalysis } from "@/lib/cascading-failure-engine";
import { computeIncidentPriorities } from "@/lib/incident-priority-engine";
import { initialSnapshots, type ScenarioSnapshot } from "@/lib/scenario-snapshots";

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
  // Upgrade properties
  simulationParams: DigitalTwinSimulationParams;
  updateSimulationParams: (params: Partial<DigitalTwinSimulationParams>) => void;
  digitalTwin: ReturnType<typeof computeDigitalTwinState>;
  riskForecast: ReturnType<typeof computeRiskForecast>;
  riskPropagation: ReturnType<typeof computeRiskPropagation>;
  journeyState: JourneyState;
  preSOSWarning: ReturnType<typeof evaluatePreSOSWarning>;
  locationPrivacy: ReturnType<typeof createLocationPrivacyPolicy>;
  riskTimeline: ReturnType<typeof generateRiskExplanationTimeline>;
  counterfactuals: ReturnType<typeof evaluateCounterfactualScenarios>;
  zonalCoverage: ReturnType<typeof computeZonalCoverage>;
  prePositioningRecs: ReturnType<typeof generatePrePositioningRecommendations>;
  getEvidenceGraph: (incident: Incident) => ReturnType<typeof buildIncidentEvidenceGraph>;
  getSimilarIncidents: (incident: Incident) => ReturnType<typeof findSimilarIncidents>;
  routeOperation: (operationName: string) => ReturnType<typeof routeOperationExecution>;
  // Architecture Upgrade properties
  rbacPermissions: ReturnType<typeof getRolePermissions>;
  activePolicies: typeof activeSafetyPolicies;
  policyResults: ReturnType<typeof evaluateSafetyPolicies>;
  confidenceAI: ReturnType<typeof evaluateAIConfidence>;
  hitlRecommendations: HitlRecommendation[];
  processHitlAction: (recommendation: HitlRecommendation, decision: "APPROVED" | "REJECTED" | "MODIFIED", operatorId: string, notes?: string) => void;
  replayScenario: typeof deterministicReplayScenario;
  forensicsReport: ReturnType<typeof generateIncidentForensicsReport>;
  discoveredPatterns: ReturnType<typeof discoverSafetyPatterns>;
  federatedLearningState: ReturnType<typeof getFederatedLearningState>;
  modelLifecycleInfo: ReturnType<typeof getModelLifecycleInfo>;
  connectivityLadder: ReturnType<typeof evaluateConnectivityLadder>;
  chaosState: ChaosSimulationState;
  toggleChaosState: (key: keyof ChaosSimulationState) => void;
  resilienceResponse: ReturnType<typeof evaluateChaosResilience>;
  safetyCorridors: ReturnType<typeof evaluateSafetyCorridors>;
  resilienceScore: ReturnType<typeof calculateResilienceScore>;
  nextBestActions: ReturnType<typeof generateNextBestActions>;
  // What-If Digital Twin Upgrade
  whatIfParams: WhatIfScenarioParameters;
  updateWhatIfParams: (params: Partial<WhatIfScenarioParameters>) => void;
  simulatedPrediction: SimulatedStatePrediction;
  scenarioDeltas: ReturnType<typeof computeScenarioComparison>;
  resourceAllocations: ReturnType<typeof computeResourceOptimizer>;
  cascadingAnalysis: ReturnType<typeof computeCascadingFailureAnalysis>;
  prioritizedIncidents: ReturnType<typeof computeIncidentPriorities>;
  scenarioSnapshots: ScenarioSnapshot[];
  saveSnapshot: (name: string) => void;
  loadSnapshot: (snapshot: ScenarioSnapshot) => void;
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
      severity: getSeverityBand(rz.score),
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
      { id: "STATE-EMERGENCY", name: "National Emergency SOS (Demo)", phone: defaultStateObj.emergency.police, relationship: "Central Police/Fire/Medical", primary: true },
      { id: "STATE-WOMEN", name: "Women Safety Helpline (Demo)", phone: defaultStateObj.emergency.womenHelpline, relationship: "Women Safeguard Desk", primary: false },
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
      severity: getSeverityBand(rz.score),
      band: rz.band,
      incidentCount: rz.incidentCount,
      updatedAt: new Date().toISOString(),
      factor: rz.factor,
    }));

    const stateContacts: EmergencyContact[] = [
      { id: "STATE-POLICE", name: `${targetState.name} Tourist Police`, phone: targetState.emergency.touristPolice, relationship: "Official Helpline", primary: true },
      { id: "STATE-EMERGENCY", name: "National Emergency SOS (Demo)", phone: targetState.emergency.police, relationship: "Central Police/Fire/Medical", primary: true },
      { id: "STATE-WOMEN", name: "Women Safety Helpline (Demo)", phone: targetState.emergency.womenHelpline, relationship: "Women Safeguard Desk", primary: false },
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

    upsertProfile({
      auth_user_id: session.digitalId,
      full_name: session.fullName,
      email: session.email,
      phone: session.phone,
      role: role === "AUTHORITY" ? "authority" : role === "ADMIN" ? "admin" : "tourist",
    }).catch((err) => console.warn("Supabase upsert profile notice:", err));

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

    upsertProfile({
      auth_user_id: session.digitalId,
      full_name: session.fullName,
      email: session.email,
      phone: session.phone,
      role: userData.role === "AUTHORITY" ? "authority" : userData.role === "ADMIN" ? "admin" : "tourist",
    }).catch((err) => console.warn("Supabase upsert profile notice:", err));

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
    const incidentSev = risk.score >= 80 ? "CRITICAL" : risk.score >= 65 ? "HIGH" : "MEDIUM";
    const incident: Incident = {
      id: makeId("INC"),
      type,
      severity: incidentSev,
      priorityScore: calculateIncidentPriority(incidentSev, risk.score, type, 0),
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

    // Persist to Supabase PostgreSQL database
    createSOSIncident({
      incident_type: type,
      description: notes || `SOS Alert triggered in ${activeState.name}`,
      latitude: state.location.lat,
      longitude: state.location.lng,
      severity: incidentSev === "CRITICAL" ? "CRITICAL" : incidentSev === "HIGH" ? "HIGH" : "MEDIUM",
    }).catch((err) => console.warn("Supabase SOS save background notice:", err));

    setState((previous) =>
      isOffline
        ? { ...previous, queuedIncidents: [incident, ...previous.queuedIncidents] }
        : { ...previous, incidents: [incident, ...previous.incidents] },
    );
    return incident;
  };

  const transitionIncident = (incidentId: string, status: IncidentStatus, actor: string, detail?: string) => {
    const mappedStatus = status === "RESOLVED" ? "RESOLVED" : status === "VERIFIED" ? "ACKNOWLEDGED" : status === "ASSIGNED" ? "RESPONDER_ASSIGNED" : "IN_PROGRESS";
    updateIncidentStatus(incidentId, mappedStatus).catch((err) => console.warn("Supabase update incident status notice:", err));

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

  const [simParams, setSimParams] = useState<DigitalTwinSimulationParams>(defaultSimulationParams);

  const digitalTwin = useMemo(
    () => computeDigitalTwinState({ areaName: `${activeState.name} District` }, simParams, state.zones, seedResponders),
    [activeState.name, simParams, state.zones]
  );

  const riskForecast = useMemo(
    () => computeRiskForecast(risk.score, state.incidents.length, new Date().getHours()),
    [risk.score, state.incidents.length]
  );

  const riskPropagation = useMemo(
    () => computeRiskPropagation(state.zones, state.incidents),
    [state.zones, state.incidents]
  );

  const journeyState = useMemo(() => {
    const hasSOS = state.incidents.some((i) => i.status !== "RESOLVED");
    if (hasSOS) return "SOS" as const;
    return evaluateJourneyState(risk.score, false, !state.online, state.incidents.length).nextState;
  }, [risk.score, state.incidents, state.online]);

  const activeZone = useMemo(
    () => state.zones.find((z) => z.score >= 50) || state.zones[0],
    [state.zones]
  );

  const preSOSWarning = useMemo(
    () => evaluatePreSOSWarning(risk.score, false, !state.online, state.incidents, activeZone),
    [risk.score, state.online, state.incidents, activeZone]
  );

  const locationPrivacy = useMemo(
    () => createLocationPrivacyPolicy(state.location, state.incidents.some((i) => i.status !== "RESOLVED")),
    [state.location, state.incidents]
  );

  const riskTimeline = useMemo(
    () => generateRiskExplanationTimeline(risk.score),
    [risk.score]
  );

  const counterfactuals = useMemo(
    () => evaluateCounterfactualScenarios(risk.score),
    [risk.score]
  );

  const zonalCoverage = useMemo(
    () => computeZonalCoverage(state.zones, seedResponders),
    [state.zones]
  );

  const prePositioningRecs = useMemo(
    () => generatePrePositioningRecommendations(state.zones, seedResponders),
    [state.zones]
  );

  const [chaosState, setChaosState] = useState<ChaosSimulationState>(defaultChaosState);
  const [hitlRecs, setHitlRecs] = useState<HitlRecommendation[]>([
    createHitlRecommendation(
      "Reposition Responder Unit R01 to MG Road",
      "Assign Unit R01 (Officer Rajesh Kumar) to Zone 01 MG Road",
      "R01",
      "Officer Rajesh Kumar",
      "High density & elevated zonal risk score"
    ),
  ]);

  const rbacPermissions = useMemo(() => getRolePermissions(state.role), [state.role]);

  const policyResults = useMemo(
    () => evaluateSafetyPolicies(risk.score, simParams.touristDensityMultiplier, "GOOD", state.queuedIncidents.length, state.online),
    [risk.score, simParams.touristDensityMultiplier, state.queuedIncidents.length, state.online]
  );

  const confidenceAI = useMemo(() => evaluateAIConfidence(risk.score, state.online), [risk.score, state.online]);

  const activeInc = state.incidents[0] || seedIncidents[0];
  const forensicsReport = useMemo(() => generateIncidentForensicsReport(activeInc), [activeInc]);

  const discoveredPatterns = useMemo(() => discoverSafetyPatterns(), []);
  const federatedLearningState = useMemo(() => getFederatedLearningState(), []);
  const modelLifecycleInfo = useMemo(() => getModelLifecycleInfo(), []);

  const connectivityLadder = useMemo(
    () => evaluateConnectivityLadder(state.online && !chaosState.cloudOutage, 38, state.queuedIncidents.length),
    [state.online, chaosState.cloudOutage, state.queuedIncidents.length]
  );

  const resilienceResponse = useMemo(() => evaluateChaosResilience(chaosState), [chaosState]);

  const safetyCorridors = useMemo(() => evaluateSafetyCorridors(state.location), [state.location]);

  const resilienceScore = useMemo(
    () => calculateResilienceScore(risk.score, digitalTwin.connectivityQualityPercentage, 85, digitalTwin.averageResponseTimeMinutes),
    [risk.score, digitalTwin]
  );

  const nextBestActions = useMemo(() => generateNextBestActions(1, state.incidents.length), [state.incidents.length]);

  const [whatIfParams, setWhatIfParams] = useState<WhatIfScenarioParameters>(defaultWhatIfParameters);
  const [scenarioSnapshots, setScenarioSnapshots] = useState<ScenarioSnapshot[]>(initialSnapshots);

  const simulatedPrediction = useMemo(
    () => computeWhatIfSimulation(whatIfParams, risk.score),
    [whatIfParams, risk.score]
  );

  const scenarioDeltas = useMemo(
    () => computeScenarioComparison(risk.score, 85, digitalTwin.averageResponseTimeMinutes, resilienceScore.resilienceScore, simulatedPrediction),
    [risk.score, digitalTwin, resilienceScore, simulatedPrediction]
  );

  const resourceAllocations = useMemo(() => computeResourceOptimizer(), []);
  const cascadingAnalysis = useMemo(
    () => computeCascadingFailureAnalysis(chaosState.internetOutage || chaosState.cloudOutage, chaosState.responderUnavailable, chaosState.roadClosure),
    [chaosState]
  );

  const prioritizedIncidents = useMemo(() => computeIncidentPriorities(state.incidents), [state.incidents]);

  const saveSnapshot = (name: string) => {
    const newSnap: ScenarioSnapshot = {
      id: `SNAP-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      timestamp: new Date().toISOString(),
      modelVersion: "v1.4.2-risk-predictor",
      datasetVersion: "prototype-dataset-v3",
      parameters: { ...whatIfParams },
      prediction: { ...simulatedPrediction },
    };
    setScenarioSnapshots((prev) => [newSnap, ...prev]);
  };

  const loadSnapshot = (snapshot: ScenarioSnapshot) => {
    setWhatIfParams({ ...snapshot.parameters });
  };

  const toggleChaosState = (key: keyof ChaosSimulationState) => {
    setChaosState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const processHitlAction = (
    rec: HitlRecommendation,
    decision: "APPROVED" | "REJECTED" | "MODIFIED",
    operatorId: string,
    notes?: string
  ) => {
    const updated = processHitlDecision(rec, decision, operatorId, notes);
    setHitlRecs((prev) => prev.map((item) => (item.id === rec.id ? updated : item)));
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
    simulationParams: simParams,
    updateSimulationParams: (p) => setSimParams((prev) => ({ ...prev, ...p })),
    digitalTwin,
    riskForecast,
    riskPropagation,
    journeyState,
    preSOSWarning,
    locationPrivacy,
    riskTimeline,
    counterfactuals,
    zonalCoverage,
    prePositioningRecs,
    getEvidenceGraph: (inc) => buildIncidentEvidenceGraph(inc),
    getSimilarIncidents: (inc) => findSimilarIncidents(inc),
    routeOperation: (opName) =>
      routeOperationExecution(opName, {
        status: state.online && !chaosState.cloudOutage ? "ONLINE" : "OFFLINE",
        latencyMs: 38,
        lastSyncTimestamp: new Date().toISOString(),
        pendingEventsCount: state.queuedIncidents.length,
        failedSyncAttempts: 0,
        syncSuccessRatePercentage: 99.8,
      }),
    rbacPermissions,
    activePolicies: activeSafetyPolicies,
    policyResults,
    confidenceAI,
    hitlRecommendations: hitlRecs,
    processHitlAction,
    replayScenario: deterministicReplayScenario,
    forensicsReport,
    discoveredPatterns,
    federatedLearningState,
    modelLifecycleInfo,
    connectivityLadder,
    chaosState,
    toggleChaosState,
    resilienceResponse,
    safetyCorridors,
    resilienceScore,
    nextBestActions,
    whatIfParams,
    updateWhatIfParams: (p) => setWhatIfParams((prev) => ({ ...prev, ...p })),
    simulatedPrediction,
    scenarioDeltas,
    resourceAllocations,
    cascadingAnalysis,
    prioritizedIncidents,
    scenarioSnapshots,
    saveSnapshot,
    loadSnapshot,
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
    addContact: (contact) => {
      createEmergencyContact({
        user_id: state.userSession?.digitalId || "usr-demo-001",
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
      }).catch((err) => console.warn("Supabase add contact notice:", err));
      setState((previous) => ({ ...previous, contacts: [...previous.contacts, { ...contact, id: makeId("CONTACT") }] }));
    },
    deleteContact: (id) => {
      deleteEmergencyContact(id).catch((err) => console.warn("Supabase delete contact notice:", err));
      setState((previous) => ({ ...previous, contacts: previous.contacts.filter((contact) => contact.id !== id) }));
    },
    startSharing: (minutes) => {
      createLocationShare(state.userSession?.digitalId || "usr-demo-001", "Trusted Emergency Contacts & Authorities", minutes / 60)
        .catch((err) => console.warn("Supabase location share notice:", err));
      setState((previous) => ({ ...previous, sharingUntil: new Date(Date.now() + minutes * 60_000).toISOString() }));
    },
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
