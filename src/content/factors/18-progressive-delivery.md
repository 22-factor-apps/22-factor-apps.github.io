---
number: 18
numeral: "XVIII"
slug: progressive-delivery
title: "Progressive Delivery"
tagline: "Separate deployment from exposure and expand change with evidence"
original: false
category: "Delivery"
reading: "7 min"
---

A successful build proves that a change passed known checks. It does not prove that
the change is safe for every production user, workload shape, dependency state, and
region. Release in small steps, observe real behavior, and stop exposure before weak
signals become a global incident.

## The principle

Separate **deployment**—placing a verified artifact into an environment—from
**release**—exposing behavior to users or work. Progress through increasingly
representative stages with explicit entry criteria, observation windows, success
signals, safety invariants, and abort actions.

The unit of progression may be instances, traffic percentage, tenants, regions,
accounts, operations, data partitions, or feature cohorts. Choose a unit that limits
blast radius and produces representative evidence; “one canary instance” is not useful
when all canary traffic is synthetic and the risk exists only for the largest tenant.

## Build an evidence ladder

An effective path might include static checks, unit and contract tests, ephemeral
integration, staging, shadow evaluation, internal users, a representative canary,
several traffic steps, and general availability. Each step answers a different
question and reuses the exact artifact from [Factor V](/factors/build-release-run).

Define in advance:

- which SLIs, domain invariants, security signals, and cost signals must remain within
  bounds;
- how long the step must observe behavior and what minimum sample size is meaningful;
- which known differences make the cohort unrepresentative;
- who or what may advance, pause, roll back, or disable the change;
- how data and interface compatibility constrain rollback.

Automate obvious decisions, but make uncertainty visible. A single aggregate metric
can hide a severe regression in one region or tenant. Compare cohorts and inspect
segmented guardrails without turning the pipeline into a statistical claim it cannot
support.

## Feature exposure is production configuration

Feature flags can reduce coupling between deploy and release, enable dark launches,
and give a fast kill switch. They also create combinatorial state and hidden permanent
branches. Every flag needs an owner, purpose, default, eligible population, audit
history, safe failure behavior, and removal date. Authorization and safety policy must
not depend on a client-controlled flag.

Rollbacks are not always safe. A database or event change may make old code
incompatible. Use [Factor XIX](/factors/evolutionary-compatibility) so consecutive
versions can coexist and roll forward or back while data transitions deliberately.

## Common failure modes

Deploying globally after staging, canaries with no representative traffic, checking
only host health, advancing before delayed effects can appear, a manual approval with
no evidence, and flags that remain forever all provide the appearance of control
without bounded risk.

Do not let automatic rollback thrash between bad states. Bound attempts, preserve
evidence, and escalate when the safe action is ambiguous.

## Cut releases at immutable tags

Progressive exposure needs an unambiguous answer to "exposure of what?" Cut
releases at annotated, protected git tags—never at branch tips, which move
under the deploy that references them. The tag pins source; the build turns it
into digest-addressed artifacts; environments promote those artifacts up the
evidence ladder unchanged. And where a rung of the ladder is
irreversible—schema contraction, data deletion, a full-fleet flip—place an
explicit human approval there as a first-class pipeline object: a named
person, shown the diff and the canary's evidence, recorded in the audit
trail. Gates guard blast radius; everything reversible stays automatic, and
the break-glass path around a gate is louder than the gate itself.

## Litmus test

> Before a risky release, can the team state the first exposed cohort, maximum blast
> radius, representative success and safety signals, observation window, automatic
> halt condition, authorized decision-maker, and tested rollback or roll-forward path?

Then deliberately violate one guardrail in a rehearsal. Progression must stop before
general exposure and leave enough evidence to explain why.

## Research lineage

Google’s release-engineering guidance emphasizes automated, reproducible releases,
high velocity through smaller changes, canarying, and rollback. SRE error budgets add
a service-level control on when change should continue.

*Sources: [Google SRE, Release Engineering](https://sre.google/sre-book/release-engineering/) and [Google SRE, Embracing Risk](https://sre.google/sre-book/embracing-risk/).*
