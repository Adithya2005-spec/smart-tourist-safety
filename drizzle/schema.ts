import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Core domain tables for Suraksha Link Safety Intelligence Platform

export const riskZones = mysqlTable("risk_zones", {
  id: varchar("id", { length: 64 }).primaryKey(),
  stateId: varchar("stateId", { length: 16 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  radiusM: int("radiusM").notNull(),
  score: int("score").notNull(),
  severity: mysqlEnum("severity", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]).notNull(),
  incidentCount: int("incidentCount").default(0).notNull(),
  trendPercentage: int("trendPercentage").default(0).notNull(),
  contributingFactor: text("contributingFactor"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const incidents = mysqlTable("incidents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  touristId: varchar("touristId", { length: 128 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  severity: mysqlEnum("severity", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]).notNull(),
  priorityScore: int("priorityScore").notNull(),
  status: mysqlEnum("status", ["SOS_CREATED", "ACKNOWLEDGED", "RESPONDER_ASSIGNED", "RESPONDER_EN_ROUTE", "ON_SCENE", "RESOLVED", "VERIFIED"]).notNull(),
  locationName: text("locationName").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),
  riskScore: int("riskScore").notNull(),
  responderId: varchar("responderId", { length: 64 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledgedAt"),
  assignedAt: timestamp("assignedAt"),
  enRouteAt: timestamp("enRouteAt"),
  onSceneAt: timestamp("onSceneAt"),
  resolvedAt: timestamp("resolvedAt"),
  verifiedAt: timestamp("verifiedAt"),
});

export const incidentEvents = mysqlTable("incident_events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  incidentId: varchar("incidentId", { length: 64 }).notNull(),
  actor: varchar("actor", { length: 128 }).notNull(),
  actorType: mysqlEnum("actorType", ["TOURIST", "AUTHORITY", "RESPONDER", "SYSTEM"]).notNull(),
  previousState: varchar("previousState", { length: 64 }),
  newState: varchar("newState", { length: 64 }).notNull(),
  detail: text("detail").notNull(),
  metadata: text("metadata"), // JSON string
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const responders = mysqlTable("responders", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 128 }).notNull(),
  availability: mysqlEnum("availability", ["AVAILABLE", "BUSY", "OFFLINE"]).default("AVAILABLE").notNull(),
  activeAssignments: int("activeAssignments").default(0).notNull(),
  currentLat: text("currentLat"),
  currentLng: text("currentLng"),
  phone: varchar("phone", { length: 32 }),
});

export const auditEvents = mysqlTable("audit_events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  incidentId: varchar("incidentId", { length: 64 }).notNull(),
  actor: varchar("actor", { length: 128 }).notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  hash: varchar("hash", { length: 128 }).notNull(),
  previousHash: varchar("previousHash", { length: 128 }).notNull(),
  transactionId: varchar("transactionId", { length: 128 }),
  integrityStatus: mysqlEnum("integrityStatus", ["VERIFIED", "TAMPERED", "PENDING"]).default("VERIFIED").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const locationShares = mysqlTable("location_shares", {
  id: varchar("id", { length: 64 }).primaryKey(),
  touristId: varchar("touristId", { length: 128 }).notNull(),
  sharedWith: varchar("sharedWith", { length: 255 }).notNull(),
  startTime: timestamp("startTime").defaultNow().notNull(),
  expiryTime: timestamp("expiryTime").notNull(),
  status: mysqlEnum("status", ["ACTIVE", "EXPIRED", "REVOKED"]).default("ACTIVE").notNull(),
});

export type RiskZoneRecord = typeof riskZones.$inferSelect;
export type IncidentRecord = typeof incidents.$inferSelect;
export type IncidentEventRecord = typeof incidentEvents.$inferSelect;
export type ResponderRecord = typeof responders.$inferSelect;
export type AuditEventRecord = typeof auditEvents.$inferSelect;
export type LocationShareRecord = typeof locationShares.$inferSelect;

// ========================================================
// MULTI-AGENT PLATFORM ADDITIVE TABLES
// ========================================================

export const agentRuns = mysqlTable("agent_runs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  intent: varchar("intent", { length: 64 }).notNull(),
  query: text("query").notNull(),
  status: mysqlEnum("status", ["PLANNING", "RUNNING", "COMPLETED", "FAILED"]).default("COMPLETED").notNull(),
  priority: varchar("priority", { length: 32 }).notNull(),
  agentsInvoked: text("agentsInvoked").notNull(), // JSON string array
  executionPlan: text("executionPlan"), // JSON
  validationSummary: text("validationSummary"), // JSON
  overallRiskScore: int("overallRiskScore"),
  riskTier: varchar("riskTier", { length: 32 }),
  guardianSummary: text("guardianSummary"),
  executionMs: int("executionMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const riskAssessments = mysqlTable("risk_assessments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  targetEntityId: varchar("targetEntityId", { length: 128 }).notNull(), // touristId or incidentId or zoneId
  targetType: varchar("targetType", { length: 32 }).notNull(),
  overallRiskScore: int("overallRiskScore").notNull(),
  riskTier: varchar("riskTier", { length: 32 }).notNull(),
  confidenceScore: int("confidenceScore").notNull(),
  factors: text("factors"), // JSON breakdown
  evidenceSummary: text("evidenceSummary"), // JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const alertEvents = mysqlTable("alert_events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  incidentId: varchar("incidentId", { length: 64 }).notNull(),
  severity: varchar("severity", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["SENT", "RATE_LIMITED", "PENDING_KEY", "SIMULATED", "ERROR"]).notNull(),
  recipientCount: int("recipientCount").default(1).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const humanDecisions = mysqlTable("human_decisions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  incidentId: varchar("incidentId", { length: 64 }).notNull(),
  operatorId: varchar("operatorId", { length: 128 }).notNull(),
  decision: varchar("decision", { length: 64 }).notNull(), // APPROVE_DISPATCH, OVERRIDE_ROUTE, DISMISS, ESCALATE
  reason: text("reason"),
  aiRecommendationSnapshot: text("aiRecommendationSnapshot"), // JSON
  decidedAt: timestamp("decidedAt").defaultNow().notNull(),
});

export type AgentRunRecord = typeof agentRuns.$inferSelect;
export type RiskAssessmentRecord = typeof riskAssessments.$inferSelect;
export type AlertEventRecord = typeof alertEvents.$inferSelect;
export type HumanDecisionRecord = typeof humanDecisions.$inferSelect;