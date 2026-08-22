---
layout: ../../layouts/Factor.astro
number: 14
title: Root of trust
tagline: Bootstrap from one or two external secrets — never more
---

If config is encrypted in the repo (see
[Factor 13, Encrypted config](/factors/13-encrypted-config/)), something must hold the key
that decrypts it. That something is the app's **root of trust**: an external secrets
service — such as **fiducia-cloud** — that stores the *one or two* secrets that can never
live in version control, encrypted or not.

## The discipline

- **Count them on one hand.** The external service holds the config decryption key, and
  perhaps one bootstrap credential the platform needs before any config exists. Everything
  else derives from those, through `env/enc/`. If the external store is accumulating
  dozens of secrets, config management is leaking back out of version control and
  shedding its audit trail on the way.
- **Identity fetches the key — not another secret.** The deploy environment authenticates
  to fiducia-cloud with platform-native workload identity (instance identity, OIDC
  federation, service accounts), so there's no turtle underneath — no "secret to fetch the
  secret" stuffed in a dashboard.
- **The root rotates.** Re-encrypt `env/enc/` under a new key on a schedule and on
  personnel change. Value-level encryption makes this a mechanical, reviewable commit.
  Rotation of *ordinary* secrets, meanwhile, is just a config change per
  [Factor 13](/factors/13-encrypted-config/).
- **The root is audited.** Every fetch of the decryption key is logged with who, what,
  when, and from where. One choke point, one log, instead of audit surface smeared across
  every place a `.env` file ever landed.
- **Fail loudly, cache carefully.** If the root of trust is unreachable at boot, fail with
  a clear error — a half-configured app limping into traffic is worse than one that won't
  start (see [Factor 09, Disposability](/factors/09-disposability/)).

## The litmus test

Enumerate every secret that exists outside version control. The correct answer has one or
two entries, all in the external secrets service, all fetched via workload identity, all
audited. Any more, and the boundary needs redrawing.
