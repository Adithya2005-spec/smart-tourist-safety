# 🛡️ Suraksha Link — Smart Tourist Safety Portal

<div align="center">

![Status](https://img.shields.io/badge/Status-Live%20Prototype-success?style=for-the-badge\&logoColor=white)
![Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Coverage-36%20States%20%2B%20UTs-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

<br/>

**An offline-first tourist safety platform with real-time SOS, AI risk assessment, authority command centre, and blockchain-anchored audit trail.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Demo Script](#-demo-script)

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Demo Script](#-demo-script)
- [License](#-license)

---

## 🌟 Overview

**Suraksha Link** is a dual-portal tourist safety system built for India's 36 states and UTs.

- **Tourist Portal** — 1-tap SOS, offline-first geofencing, state emergency directories, Guardian AI advisor, location sharing
- **Authority Centre** — Role-gated incident queue, unit dispatch, AI risk heatmaps, blockchain audit log

> All map data, telemetry, and incident records in this repo are **synthetic demo seeds** for prototype demonstration only.

---

## 🚀 Features

### Tourist Portal
| Feature | Description |
|---|---|
| 🚨 **1-Tap SOS** | Instant alert with GPS, risk score, and incident type |
| 🗺️ **Offline Maps** | Cached risk zones and safe points — works without internet |
| 📞 **Emergency Contacts** | State-specific helplines (police, ambulance, women safety) |
| 🤖 **Guardian AI** | Contextual safety advice powered by local risk data |
| 📍 **Location Sharing** | Time-bound guardian link with live tracking |
| 🌐 **Pan-India Coverage** | All 36 states & UTs with localised data |

### Authority Command Centre
| Feature | Description |
|---|---|
| 📋 **Incident Queue** | Real-time SOS feed with status management |
| 🚔 **Unit Dispatch** | One-click dispatch with ETA computation |
| 🔥 **Risk Heatmaps** | AI-generated zone risk visualisation |
| ✅ **Identity Verification** | Digital tourist ID validation |
| ⛓️ **Blockchain Audit** | Tamper-evident Solidity-based log |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│              CLIENT (React + Vite)           │
│  Tourist Portal  ←→  Authority Command UI   │
└──────────────────────┬──────────────────────┘
                       │ tRPC over HTTP
┌──────────────────────▼──────────────────────┐
│         SERVER (Express + TypeScript)        │
│  OAuth · tRPC Router · Storage Proxy        │
└──────────────────────┬──────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
   ┌─────▼──────┐            ┌────────▼────────┐
   │  MySQL DB  │            │  Blockchain Log  │
   │  (Drizzle) │            │  (Solidity/EVM)  │
   └────────────┘            └─────────────────┘
```

### Offline-First Edge Layer
| Capability | Online | Offline |
|---|---|---|
| SOS Broadcast | ✅ Server + SMS | ✅ Cached queue |
| Risk Assessment | ✅ Live AI | ✅ On-device engine |
| Emergency Contacts | ✅ Real-time | ✅ Cached |
| Maps & Safe Zones | ✅ Live tiles | ✅ IndexedDB cache |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite 7 |
| **Backend** | Node.js, Express, tRPC v11 |
| **Database** | MySQL + Drizzle ORM |
| **Auth** | JWT + OAuth 2.0 |
| **AI Engine** | On-device risk scoring + LLM Guardian |
| **Blockchain** | Solidity smart contract (EVM-compatible) |
| **State Data** | 36 Indian states & UTs with localised safety data |
| **Package Manager** | pnpm |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Adithya2005-spec/smart-tourist-safety.git
cd smart-tourist-safety

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (Optional)

Create a `.env` file in the root:

```env
DATABASE_URL=mysql://user:password@host:3306/db
JWT_SECRET=your-secret-key
NODE_ENV=development
```

> The app runs without a database — it uses in-memory seed data for demo purposes.

---

## 🧪 Running Tests

```bash
# Run all tests
pnpm test

# Type-check
pnpm check
```

**Test Results:** 2 test files · 6 tests · all passing ✅

---

## 🎬 Demo Script

### As a Tourist
1. Open the app → **Tourist Portal**
2. Go to **SOS** tab → Press the big red button
3. Watch the incident broadcast with GPS + risk score
4. Go to **Contacts** → View state emergency helplines (dialable)
5. Go to **Guardian AI** → Ask "Is it safe to travel to Manali at night?"
6. Go to **Pan-India Explorer** → Browse all 36 states

### As an Authority
1. Switch to **Authority Portal** → Log in
2. View the live **Incident Queue** → Assign a unit
3. Check the **Risk Heatmap** → Identify high-risk zones
4. View **Blockchain Audit Log** → See tamper-evident records

---

## 🔒 Security & Privacy

- All SOS data is **encrypted in transit** (HTTPS/TLS)
- Location data is **never stored permanently** without consent
- Blockchain audit trail is **append-only and tamper-evident**
- OAuth 2.0 with **CSRF protection** via nonce verification
- Role-based access control for authority features

---

## 🗺️ Pan-India Coverage

All 28 States + 8 Union Territories supported:

`Andhra Pradesh` · `Arunachal Pradesh` · `Assam` · `Bihar` · `Chhattisgarh` · `Goa` · `Gujarat` · `Haryana` · `Himachal Pradesh` · `Jharkhand` · `Karnataka` · `Kerala` · `Madhya Pradesh` · `Maharashtra` · `Manipur` · `Meghalaya` · `Mizoram` · `Nagaland` · `Odisha` · `Punjab` · `Rajasthan` · `Sikkim` · `Tamil Nadu` · `Telangana` · `Tripura` · `Uttar Pradesh` · `Uttarakhand` · `West Bengal` · `Andaman & Nicobar` · `Chandigarh` · `Dadra & Nagar Haveli` · `Daman & Diu` · `Delhi` · `Jammu & Kashmir` · `Ladakh` · `Lakshadweep` · `Puducherry`

---

## 📄 License

MIT License © 2026 — Adithya & Team

---

<div align="center">
  Built with ❤️ for Smart India Hackathon 2026
</div>
