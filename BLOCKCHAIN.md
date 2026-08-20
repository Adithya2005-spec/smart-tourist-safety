# Blockchain and Audit Design

## Purpose

Blockchain is used selectively for **identity verification commitments** and **tamper-evident incident integrity**, rather than as an emergency database. This means an SOS can be created, verified, assigned, and resolved even when the integrity network is unavailable.

## Data minimization

| May be committed | Must remain off-chain |
|---|---|
| Tourist identity ID | Passwords and authentication secrets |
| Cryptographic identity hash | Phone numbers and private profile fields |
| Incident ID | Continuous GPS history |
| Canonical incident data hash | Free-form sensitive incident descriptions |
| Timestamp and verification status | Emergency contact records |

## Reference contract

`contracts/SafetyAudit.sol` supplies four minimal functions:

| Function | Purpose |
|---|---|
| `registerIdentity()` | Records the hash of a canonical identity commitment. |
| `verifyIdentity()` | Compares a supplied identity hash with the commitment. |
| `recordIncident()` | Records a final canonical incident-data hash. |
| `verifyIncident()` | Confirms an expected incident hash matches the commitment. |

The contract uses an operator-only write policy to make the demonstration trust model explicit. A production deployment needs a reviewed contract, managed signing policy, chain-governance decision, transaction monitoring, recovery procedures, and cost model. **Private keys must never be exposed in browser source code.**

## Prototype audit flow

When an incident becomes `RESOLVED`, the authority can request an audit record. The client creates a SHA-256 hash of a canonical incident representation, stores the result in the local audit history, and presents integrity as verified in the EVM-compatible simulation. This shows the correct decoupled data flow without claiming that the local browser has submitted a live transaction.
