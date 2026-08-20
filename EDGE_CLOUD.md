# Edge and Cloud Boundaries

## Availability model

The portal does **not** claim that the full service is offline. It distinguishes immediate on-device safety functions from connectivity-dependent coordination features.

| Capability | Edge safety layer | Cloud / authority layer |
|---|---|---|
| Current local state | Available from cached state | Enriched with synchronized history. |
| Risk-zone cache | Available | Source of updated, governed zone records. |
| Geofencing | Available through local Haversine calculation | Provides future zone updates and quality monitoring. |
| SOS creation | Available through a locally queued request | Creates shared operational incident on synchronization. |
| Emergency contacts | Available locally | Optional secure backup subject to consent. |
| Live-location sharing | Local consent and expiry state available | Authorized recipient distribution requires connectivity. |
| Command-centre queue | Not available | Available to authorized authority personnel. |
| Analytics and audit anchoring | Not available | Connectivity-dependent services. |

## Offline SOS flow

```text
Connectivity loss
  → traveller starts SOS
  → local incident and audit entry are created
  → entry is marked PENDING_SYNC
  → connection is restored
  → edge queue synchronizes to coordination service
  → authority queue receives the incident
```

The current prototype persists the local queue in browser storage. A deployable mobile application should use durable device storage, authentication-aware synchronization, idempotency keys, conflict handling, and clear user feedback for delivery state.

## Failure handling

| Failure condition | Prototype fallback |
|---|---|
| Browser GPS unavailable | Uses marked simulated location. |
| Map provider unavailable | Uses the self-contained simulated demonstration map. |
| Network unavailable | Enables offline safety mode and queues SOS requests. |
| External AI unavailable | Uses the deterministic Guardian assistant. |
| Blockchain unavailable | Keeps operational lifecycle intact and shows audit pending. |

This separation is deliberate: **emergency coordination should never depend on blockchain availability**, and immediate local warnings should not require a cloud round trip.
