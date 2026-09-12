---
layout: ../../layouts/Factor.astro
number: 10
title: Dev/prod parity
tagline: Keep development, staging, and production as similar as possible
---

The twenty-two-factor app is designed for **continuous deployment** by keeping the gaps
between development and production small: the **time gap** (code ships in hours, not
months), the **personnel gap** (the people who write it deploy it and watch it run), and
the **tools gap** (every environment runs the same stack).

## The modern restatement

Containers largely solved the tools gap the original factor worried about — the same image
runs on a laptop and in production. The gaps that remain are sneakier:

- **Same artifact, same digest.** Parity's strongest form: the OCI image
  (see [Factor 15](/factors/15-open-containers/)) promoted to production is byte-identical
  to the one tested in staging. Environments differ only by config
  (see [Factor 03](/factors/03-config/)).
- **Backing services match in kind and version.** SQLite in dev against Postgres in prod is
  the classic self-inflicted wound. Run the real services locally in containers, matching
  major versions. Adapters that promise equivalence always leak.
- **Config drift is parity drift.** When config is versioned in the repo per
  [Factor 13, Encrypted config](/factors/13-encrypted-config/), diffing staging against
  production is `git diff env/enc/staging.env.enc env/enc/production.env.enc` — reviewable,
  explainable, fixable. Unversioned config makes drift invisible until it pages you.
- **Infrastructure has parity too.** Environments built from the same infrastructure code
  and the same machine images (see
  [Factor 17, Immutable infrastructure](/factors/17-immutable-infrastructure/)) can't
  wander apart by hand-edit.
- **Preview environments shrink the time gap.** Ephemeral per-change deploys — production
  in miniature, torn down on merge — catch integration surprises before they're layered
  under a week of other changes.

## The litmus test

"It works on my machine" should be a tautology, not a punchline. When dev and prod share
artifacts, service versions, and versioned config, it usually is.
