---
number: 5
numeral: "V"
slug: build-release-run
title: "Build, Release, Run"
tagline: "Create once, bind configuration once, promote without mutation"
commandment: "Build once, identify every release immutably, and promote the same artifact unchanged."
boundary: "Pipeline stages may share tooling, but artifact bytes and release identity must never blur."
original: true
category: "Delivery"
reading: "5 min"
---

Delivery has three distinct transformations. **Build** turns reviewed source and
locked dependencies into an immutable artifact. **Release** binds that artifact to a
specific deploy configuration and records the decision. **Run** executes the release
without changing its contents.

## The commandment

The same artifact moves through environments. Production is not rebuilt from the
same branch with different flags, dependencies, or credentials. A release is uniquely
identifiable and append-only: once published, its bytes and metadata never change.
Rollback selects an earlier known release rather than attempting to reverse-engineer
the current machine.

This separation creates two independent questions during an incident: “Are these the
artifact bytes we approved?” and “Which configuration was bound to them here?” Mixing
the stages makes both answers ambiguous.

## What good looks like

- The build runs in an isolated, reproducible environment and emits an artifact,
  digest, dependency inventory, test evidence, and provenance. Factor
  [XIV](/factors/supply-chain-integrity) hardens this chain.
- Release assembly records the artifact digest, configuration version or fingerprint,
  migrations, approvals, actor, time, and target environment under one release ID.
- The runtime starts only verified artifacts. It does not compile source, download
  floating dependencies, patch files, or pull new code on boot.
- Promotion refers to the same digest across test, staging, canary, and production.
  Environment-specific configuration is bound later per [Factor III](/factors/config).
- Roll-forward and rollback paths are automated and rehearsed, including the data
  compatibility constraints described by [Factor XIX](/factors/evolutionary-compatibility).

A Git tag can name source, but it is not by itself a release. A production release is
the complete, immutable binding between source-derived artifact, deploy configuration,
evidence, and target.

## Common failure modes

Building inside each environment, using mutable image tags, editing a container after
startup, running database migrations from an engineer’s checkout, or deploying a
branch tip all collapse the stages. So does a pipeline that rebuilds an artifact
during rollback: that creates new bytes, not the prior release.

Beware pipelines that are reproducible only while external registries retain every
mutable input. Capture or mirror critical build inputs and verify them before use.

## Litmus test

> Given a production release ID, can an operator identify and verify one artifact
> digest, its source and build provenance, the configuration bound in that
> environment, and the exact prior release available for rollback?

Then promote the artifact to another environment and compare digests. If any byte
changes after build, the stages are not separated.

*Modernized from [Factor V of the original twelve-factor methodology](https://12factor.net/build-release-run).*
