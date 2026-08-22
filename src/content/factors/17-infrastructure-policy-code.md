---
number: 17
numeral: "XVII"
slug: infrastructure-policy-code
title: "Infrastructure & Policy as Code"
tagline: "Declare desired state, review policy, and reconcile drift continuously"
original: false
category: "Operations"
reading: "7 min"
---

Infrastructure and policy are part of application behavior. Capacity, network paths,
identity bindings, data residency, rollout strategy, and admission rules can change
reliability or security as profoundly as source code. Express them as declarative,
versioned desired state and make the running system continuously accountable to it.

## The principle

Define what should exist and which invariants must hold. Review and test that
definition, apply it through automated controllers or pipelines, observe the actual
state, and reconcile or alert on drift. The authoritative route to a production change
is a recorded change to desired state—not an undocumented console session.

“As code” means more than a particular template language. The important properties
are machine readability, version history, deterministic evaluation, composability,
review, testability, and repeatable application.

## What belongs in desired state

- compute, network, storage, identity, DNS, certificates, and service attachments;
- deployment topology, resource bounds, autoscaling, disruption and recovery policy;
- admission, authorization, data residency, encryption, retention, and compliance
  constraints;
- dashboards, SLO definitions, alerts, runbook links, and ownership metadata;
- progressive-delivery stages, verification queries, and abort conditions.

Secrets do not need to appear as plaintext in code. Declare references, schemas,
access relationships, and rotation policy while a secret system holds sensitive
values. Keep bootstrap trust small and separately governed.

## Reconcile with care

OpenGitOps describes desired state as declarative, versioned and immutable, pulled
automatically, and continuously reconciled. Those are strong defaults. Controllers
also create a new failure domain: a bad declaration or compromised reconciler can
change an entire fleet quickly.

Use plans, policy checks, staged application, scope limits, concurrency bounds, and
health gates. Separate read/plan authority from apply authority where risk warrants
it. Ensure deletion and replacement have explicit safeguards for stateful resources.
Drift handling should distinguish benign temporary variance from an unauthorized or
dangerous state; silent force-reconciliation is not always the safest answer.

## What good looks like

- A fresh environment can be recreated from versioned declarations and documented
  bootstrap inputs, then verified against policy.
- Pull requests show semantic plans, policy decisions, affected resources, blast
  radius, cost change, and evidence from representative tests.
- Emergency changes are attributable, time-bounded, and automatically captured or
  reverted through the normal desired-state path.
- The system reports drift and controller health. Reconciliation lag and repeated
  failure are observable service conditions.
- Modules have clear ownership and versions; copied templates do not evolve as hidden
  forks.

## Common failure modes

Click-ops as the primary path, generated configuration committed without its source,
one all-powerful CI credential, plans that operators cannot inspect, policy exceptions
with no expiry, and a reconciler that can delete state globally all turn automation
into concentrated risk.

Declarative syntax does not guarantee idempotency or safety. Test provider behavior,
imports, moves, replacement semantics, and partial failure.

## Litmus test

> Can the team recreate a representative environment from reviewed desired state,
> detect one unauthorized manual change, show the exact policy violation and owner,
> then reconcile safely without using undocumented console steps or broad permanent
> credentials?

Also stop the reconciler. The running application should remain understandable, and
operators should know how long control-plane unavailability is safe.

## Research lineage

CNCF describes cloud-native operation through declarative APIs and robust automation.
The OpenGitOps principles make the desired-state loop precise: declarative, versioned
and immutable, pulled automatically, and continuously reconciled.

*Sources: [OpenGitOps Principles](https://opengitops.dev/) and [CNCF: Who We Are](https://www.cncf.io/about/who-we-are/).*
