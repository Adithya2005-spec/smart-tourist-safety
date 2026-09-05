export interface KnowledgeDocument {
  id: string;
  category: "EMERGENCY_POLICY" | "STATE_SAFETY" | "DIGITAL_TWIN" | "SYSTEM_ARCH" | "ML_GOVERNANCE" | "OPERATIONAL_GUIDE" | "ENVIRONMENTAL_ADVISORY";
  title: string;
  tags: string[];
  content: string;
}

export const ragKnowledgeBase: KnowledgeDocument[] = [
  {
    id: "KNOW-ENV-01",
    category: "ENVIRONMENTAL_ADVISORY",
    title: "National Disaster Management Authority (NDMA) Heavy Rainfall Advisory",
    tags: ["weather", "rainfall", "rain", "flood", "storm", "aws", "environmental", "monsoon"],
    content:
      "Official NDMA Protocol: During heavy rainfall (>35mm/hr) or flash flood warnings, tourists should avoid mountain passes, river banks, and unpaved hill roads. When nearby AWS weather stations report a deteriorating trend or continuous rain acceleration over 30 minutes, tourists are advised to pause outdoor travel, seek solid shelter, and select recommended alternative low-risk routes.",
  },
  {
    id: "KNOW-ENV-02",
    category: "ENVIRONMENTAL_ADVISORY",
    title: "AWS Telemetry vs RAG Knowledge Integration Standard",
    tags: ["aws", "telemetry", "sensor", "confidence", "isolation", "disagreement", "rag"],
    content:
      "Suraksha Link distinguishes between LIVE SENSOR TELEMETRY (real-time temperature, rainfall, pressure, wind) and RAG KNOWLEDGE ADVISORIES (official NDMA/IMD protocols). In the event of a flagged AWS hardware anomaly (e.g. single station reporting 180mm rain while nearby stations report 14mm), the sensor isolation model drops the suspicious sensor from tourist risk scoring while maintaining RAG safety guidance.",
  },
  {
    id: "KNOW-POLICY-01",
    category: "EMERGENCY_POLICY",
    title: "National Emergency Escalation Protocol",
    tags: ["sos", "escalation", "police", "112", "responder", "priority"],
    content:
      "For any SOS tagged with HIGH or CRITICAL severity, the system automatically assigns the nearest available Tourist Police or Central Emergency Unit within a 5km radius. If no unit responds within 180 seconds, the incident is escalated to the District Command Officer for manual intervention and priority override.",
  },
  {
    id: "KNOW-POLICY-02",
    category: "EMERGENCY_POLICY",
    title: "Women Safety & Special Helpline Dispatch Rules",
    tags: ["women", "helpline", "safe-corridor", "night", "desk"],
    content:
      "Incidents involving harassment, night-time isolation, or female travelers trigger immediate dispatch of specialized Women Safeguard Desks (1091). Safety corridor monitoring is auto-enabled for the tourist's live location sharing until resolution.",
  },
  {
    id: "KNOW-STATE-01",
    category: "STATE_SAFETY",
    title: "Pan-India 36 State & UT Helpline Standards",
    tags: ["pan-india", "state", "helpline", "police", "ambulance", "disaster"],
    content:
      "Suraksha Link supports all 28 States and 8 UTs. Central Emergency SOS is 112 across India. Tourist police helplines vary by state (e.g. Karnataka Tourist Police: +91 80 2294 2222, Goa Tourist Police: +91 832 242 8600, Delhi Police: 112). All numbers are locally cached on-device for offline dialing.",
  },
  {
    id: "KNOW-TWIN-01",
    category: "DIGITAL_TWIN",
    title: "Safety Digital Twin Spatial Mechanics",
    tags: ["digital twin", "spatial", "resilience", "simulation", "what-if"],
    content:
      "The Safety Digital Twin is a real-time spatial model representing tourist density, active incidents, responder field coordinates, road closure factors, and cellular signal quality. Overall zonal resilience (0-100) is calculated as a composite of responder-to-incident ratio (40%), open road availability (30%), and connectivity strength (30%).",
  },
  {
    id: "KNOW-TWIN-02",
    category: "DIGITAL_TWIN",
    title: "What-If Simulator & Delta Calculation Engine",
    tags: ["what-if", "simulator", "density", "delta", "response time", "prediction"],
    content:
      "The What-If Simulation Engine allows command officers to test hypothetical scenarios (e.g., doubling tourist density, 50% responder availability loss, or road blockages). The engine calculates real-time delta indicators (ΔRisk, ΔResponse Time, ΔResilience) compared against the live operational baseline without mutating production data.",
  },
  {
    id: "KNOW-ARCH-01",
    category: "SYSTEM_ARCH",
    title: "System Crash Resilience & Edge Data Persistence",
    tags: ["crash", "fault tolerance", "edge", "offline", "indexeddb", "localstorage"],
    content:
      "Suraksha Link uses an offline-first edge queue architecture. Unsynced SOS broadcasts and GPS traces are instantly saved to browser LocalStorage and IndexedDB. In the event of a browser crash or server reboot, queued incidents persist safely and auto-flush to central servers as soon as connectivity resumes.",
  },
  {
    id: "KNOW-ARCH-02",
    category: "SYSTEM_ARCH",
    title: "Blockchain Tamper-Evident Audit Ledger",
    tags: ["blockchain", "sha-256", "audit", "tamper", "integrity", "evm"],
    content:
      "All incident state transitions and operator actions generate SHA-256 cryptographic hashes anchored into an EVM-compatible append-only audit ledger. Even if a central database fails or is restored from backup, audit event hashes remain immutable and independently verifiable.",
  },
  {
    id: "KNOW-ML-01",
    category: "ML_GOVERNANCE",
    title: "Risk Engine & Temporal ML Forecasting",
    tags: ["ml", "risk", "temporal", "forecast", "xgboost", "brier", "shap"],
    content:
      "The risk prediction model evaluates current telemetry alongside rolling temporal lag features (incident frequency, 3-hour rolling counts, density trends, time of day). Model health is continuously monitored via KS Feature Drift statistics and Brier Probability Calibration scores. Feature attributions are rendered using SHAP-style importance rankings.",
  },
  {
    id: "KNOW-ML-02",
    category: "ML_GOVERNANCE",
    title: "Human-in-the-Loop (HITL) Action Governance",
    tags: ["hitl", "human-in-the-loop", "approval", "nba", "recommendation"],
    content:
      "AI models generate Next Best Action (NBA) recommendations, but critical emergency actions (such as dispatching responder units or re-routing emergency corridors) CANNOT execute automatically. They strictly require explicit Human-in-the-Loop (HITL) review, rationale logging, and operator approval.",
  },
];
