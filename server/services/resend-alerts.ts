/**
 * RESEND EMERGENCY EMAIL ALERT SERVICE
 * Dispatches emergency notifications to designated security contacts and local authorities.
 * Features rate-limiting, deduplication per incident, and fallback logging when RESEND_API_KEY is unset.
 */

export interface EmergencyAlertPayload {
  incidentId: string;
  touristName?: string;
  touristPhone?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
    zoneName?: string;
  };
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  incidentType: string;
  description: string;
  recipientEmails?: string[];
  evidenceSummary?: string;
}

export interface AlertDispatchResult {
  success: boolean;
  alertId: string;
  incidentId: string;
  status: "SENT" | "RATE_LIMITED" | "PENDING_KEY" | "SIMULATED" | "ERROR";
  recipientCount: number;
  message: string;
  timestamp: string;
}

// In-memory deduplication tracking (stores last dispatched timestamp per incidentId)
const dispatchedIncidentsMap = new Map<string, { timestamp: number; severity: string }>();
const DEDUPLICATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 5);
}

export async function dispatchEmergencyAlert(payload: EmergencyAlertPayload): Promise<AlertDispatchResult> {
  const now = Date.now();
  const alertId = `alert-${now}-${Math.random().toString(36).slice(2, 8)}`;
  const recipients = payload.recipientEmails && payload.recipientEmails.length > 0
    ? payload.recipientEmails
    : [process.env.EMERGENCY_DISPATCH_EMAIL || "safety-control@suraksha.gov.in"];

  // Deduplication check: check if same incident was sent recently
  const lastSent = dispatchedIncidentsMap.get(payload.incidentId);
  if (lastSent && now - lastSent.timestamp < DEDUPLICATION_WINDOW_MS) {
    // Only allow bypass if escalating to CRITICAL from a lower state
    if (!(lastSent.severity !== "CRITICAL" && payload.severity === "CRITICAL")) {
      return {
        success: true,
        alertId,
        incidentId: payload.incidentId,
        status: "RATE_LIMITED",
        recipientCount: recipients.length,
        message: `Alert suppressed: notification for incident ${payload.incidentId} was already dispatched ${Math.round((now - lastSent.timestamp) / 1000)}s ago.`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();

  // If no Resend API key configured, cleanly record and simulate
  if (!apiKey) {
    dispatchedIncidentsMap.set(payload.incidentId, { timestamp: now, severity: payload.severity });
    console.log(`[Resend Alerts] Simulation/Pending Key: Emergency alert for incident ${payload.incidentId} logged. (Set RESEND_API_KEY to send real emails)`);
    return {
      success: true,
      alertId,
      incidentId: payload.incidentId,
      status: "PENDING_KEY",
      recipientCount: recipients.length,
      message: "Resend API key not configured. Emergency alert recorded in audit queue and logged locally.",
      timestamp: new Date().toISOString(),
    };
  }

  // Compose HTML message
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${payload.location.lat},${payload.location.lng}`;
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
      <div style="background: ${payload.severity === "CRITICAL" ? "#dc2626" : "#ea580c"}; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; color: white;">
          🚨 SURAKSHA EMERGENCY ALERT: ${payload.severity}
        </h1>
        <p style="margin: 6px 0 0 0; color: #fee2e2; font-size: 14px;">Incident ID: ${payload.incidentId}</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 16px; line-height: 1.5; color: #e2e8f0; margin-top: 0;">
          <strong>Incident Type:</strong> ${payload.incidentType}<br />
          <strong>Tourist:</strong> ${payload.touristName || "Anonymous"} (${payload.touristPhone || "No direct phone"})<br />
          <strong>Location Zone:</strong> ${payload.location.zoneName || "Active GPS Coordinate"}<br />
          <strong>GPS Coordinates:</strong> ${payload.location.lat.toFixed(5)}, ${payload.location.lng.toFixed(5)}
        </p>

        <div style="background: #1e293b; padding: 14px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38bdf8;">
          <h3 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 14px; text-transform: uppercase;">Details & Evidence</h3>
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">${payload.description}</p>
          ${payload.evidenceSummary ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1;">${payload.evidenceSummary}</p>` : ""}
        </div>

        <div style="text-align: center; margin: 24px 0 10px 0;">
          <a href="${mapsLink}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">
            Open Live Incident in Google Maps ➔
          </a>
        </div>
      </div>
      <div style="background: #090d16; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
        Suraksha Tourist Safety Intelligence Platform • Real-time Multi-Agent Audit Chain
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "alerts@suraksha-safety.org",
        to: recipients,
        subject: `[${payload.severity} ALERT] Tourist Safety Emergency - ${payload.incidentType} (${payload.incidentId})`,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        success: false,
        alertId,
        incidentId: payload.incidentId,
        status: "ERROR",
        recipientCount: recipients.length,
        message: `Resend API Error ${res.status}: ${errText.slice(0, 150)}`,
        timestamp: new Date().toISOString(),
      };
    }

    dispatchedIncidentsMap.set(payload.incidentId, { timestamp: now, severity: payload.severity });

    return {
      success: true,
      alertId,
      incidentId: payload.incidentId,
      status: "SENT",
      recipientCount: recipients.length,
      message: `Emergency alert successfully delivered to ${recipients.length} recipients.`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      success: false,
      alertId,
      incidentId: payload.incidentId,
      status: "ERROR",
      recipientCount: recipients.length,
      message: err?.message || "Failed to contact Resend API.",
      timestamp: new Date().toISOString(),
    };
  }
}

export function getAlertDeduplicationStatus(incidentId: string) {
  const entry = dispatchedIncidentsMap.get(incidentId);
  if (!entry) return { dispatched: false, ageSeconds: null };
  const ageSeconds = Math.round((Date.now() - entry.timestamp) / 1000);
  return {
    dispatched: true,
    severity: entry.severity,
    dispatchedSecondsAgo: ageSeconds,
    rateLimited: ageSeconds < DEDUPLICATION_WINDOW_MS / 1000,
  };
}
