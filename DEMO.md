# Demonstration Script

## Suggested live walkthrough

| Step | Presenter action | What to emphasize |
|---:|---|---|
| 1 | Open the traveller portal. | Current local safety state, risk score, connectivity indicator. |
| 2 | Open Safety map and select **Simulate high-risk zone**. | Haversine geofence logic runs on the edge against cached zones. |
| 3 | Open Guardian AI and ask why the area is risky. | The assistant is context-aware and remains available without an external LLM. |
| 4 | Return to SOS centre and create an SOS incident. | Payload includes location and risk; lifecycle starts at `CREATED`. |
| 5 | Switch role to Authority and open Incident queue. | The same local service drives the command-centre queue. |
| 6 | Verify, assign a responder, start response, and resolve. | Valid transitions append time-stamped actors and details. |
| 7 | Open Blockchain audit and record / verify the resolved case. | Hash commitment comes after operations; no private data is on-chain. |
| 8 | Switch to traveller, open My incidents. | The traveller sees the lifecycle changes immediately. |
| 9 | Go offline in Settings and create another SOS. | Cached risk state and local queue remain available; cloud coordination is not claimed offline. |
| 10 | Restore connection and synchronize queue. | The queue changes from local pending state to shared operational incident state. |

## Expert questions and concise answers

| Question | Recommended answer |
|---|---|
| Why use blockchain? | It is selective: identity verification and tamper-evident resolution audits, not the primary emergency database. |
| Why an edge layer? | Geofence warnings and queued SOS requests should not depend completely on temporary connectivity. |
| What works offline? | Cached zones, local risk state, geofencing, emergency contacts, and a local SOS queue. Cloud coordination and analytics require connectivity. |
| What data is on-chain? | Only cryptographic hashes and verification metadata, never phone numbers, private profiles, passwords, or GPS history. |
| Is the risk model real? | No. The prototype uses synthetic, clearly labelled demonstration inputs and makes no accuracy claim. |
| Why Convex / reactive backend in a production version? | A reactive backend lets authorized incident-state changes propagate to coordinated clients without manual refresh. |

## Demo safety reminders

The sample is a technical prototype, not a replacement for official emergency services. During a real emergency, use local emergency channels and trained responders.
