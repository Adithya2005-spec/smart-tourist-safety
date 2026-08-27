export type ExtendedRole = "TOURIST" | "AUTHORITY" | "POLICE" | "MEDICAL" | "RESPONDER" | "ADMIN";

export interface PermissionCheck {
  role: ExtendedRole;
  canViewIncidents: boolean;
  canDispatchResponders: boolean;
  canApproveActions: boolean;
  canSimulateFailures: boolean;
  canManagePolicies: boolean;
  canViewAuditLedger: boolean;
  agencyLabel: string;
}

export function getRolePermissions(role: ExtendedRole): PermissionCheck {
  switch (role) {
    case "POLICE":
      return {
        role,
        canViewIncidents: true,
        canDispatchResponders: true,
        canApproveActions: true,
        canSimulateFailures: false,
        canManagePolicies: false,
        canViewAuditLedger: true,
        agencyLabel: "State Police & Law Enforcement Command",
      };
    case "MEDICAL":
      return {
        role,
        canViewIncidents: true,
        canDispatchResponders: true,
        canApproveActions: true,
        canSimulateFailures: false,
        canManagePolicies: false,
        canViewAuditLedger: true,
        agencyLabel: "Emergency Medical & Triage Command",
      };
    case "RESPONDER":
      return {
        role,
        canViewIncidents: true,
        canDispatchResponders: false,
        canApproveActions: false,
        canSimulateFailures: false,
        canManagePolicies: false,
        canViewAuditLedger: false,
        agencyLabel: "Field First Responder Mobile Unit",
      };
    case "ADMIN":
      return {
        role,
        canViewIncidents: true,
        canDispatchResponders: true,
        canApproveActions: true,
        canSimulateFailures: true,
        canManagePolicies: true,
        canViewAuditLedger: true,
        agencyLabel: "System Administration & MLOps Governance",
      };
    case "AUTHORITY":
      return {
        role,
        canViewIncidents: true,
        canDispatchResponders: true,
        canApproveActions: true,
        canSimulateFailures: true,
        canManagePolicies: true,
        canViewAuditLedger: true,
        agencyLabel: "Unified Tourism Safety Authority Command",
      };
    case "TOURIST":
    default:
      return {
        role: "TOURIST",
        canViewIncidents: false,
        canDispatchResponders: false,
        canApproveActions: false,
        canSimulateFailures: false,
        canManagePolicies: false,
        canViewAuditLedger: false,
        agencyLabel: "Verified Traveller Portal",
      };
  }
}
