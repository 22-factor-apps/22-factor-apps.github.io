---
number: 19
numeral: "XIX"
slug: evolutionary-compatibility
title: "Evolutionary Compatibility"
tagline: "Let consecutive versions coexist while contracts and data move safely"
commandment: "Change additively; let old and new versions coexist until migration and rollback are proved."
boundary: "A major version number announces incompatibility; it does not make coordinated upgrades, data conversion, or deprecation safe."
original: false
category: "Architecture"
reading: "7 min"
---

Distributed systems do not upgrade atomically. During a rollout, rollback, mobile-app
release, queued job, regional partition, or partner integration, old and new versions
coexist. Design interfaces, data, and operational procedures so that coexistence is a
supported state rather than a race the deployment must win.

## The commandment

Make changes **additive first**. Introduce the new capability while preserving the old
contract, migrate producers, consumers, and data with observable progress, then remove
the old path only after evidence shows it is unused and recovery no longer depends on
it. This expand–migrate–contract pattern applies to APIs, events, database schemas,
configuration, permissions, storage formats, and operational tooling.

Semantic Versioning provides a useful language for declared public APIs: compatible
features move a minor version; incompatible changes move a major version. A number
does not create compatibility, however. Teams must define the public surface and test
behavior, not only signatures.

## Design every boundary for coexistence

- **APIs and SDKs:** add fields with tolerant defaults, preserve stable identifiers
  and error semantics, publish deprecations, and measure consumer usage before removal.
- **Events:** treat published events as facts owned by consumers too. Use explicit
  schema evolution rules, immutable meaning, stable partition keys, and replay tests.
- **Databases:** add nullable columns or new tables first; deploy code that understands
  both representations; backfill with checkpoints and validation; switch authority;
  remove old structures later.
- **Configuration and policy:** readers should tolerate staged introduction and
  removal. A new required value cannot appear after old binaries are already running.
- **Authentication:** key, issuer, audience, claim, and policy transitions need overlap
  windows that do not create a temporary bypass.

Dual reads and writes are powerful but dangerous. Define the source of truth, conflict
behavior, ordering, repair process, and end condition. “Write both for a while” is not
a migration plan when one succeeds and the other fails.

## Deprecation is a product process

Publish what is changing, why, who is affected, the supported alternative, milestones,
and a removal date. Provide machine-detectable warnings or telemetry where possible.
Contact known consumers and make migration status visible. Indefinite compatibility
has real security and maintenance cost, but surprise removal transfers that cost to
every consumer at once.

[Factor XVIII](/factors/progressive-delivery) controls exposure of a change.
Compatibility controls whether versions can safely overlap and whether rollback is
still truthful. A progressive rollout cannot compensate for a one-way schema change
that instantly makes the previous release unusable.

## Common failure modes

Renaming a field in place, changing units without changing schema, removing an event
consumer’s only signal, running destructive migrations before the new release is
stable, treating unknown enum values as fatal, and relying on all clients to update by
Friday all deny the reality of distributed adoption.

Version proliferation is the opposite failure. Support windows and removal criteria
must be explicit so compatibility work converges.

## Litmus test

> Can the previous and next release run concurrently against the same interfaces and
> data while requests, events, jobs, and rollbacks move between them—without data loss,
> semantic ambiguity, or a synchronized consumer upgrade?

Then rehearse stopping midway through the migration. The system must have one named
source of truth, visible progress, and a safe resume or reversal path.

## Research lineage

Semantic Versioning starts with a precise public API and makes incompatible change
explicit. Kubernetes’ API policy demonstrates stronger lifecycle discipline through
deprecation windows, conversion, and compatibility guarantees for persisted data.

*Sources: [Semantic Versioning 2.0.0](https://semver.org/) and [The Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/).*
