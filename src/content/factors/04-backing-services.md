---
number: 4
numeral: "IV"
slug: backing-services
title: "Backing Services"
tagline: "Treat every network dependency as an attached, replaceable resource"
commandment: "Depend on explicit service contracts; attach and replace implementations through configuration."
boundary: "Replaceable means operationally swappable through a tested contract, not identical behavior from every provider."
original: true
category: "Architecture"
reading: "5 min"
---

Databases, queues, object stores, caches, mail systems, identity providers, model
endpoints, and third-party APIs are all backing services. Whether your team operates
them or a vendor does, application code should reach them through explicit resource
handles and narrow contracts—not assumptions about where or by whom they run.

## The commandment

Attach a backing service through configuration. The application depends on its
contract and required capabilities, not on a hostname compiled into source or a
privileged SDK used everywhere. Replacing one conforming instance with another should
be an operational change, with any true incompatibilities isolated behind an adapter.

“Replaceable” does not mean “identical.” A local emulator, a managed production
service, and a self-hosted alternative may differ in latency, limits, consistency,
failure modes, and supported features. [Factor IX](/factors/environment-parity)
requires representative behavior and contract tests—not pretending those differences
do not exist.

## What good looks like

- Give each attachment an explicit owner, configuration handle, data classification,
  SLO or expectation, capacity limit, and exit plan.
- Centralize protocol concerns: authentication, timeouts, bounded retries, idempotency
  keys, connection pools, rate limits, and error translation. Product code should not
  improvise these differently at every call site.
- Test contracts against real service versions. Emulators are useful for speed but
  cannot be the only evidence for production compatibility.
- Design failure behavior deliberately. Decide which requests fail fast, degrade,
  queue, use stale data, or shed load when the dependency is slow or unavailable.
  [Factor XV](/factors/resilience-fault-containment) handles the wider fault boundary.
- Make data migration and rollback part of replacement planning. Switching a URL is
  easy; preserving correctness, ordering, and privacy is the real work.

Resource handles should identify the attachment without granting universal authority.
Prefer workload identity and narrowly scoped, short-lived credentials over one shared
secret that turns every service into the same security boundary.

## Common failure modes

Treating an internal database as a local library, calling a vendor SDK throughout the
domain model, allowing unbounded client retries, assuming “managed” means infallible,
or sharing one production credential across every deploy all create hidden coupling.
So does depending on undocumented behavior that only one provider happens to offer.

A backing service is also not replaceable if the team has never rehearsed restore,
export, quota exhaustion, credential rotation, or regional failure.

## Litmus test

> Can a staging attachment be replaced with a fresh compatible instance by changing
> configuration, running documented migration steps, and passing automated contract
> tests—without editing application source?

Repeat the test with the service slow, rate-limited, and unavailable. Replaceability
includes predictable failure, not only the happy-path handshake.

*Modernized from [Factor IV of the original twelve-factor methodology](https://12factor.net/backing-services).*
