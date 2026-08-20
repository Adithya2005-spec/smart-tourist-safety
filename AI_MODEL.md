# Risk Model

## Prototype method

`client/src/lib/safety-engine.ts` implements `predictRisk`, a transparent **linear-risk-inspired** scoring function. It models the following synthetic inputs:

| Input | Role in prototype score |
|---|---|
| Historical incident count | Captures persistent contextual activity. |
| Recent incident count | Increases score for current activity. |
| Incident severity | Raises score when recent reports are more serious. |
| Tourist density | Represents exposure in a crowded area. |
| Hour | Adds a time-of-day contextual component. |
| Historical risk | Smooths the score using prior zone context. |

The output is clamped to 0–100 and assigned a **SAFE**, **CAUTION**, or **DANGER** band. The UI also displays the contributing factors rather than presenting a black-box result.

> The model is trained conceptually on **synthetic demonstration inputs**. It does not use real historical incident data, has no reported accuracy, and must not inform real-world public-safety decisions.

## Production model requirements

A production rollout needs a governed data pipeline, feature documentation, held-out evaluation, fairness analysis, calibration, incident-response review, monitoring for drift, and a clear human-oversight policy. The UI should continue to show provenance and explainable factors even if a more advanced model replaces this service.

## Guardian assistant

The Guardian assistant is intentionally deterministic and context-aware. It grounds replies in the visitor’s current risk score, risk factors, cached zones, safer route, and emergency procedure. This means the core application remains usable when no external language-model service is configured.
