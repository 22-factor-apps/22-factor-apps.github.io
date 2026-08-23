---
layout: ../../layouts/Factor.astro
number: 12
title: Admin processes
tagline: Run admin and management tasks as one-off, versioned processes
---

Database migrations, backfills, data repairs, console sessions: **admin processes** run as
one-off processes in an environment identical to the app's regular processes — same
release, same artifact, same config — and their code ships in the same codebase.

## The modern restatement

- **Same release, same image.** A migration runs from the exact release it belongs to,
  launched as a one-off container/job from the same image digest as the running app
  (see [Factor 05, Build, release, run](/factors/05-build-release-run/)). Running
  yesterday's migration against today's schema assumptions is how backfills become
  incidents.
- **Migrations are code, reviewed and rehearsed.** Schema changes ship expand/contract
  style — additive first, destructive only after the code that needed the old shape is
  gone — and are rehearsed against production-like data in staging
  (see [Factor 10, Dev/prod parity](/factors/10-dev-prod-parity/)).
- **One-offs are jobs, not SSH sessions.** The platform's job primitive gives admin tasks
  the same logging (see [Factor 11](/factors/11-logs/)), resource limits, and audit trail
  as everything else. An untracked shell poking production is the anti-pattern this factor
  exists to end.
- **Destructive operations get a human gate.** Dropping data, rewriting records, and
  irreversible cleanups warrant explicit approval and a second set of eyes — this is
  [Factor 20, Human in the loop](/factors/20-human-in-the-loop/) applied to operations.
- **Repair scripts join the codebase.** The fix you wrote at 2 a.m. will be needed again.
  Commit it, review it in daylight, and give it tests — future-you is the beneficiary.

## The litmus test

Every admin action on production should answer four questions afterward: what ran, from
which release, who approved it, and what it output. Jobs answer all four for free; ad-hoc
shells answer none.
