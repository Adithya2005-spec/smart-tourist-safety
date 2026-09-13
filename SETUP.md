# 🛠️ Suraksha Link — Local Development Setup Guide

This guide covers everything you need to run **Suraksha Link** locally from scratch.

---

## Prerequisites

| Tool | Minimum Version | Purpose |
|---|---|---|
| Node.js | v20+ | Runtime (v22 recommended via `.node-version`) |
| pnpm | v10+ | Package manager |
| Git | Any | Version control |

> **Note**: The project uses `pnpm` as its package manager. If you only have `npm`, install pnpm first:
> ```bash
> npm install -g pnpm
> ```

---

## 1. Clone & Install

```bash
git clone https://github.com/Adithya2005-spec/smart-tourist-safety.git
cd smart-tourist-safety
pnpm install
```

---

## 2. Environment Configuration

Copy the template and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# ——— Required ———
PORT=3000
NODE_ENV=development
JWT_SECRET="suraksha_local_development_secret_key"
VITE_APP_ID="suraksha-link"

# ——— AI/LLM (Optional — platform falls back to deterministic engine) ———
GEMINI_API_KEY="your-gemini-key"               # Google Gemini 1.5/2.0 Flash
OPENROUTER_API_KEY="your-openrouter-key"        # OpenRouter (Claude/Llama fallback)
OPENROUTER_MODEL="anthropic/claude-3.5-haiku"

# ——— Maps (Optional — built-in GIS engine used as fallback) ———
GOOGLE_MAPS_API_KEY="your-maps-key"
VITE_GOOGLE_MAPS_API_KEY="your-maps-key"

# ——— Resend Alerts (Optional — emails logged locally if unset) ———
RESEND_API_KEY="your-resend-key"
RESEND_FROM_EMAIL="onboarding@resend.dev"
EMERGENCY_DISPATCH_EMAIL="delivered@resend.dev"
```

> **All API keys are optional.** If left blank, the platform automatically runs in high-reliability deterministic simulation mode — all features remain navigable.

---

## 3. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open: **http://localhost:3000**

The server serves both the React frontend (via Vite middleware) and the Express API on the same port.

---

## 4. Run Tests

```bash
pnpm test
# or
npm test
```

Runs all **26 unit tests** across **9 test suites** in Vitest:

| Suite | Tests |
|---|---|
| `safety-engine.test.ts` | Geofencing, risk prediction, lifecycle, audit chain, offline queue |
| `planner-agent.test.ts` | Intent classification, execution plan construction |
| `evidence-validator.test.ts` | Freshness validation, completeness scoring |
| `guardian-ai.test.ts` | Multilingual English/Hindi/Kannada responses, HITL escalation |
| `resend-alerts.test.ts` | Alert dispatch, deduplication, key-missing graceful degradation |
| `openrouter.test.ts` | LLM gateway fallback |
| `gemini.test.ts` | Gemini service configuration |
| `maps.test.ts` | Safe route scoring |
| `auth.logout.test.ts` | Session cookie clearing |

---

## 5. TypeScript Check

```bash
pnpm run check
# or
npm run check
```

Validates full codebase with `tsc --noEmit`.

---

## 6. Production Build

```bash
pnpm run build
# or
npm run build
```

Outputs:
- **Client**: `dist/public/` — Vite-bundled React SPA
- **Server**: `dist/index.js` — ESBuild-compiled Express server

Run production:
```bash
npm start
```

---

## Project Structure

```
smart-tourist-safety/
├── client/src/
│   ├── pages/          # 30 route pages (tourist, authority, admin views)
│   ├── components/     # 29 UI components (maps, charts, modals, agent panels)
│   ├── contexts/       # SafetyContext — offline-first global state
│   ├── lib/            # safety-engine.ts — edge risk prediction & lifecycle
│   └── locales/        # i18n strings (en, hi, kn)
│
├── server/
│   ├── _core/          # Express entry point + env config
│   ├── agents/         # 10 specialist AI agents (planner → guardian-ai → responder)
│   ├── services/       # gemini.ts, openrouter.ts, maps.ts, resend-alerts.ts
│   ├── routes/         # agent-routes.ts — Multi-agent orchestration API
│   └── routes.ts       # REST API endpoints (risk, incidents, digital-twin, intelligence)
│
├── shared/             # Shared TypeScript types between client and server
├── contracts/          # Blockchain audit smart contract definitions
├── drizzle/            # DB migration files
├── .env.example        # Environment template
├── README.md           # Full feature documentation
└── SETUP.md            # This file
```

---

## Key Routes

### Tourist View
| Route | Description |
|---|---|
| `/tourist` | Safety home dashboard |
| `/tourist/guardian-ai` | Multi-agent AI chat (multilingual) |
| `/tourist/dossier` | Unified safety intelligence dossier |
| `/tourist/sos` | SOS centre with offline queueing |
| `/tourist/map` | Interactive safety map |
| `/tourist/identity` | Digital tourist ID with QR code |
| `/pan-india` | 36 State/UT safety directory |

### Authority Command Centre
| Route | Description |
|---|---|
| `/authority` | Command dashboard |
| `/authority/incidents` | Incident queue & HITL dispatch |
| `/authority/digital-twin` | Spatial digital twin & what-if simulator |
| `/authority/model-lab` | MLOps observatory & model benchmarks |
| `/authority/intelligence` | Multi-signal intelligence feed |
| `/authority/audit` | Cryptographic blockchain audit trail |

---

## API Endpoints Summary

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/agent/query` | Full orchestrated multi-agent execution |
| `POST` | `/api/agent/plan` | Planner agent intent classification |
| `POST` | `/api/alerts/send` | Dispatch Resend emergency email alert |
| `GET` | `/api/alerts/status/:id` | Alert deduplication status |
| `POST` | `/api/routes/safe-corridors` | Google Maps / GIS safe routing |
| `GET` | `/api/risk/current/:touristId` | Current contextual risk score |
| `GET` | `/api/risk/zones` | Zone-level risk breakdown |
| `POST` | `/api/incidents` | Create new SOS incident |
| `GET` | `/api/digital-twin/state` | Spatial digital twin state |
| `POST` | `/api/simulation/what-if` | Multi-variable what-if scenario |
| `GET` | `/api/agent/runs` | Recent agent execution log |

---

## Offline-First Architecture

- All SOS alerts are queued in **LocalStorage/IndexedDB** when the device is offline.
- Pending incidents are **invisible to authority dashboards** until explicitly synchronized.
- On reconnect, queued events are submitted to `/api/sync/events` and pending markers cleared.
- The edge risk engine (`safety-engine.ts`) runs **entirely in-browser** — no server needed for geofencing or risk prediction.

---

## Troubleshooting

**`pnpm install` fails**
→ Ensure Node.js v20+ is installed. Run `node --version`.

**Port 3000 already in use**
→ Set `PORT=3001` in `.env`.

**Google Maps not loading**
→ The app falls back to the built-in GIS engine. Set `VITE_GOOGLE_MAPS_API_KEY` for live routing.

**Gemini/OpenRouter returning errors**
→ Check your API key quotas. The platform automatically falls back to the deterministic rule engine.

**Resend emails not sending**
→ Ensure `RESEND_FROM_EMAIL` is a verified domain on your Resend account. For testing, use `onboarding@resend.dev` as sender and `delivered@resend.dev` as recipient.

---

*MIT License © 2026 — Adithya & Team. Built for Smart India Hackathon 2026.*
