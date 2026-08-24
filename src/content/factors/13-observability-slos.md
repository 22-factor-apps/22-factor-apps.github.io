---
number: 13
numeral: "XIII"
slug: observability-slos
title: "Observability & SLOs"
tagline: "Instrument user-visible behavior and connect signals to decisions"
commandment: "Define user-visible objectives, instrument causality, and alert only on actionable risk."
boundary: "More telemetry is not more observability, and an availability target is not permission to ignore correctness or user harm."
original: false
category: "Reliability"
reading: "7 min"
---

A production system must explain its behavior from the outside and the inside. Emit
correlated signals that let operators ask new questions, then anchor those signals in
service-level objectives that describe what users actually need. Telemetry without a
decision model is expensive exhaust; an objective without trustworthy measurement is
wishful thinking.

## The commandment

Define a small set of **service-level indicators** for critical user journeys:
availability, latency, correctness, freshness, durability, or another measurable
property. Set **service-level objectives** with a window and target that reflect user
needs. The remaining tolerance becomes an error budget that informs release pace and
reliability work.

Then instrument the application so operators can explain why the indicators moved.
Use vendor-neutral semantic conventions where possible and preserve correlation across
service, queue, database, and asynchronous boundaries.

## Signals are evidence, not destinations

- **Metrics** show rates, distributions, saturation, and SLI performance. Preserve
  distributions for latency; averages conceal the users in the tail.
- **Traces** connect causality across boundaries and reveal where time, retries, and
  errors accumulate.
- **Logs and events** capture discrete lifecycle, domain, security, and diagnostic
  facts in structured form.
- **Profiles** explain where CPU, memory, allocation, or lock time goes when aggregate
  behavior is insufficient.
- **Synthetic and black-box checks** measure the system from the user’s side, including
  dependencies and routing the application cannot observe internally.

OpenTelemetry provides a vendor-neutral framework for traces, metrics, and logs. Use
it to reduce backend lock-in, not to collect everything indefinitely.

## What good looks like

- Instrumentation ships with the feature. A new critical path is incomplete until its
  success, failure, latency, and business outcome are observable.
- Correlation identifiers survive asynchronous work without placing secrets or
  personal data in high-cardinality labels.
- Deploys, configuration changes, migrations, and feature exposure appear on the same
  timelines as service behavior.
- Alerts are based on meaningful symptoms or error-budget burn and require an action.
  Non-urgent conditions enter a work queue instead of waking a human.
- Telemetry has an owner, schema, sampling strategy, cardinality budget, retention
  class, access policy, and cost limit.

Correctness and product quality deserve first-class indicators. A service returning
fast `200` responses with stale prices, inaccessible interactions, harmful model
output, or cross-tenant data is not healthy. Pair technical signals with domain
invariants, representative user feedback, and externally observed outcomes. For
non-deterministic systems, version the evaluation set and measure behavioral quality,
not just transport success.

## Common failure modes

Dashboards without objectives, alerting on CPU by default, high-cardinality user IDs
in metric labels, trace sampling that discards every error, plaintext secrets in logs,
and a different correlation format in each service all weaken the system.

Do not define every internal component as 99.999% available. Objectives must compose
and reflect product value. Unrealistic targets create expensive architecture and
eventually train teams to ignore the promise.

## Litmus test

> Given one failed or unusually slow user operation, can an on-call engineer move from
> the affected SLI to a correlated trace, relevant structured events, dependency
> behavior, release/configuration changes, and the responsible owner—without deploying
> new instrumentation?

Also ask what decision follows when the error budget burns too quickly. If the answer
is only “look at a dashboard,” the control loop is incomplete.

## Research lineage

Hoffman proposed **Telemetry** as a missing factor. Google SRE connected monitoring to
SLIs, SLOs, and error budgets; OpenTelemetry supplies the current vendor-neutral signal
model. The Reactive Manifesto adds bounded responsiveness, while Google’s AI extension
shows why non-deterministic quality and user feedback must be observable alongside
system health. This factor also subsumes the original “logs as event streams” mechanism.

*Sources: [Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/), [Google SRE on SLOs](https://sre.google/sre-book/service-level-objectives/), [OpenTelemetry](https://opentelemetry.io/docs/), [The Reactive Manifesto](https://www.reactivemanifesto.org/), and [Google Cloud’s AI extension](https://cloud.google.com/transform/from-the-twelve-to-sixteen-factor-app).*
