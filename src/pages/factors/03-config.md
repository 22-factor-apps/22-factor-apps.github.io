---
layout: ../../layouts/Factor.astro
number: 3
title: Config
tagline: Config varies by deploy — version it with the code, encrypted where secret
---

An app's **config** is everything that varies between deploys: backing service handles,
credentials, hostnames, feature flags, tuning values. Code is the same everywhere; config is
what makes this deploy *this* deploy. The original factor's core insight stands: **strict
separation of config from code**, with the app reading config from its environment at
runtime.

## Where twenty-two-factor departs from twelve-factor

The original prescription was environment variables managed *outside* version control —
`.env` files on developer laptops, values typed into platform dashboards and CI settings
pages. Fifteen years of practice exposed the cost: config that is **unversioned,
unreviewed, unauditable, and drifting**. Nobody knows who changed `DATABASE_POOL_SIZE`, when,
or why; staging and production diverge silently; the `.env` file on the departed engineer's
laptop was the only complete copy.

The twenty-two-factor app keeps the *runtime contract* — the app still reads plain
environment variables and stays agnostic about where they come from — but changes the
*management model*:

- **Config lives in the repo, encrypted where secret.** Deploy-specific env files are
  committed under `env/enc/`, with secret values encrypted. Changes to config go through
  the same review, history, and rollback as changes to code. This is
  [Factor 13, Encrypted config](/factors/13-encrypted-config/).
- **Only the root of trust lives outside.** The one or two keys needed to decrypt are held
  in an external secrets service, never in the repo. This is
  [Factor 14, Root of trust](/factors/14-root-of-trust/).

## The litmus test

Could the codebase be open-sourced this minute without leaking a credential? Under
twelve-factor the answer was "yes, because the secrets aren't in the repo." Under
twenty-two-factor the answer is "yes, because the secrets in the repo are ciphertext" — and
unlike the old model, you can also answer *who changed any config value, when, and in which
release it shipped*.
