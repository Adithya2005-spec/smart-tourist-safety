import { supabase, isSupabaseConfigured } from "./supabase";

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "tourist" | "authority" | "admin";
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface TouristProfile {
  id: string;
  user_id: string;
  nationality: string;
  travel_id: string;
  current_trip_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  user_id?: string;
  incident_type: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESPONDER_ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

export interface LocationShare {
  id: string;
  user_id: string;
  shared_with: string;
  started_at: string;
  expires_at: string;
  status: "ACTIVE" | "EXPIRED" | "STOPPED";
}

// ----------------------------------------------------------------------
// PERSISTENT FALLBACK STORAGE KEYS (Survives Refresh, Logout, Login)
// ----------------------------------------------------------------------
const STORAGE_PREFIX = "suraksha_db_";

function getLocalStore<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn("Local storage write error:", err);
  }
}

// ----------------------------------------------------------------------
// SUPABASE AUTH & PROFILE SERVICE
// ----------------------------------------------------------------------

export async function getCurrentUser() {
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
  const savedUser = getLocalStore<{ id: string; email: string } | null>("current_user", {
    id: "usr-demo-001",
    email: "tourist@surakshalink.in",
  });
  return savedUser;
}

export async function getProfile(authUserId: string): Promise<Profile | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetch profile error:", error.message);
    }
    if (data) return data as Profile;
  }

  // Fallback persistent profiles
  const profiles = getLocalStore<Profile[]>("profiles", [
    {
      id: "prof-001",
      auth_user_id: "usr-demo-001",
      full_name: "Priya Sharma",
      email: "tourist@surakshalink.in",
      phone: "+91 98765 43210",
      role: "tourist",
      preferred_language: "en",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  return profiles.find((p) => p.auth_user_id === authUserId) || profiles[0] || null;
}

export async function upsertProfile(profile: Partial<Profile> & { auth_user_id: string }): Promise<Profile> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(profile, { onConflict: "auth_user_id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert profile error:", error.message);
    } else if (data) {
      return data as Profile;
    }
  }

  // Local persistent fallback
  const profiles = getLocalStore<Profile[]>("profiles", []);
  const existingIndex = profiles.findIndex((p) => p.auth_user_id === profile.auth_user_id);
  const now = new Date().toISOString();

  let updated: Profile;
  if (existingIndex >= 0) {
    updated = { ...profiles[existingIndex], ...profile, updated_at: now };
    profiles[existingIndex] = updated;
  } else {
    updated = {
      id: `prof-${Date.now()}`,
      auth_user_id: profile.auth_user_id,
      full_name: profile.full_name || "New Traveller",
      email: profile.email || "user@example.com",
      phone: profile.phone || "+91 90000 00000",
      role: profile.role || "tourist",
      preferred_language: profile.preferred_language || "en",
      created_at: now,
      updated_at: now,
    };
    profiles.push(updated);
  }
  setLocalStore("profiles", profiles);
  return updated;
}

// ----------------------------------------------------------------------
// EMERGENCY CONTACTS SERVICE
// ----------------------------------------------------------------------

export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) return data as EmergencyContact[];
  }

  // Persistent fallback
  const contacts = getLocalStore<EmergencyContact[]>("emergency_contacts", [
    {
      id: "ec-101",
      user_id: userId,
      name: "Rajesh Sharma (Father)",
      phone: "+91 98111 22233",
      relationship: "Father",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "ec-102",
      user_id: userId,
      name: "Anita Sharma (Mother)",
      phone: "+91 98444 55566",
      relationship: "Mother",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
  return contacts.filter((c) => c.user_id === userId || userId === "usr-demo-001");
}

export async function createEmergencyContact(contact: Omit<EmergencyContact, "id" | "created_at" | "updated_at">): Promise<EmergencyContact> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .insert({ ...contact, created_at: now, updated_at: now })
      .select()
      .single();

    if (!error && data) return data as EmergencyContact;
  }

  const contacts = getLocalStore<EmergencyContact[]>("emergency_contacts", []);
  const newContact: EmergencyContact = {
    ...contact,
    id: `ec-${Date.now()}`,
    created_at: now,
    updated_at: now,
  };
  contacts.unshift(newContact);
  setLocalStore("emergency_contacts", contacts);
  return newContact;
}

export async function deleteEmergencyContact(contactId: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", contactId);
    if (!error) return true;
  }

  const contacts = getLocalStore<EmergencyContact[]>("emergency_contacts", []);
  const filtered = contacts.filter((c) => c.id !== contactId);
  setLocalStore("emergency_contacts", filtered);
  return true;
}

// ----------------------------------------------------------------------
// SOS INCIDENTS SERVICE
// ----------------------------------------------------------------------

export async function createSOSIncident(incident: Omit<Incident, "id" | "created_at" | "status">): Promise<Incident> {
  const now = new Date().toISOString();
  const newIncidentData = {
    ...incident,
    status: "ACTIVE" as const,
    created_at: now,
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("incidents")
      .insert(newIncidentData)
      .select()
      .single();

    if (!error && data) return data as Incident;
  }

  const incidents = getLocalStore<Incident[]>("incidents", []);
  const created: Incident = {
    ...newIncidentData,
    id: `INC-SUB-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  incidents.unshift(created);
  setLocalStore("incidents", incidents);
  return created;
}

export async function getActiveIncidentsForAuthority(): Promise<Incident[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) return data as Incident[];
  }

  // Persistent fallback
  return getLocalStore<Incident[]>("incidents", [
    {
      id: "INC-9021",
      incident_type: "WOMEN_SAFETY_PANIC",
      description: "SOS panic alert triggered near Silk Board Junction, Bengaluru.",
      latitude: 12.9172,
      longitude: 77.6228,
      severity: "HIGH",
      status: "ACTIVE",
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "INC-8412",
      incident_type: "UNUSUAL_GEOZONE_EXIT",
      description: "Tourist deviated from registered safe travel corridor.",
      latitude: 12.9716,
      longitude: 77.5946,
      severity: "MEDIUM",
      status: "ACKNOWLEDGED",
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      acknowledged_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
  ]);
}

export async function updateIncidentStatus(incidentId: string, status: Incident["status"]): Promise<Incident | null> {
  const now = new Date().toISOString();
  const updatePayload: Partial<Incident> = { status };
  if (status === "ACKNOWLEDGED") updatePayload.acknowledged_at = now;
  if (status === "RESOLVED") updatePayload.resolved_at = now;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("incidents")
      .update(updatePayload)
      .eq("id", incidentId)
      .select()
      .maybeSingle();

    if (!error && data) return data as Incident;
  }

  const incidents = getLocalStore<Incident[]>("incidents", []);
  const index = incidents.findIndex((i) => i.id === incidentId);
  if (index >= 0) {
    incidents[index] = { ...incidents[index], ...updatePayload };
    setLocalStore("incidents", incidents);
    return incidents[index];
  }
  return null;
}

// ----------------------------------------------------------------------
// LOCATION SHARING SERVICE
// ----------------------------------------------------------------------

export async function createLocationShare(userId: string, sharedWith: string, durationHours: number = 2): Promise<LocationShare> {
  const startedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();

  const shareData = {
    user_id: userId,
    shared_with: sharedWith,
    started_at: startedAt,
    expires_at: expiresAt,
    status: "ACTIVE" as const,
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("location_shares")
      .insert(shareData)
      .select()
      .single();

    if (!error && data) return data as LocationShare;
  }

  const shares = getLocalStore<LocationShare[]>("location_shares", []);
  const newShare: LocationShare = {
    ...shareData,
    id: `ls-${Date.now()}`,
  };
  shares.unshift(newShare);
  setLocalStore("location_shares", shares);
  return newShare;
}
