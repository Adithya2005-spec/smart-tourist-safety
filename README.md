# 🛡️ Suraksha Link — Smart Tourist Safety Platform & Safety Digital Twin

<div align="center">

![Status](https://img.shields.io/badge/Status-Live%20Production%20Grade-success?style=for-the-badge&logoColor=white)
![Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Coverage-36%20States%20%2B%20UTs-orange?style=for-the-badge)
![Digital Twin](https://img.shields.io/badge/Engine-Safety%20Digital%20Twin-purple?style=for-the-badge)
![Resilience](https://img.shields.io/badge/Resilience-Offline%20Edge%20%2B%20Fault%20Tolerant-emerald?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)
<br/>

**Suraksha Link** is an AI-powered, resilient, offline-first tourist safety platform featuring a **Safety Digital Twin**, **What-If Simulation Engine**, **Pan-India 36 State/UT Explorer**, **Chaos Simulator**, **Human-in-the-Loop (HITL) Governance**, **Incident Replay & Forensics**, and **Blockchain-Anchored Audit Trail**.

[Live Demos & Features](#-key-upgraded-features) • [Safety Digital Twin](#-safety-digital-twin--what-if-simulation-engine) • [System Crash Resilience](#-system-crash-fault-tolerance--data-persistence) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Full Demo Script](#-full-demonstration-script)

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [Comprehensive Feature Changelog](#-comprehensive-feature-changelog-from-start-to-finish)
- [Safety Digital Twin & What-If Simulation Engine](#-safety-digital-twin--what-if-simulation-engine)
- [System Crash, Fault Tolerance & Data Persistence](#-system-crash-fault-tolerance--data-persistence)
- [Pan-India 36 State & UT Safety Network](#-pan-india-36-state--ut-safety-network)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Verification & Building](#-verification--building)
- [Full Demonstration Script](#-full-demonstration-script)
- [License](#-license)

---

## 🌟 Overview

**Suraksha Link** is an end-to-end tourist protection and emergency response platform built for India's 36 States and Union Territories. It connects verified travellers directly with command authorities, field responder units, and predictive AI simulation engines.

The platform provides dual operational viewpoints:
1. **Tourist Portal**: 1-Tap SOS, Pan-India territory switcher, offline-first geofence alerts, Guardian AI advisory, time-bound live location sharing, emergency contacts directory, and verified Digital Tourist ID.
2. **Authority Command Centre**: Spatial Safety Digital Twin, What-If simulation playground, Next Best Action (NBA) engine with Human-in-the-Loop (HITL) review, incident replay player, post-incident forensics graph, chaos engineering panel, federated learning monitor, and blockchain audit ledger.

---

## 🚀 Comprehensive Feature Changelog (From Start to Finish)

Here is the complete list of upgrades implemented in **Suraksha Link**:

### 1. 🌐 Pan-India 36 States & UTs Integration
- Full safety coverage database for all **28 States and 8 Union Territories** of India.
- Customized per-state data: Capital, Tourist Police helpline, Police 112, Women Helpline, Ambulance, Disaster Management numbers, local advisories, recommended Do's & Don'ts, popular safe destinations, and weather alerts.
- Top navigation bar & mobile drawer quick-switcher for switching active state/territory.
- Dedicated `/pan-india` interactive explorer page.

### 2. 🔮 Safety Digital Twin & What-If Simulation Engine
- Dedicated Command Center page (`/authority/digital-twin`).
- **Live Digital Twin**: Real-time virtual model representing tourists, active incidents, risk zones, responder units, road/route availability, cellular connectivity quality, and zonal resilience scores ($0-100$).
- **Interactive Layer Toggles**: Heatmaps, Responder Units, Active Incidents, Emergency Infrastructure (Police Stations, Hospitals), and Cellular Coverage.
- **What-If Simulation Sliders**:
  - 👥 Tourist Density Multiplier (`0.5x` – `3.0x`)
  - ⚠️ Incident Spike Multiplier (`0.5x` – `4.0x`)
  - 🚔 Responder Availability (`20%` – `100%`)
  - 🚧 Road Closure Severity (`30%` – `100%` open)
  - 🌐 Network/Cellular Quality (`10%` – `100%` LTE/5G)
- **Scenario Comparison & Delta ($\Delta$) Visualizer**: Real-time delta indicators comparing baseline vs. simulated state ($\Delta\text{Risk}$, $\Delta\text{Response Time}$, $\Delta\text{Resilience}$, $\Delta\text{Connectivity}$).
- **Pre-Positioning & Resource Optimizer**: Generates automated responder unit re-allocations to high-risk hubs before emergency spikes escalate.
- **Scenario Snapshots Manager**: Save, load, and delete scenario presets (e.g. *Monsoon Flash Flood Gridlock*, *Diwali Crowd Surge*, *Cloud Server Outage*).

### 3. 🛡️ System Crash Resilience & Embedded Data Explanations
- **UI Crash Resilience Panel**: Embedded directly under the *System Crash & Fault Tolerance* tab in the Digital Twin page.
- **Edge Local Storage Persistence**: Unsynced SOS incidents and location traces are stored safely in device storage (`localStorage` + IndexedDB).
- **Offline Edge Queue**: Retained across browser/app crashes and server reboots; automatically flushes queued incidents to central servers when connection is restored.
- **Blockchain Audit Integrity**: SHA-256 hashes are immutable and anchored to prevent data loss or manipulation during server downtime.
- **Fail-Safe Offline Payloads**: Generates encrypted emergency QR codes and SMS fallback payloads when internet/cellular connectivity fails completely.

### 4. ⚡ Next Best Action (NBA) & Human-in-the-Loop (HITL) Governance
- AI-driven decision recommendation engine ranking actions by expected impact and model confidence.
- Interactive operator modal (`HitlDecisionModal`) allowing command officers to approve, reject, or modify AI recommendations with rationale audit logging.

### 5. 🎬 Deterministic Incident Replay Player
- Step-by-step playback player (`IncidentReplayPlayer`) for post-incident analysis of emergency lifecycles from creation to resolution.

### 6. ⚡ Chaos Engineering Simulator
- Interactive control panel (`ChaosSimulatorPanel`) simulating server outages, cloud failures, responder unavailability, internet degradation, and road blockages with automated resilience evaluations.

### 7. 🔍 Incident Evidence Graph & Post-Incident Forensics
- Visual dependency graph (`IncidentEvidenceGraph`) linking incident telemetry, location coordinates, responder assignments, and blockchain audit hashes.
- Automated forensics report generator (`PostIncidentForensicsView`).

### 8. 📶 5-Level Connectivity Degradation Ladder
- Evaluates system capabilities across 5 connectivity tiers (Full Cloud, Degraded Cloud, Offline Edge, Mesh/SNET, Fallback QR/SMS).

### 9. 🤖 MLOps Model Governance & Regional Federated Learning
- Model health panel monitoring Feature Drift Index (KS-statistic), Brier Calibration Score, and Input Data Quality.
- Regional edge federated learning simulation demonstrating privacy-preserving weight aggregation across Karnataka, Goa, and Kerala.
- Safety Pattern Discovery Engine uncovering historical incident correlations.

### 10. 🎯 Incident Prioritization Engine
- Automatic model-derived priority ranking (`P1 CRITICAL`, `P2 HIGH`, `P3 MEDIUM`, `P4 LOW`) for active incident queues.

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    SURAKSHA LINK CLIENT (React + Vite)            │
│  Tourist Portal  │  Pan-India Directory  │  Safety Digital Twin  │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │ tRPC / REST API
┌─────────────────────────────────▼─────────────────────────────────┐
│                SERVER (Node.js + Express + TypeScript)            │
│  tRPC Routers  ·  Risk Engine  ·  Digital Twin  ·  What-If Engine │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
         ┌───────▼────────┐               ┌────────▼────────┐
         │   MySQL DB     │               │ Blockchain Log  │
         │ (Drizzle ORM)  │               │ (Solidity EVM)  │
         └────────────────┘               └─────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite 7, Lucide Icons |
| **Backend** | Node.js, Express, tRPC v11 |
| **Database** | MySQL + Drizzle ORM |
| **State Management** | React Context (`SafetyContext`) with LocalStorage persistence |
| **Mapping & Spatial** | Canvas-rendered custom geospatial visualization engine |
| **Simulation Engines** | Digital Twin, What-If Predictor, Chaos Simulator, Resource Optimizer |
| **Audit & Security** | SHA-256 hashing, EVM Solidity Smart Contract simulation |
| **Package Manager** | pnpm |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation & Running Locally

```bash
# Clone repository
git clone https://github.com/Adithya2005-spec/smart-tourist-safety.git
cd smart-tourist-safety

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Verification & Building

```bash
# Run TypeScript compilation check (0 errors)
pnpm check

# Run unit test suite
pnpm test

# Build production bundle
pnpm run build
```

---

## 🎬 Full Demonstration Script

### 1. Safety Digital Twin & What-If Simulation Engine
1. Select **Command Responder** role from the top-right role switcher.
2. Navigate to **Digital Twin & Simulator** from the sidebar (`/authority/digital-twin`).
3. Under **Live Twin State**, toggle map layer switches (*Heatmap*, *Responders*, *Incidents*, *Infrastructure*, *Connectivity*).
4. Switch to **What-If Simulation**:
   - Drag **Tourist Density Multiplier** to `2.5x`
   - Increase **Incident Spike Multiplier** to `3.0x`
   - Lower **Responder Availability** to `50%`
5. Observe real-time predicted response delays ($\Delta\text{Response Time}$), risk score changes ($\Delta\text{Risk}$), and pre-positioning recommendations.
6. Click **Save Preset** to save the custom scenario snapshot.
7. Switch to **System Crash & Fault Tolerance** to review edge persistence, offline queue recovery, and blockchain audit integrity details.

### 2. Pan-India 36 Territory Switcher
1. Click the **Active Territory** dropdown in the top bar or sidebar.
2. Select **Goa (GA)** or **Ladakh (LA)**.
3. Observe how emergency helplines, police contact numbers, advisories, do's & don'ts, and local risk zones dynamically update across the entire portal.

### 3. Next Best Action & Human-in-the-Loop Review
1. Navigate to **Command Centre** (`/authority`).
2. View **Next Best Action Engine** recommendations.
3. Click **Review & Approve** on a pending recommendation to launch the **HitlDecisionModal**.
4. Enter approval rationale notes and click **Approve Action**.

### 4. Incident Replay & Chaos Simulator
1. Click **Replay Incident Lifecycle** on the Command Centre page to launch the interactive playback player.
2. Toggle cloud outage or responder unavailability in the **Chaos Simulator Panel** to evaluate real-time resilience responses.

### 5. Tourist Safety Portal & Offline SOS
1. Switch role to **Tourist View**.
2. Go to **SOS Centre** $\rightarrow$ Click **Emergency SOS**.
3. Toggle connection to **Go Offline** in the header to observe the local edge queue holding the SOS alert safely until connection is restored.

---

## 📄 License

MIT License © 2024–2026 — Adithya & Team

<div align="center">
  Built with ❤️ for Smart Tourist Safety & Resilience
</div>
