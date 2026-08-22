---
number: 3
numeral: "III"
slug: config
title: "Config"
tagline: "Configuration varies per deploy; code does not"
original: true
---

An app's **config** is everything that varies between deploys: resource handles to
databases and caches, credentials to external services, per-environment hostnames.
Code is the same across all deploys; config is what differs. The original twelve-factor
test still holds: could the codebase be open-sourced this minute without compromising
any credentials?

The original methodology answered this with environment variables kept *outside* the
codebase — the `.env`-file era. Twenty-two-factor keeps the strict **separation of
config from code**, but rejects the conclusion that config must therefore live outside
version control. Unversioned `.env` files scattered across laptops and CI settings
pages are unauditable, undiffable, easy to lose, and drift silently between deploys.

Instead, this methodology splits config handling across three factors:

- **[Factor XIII](/factors/encrypted-config)** — config lives *in* the repo, encrypted,
  under `env/enc/`, and is decrypted at deploy time to `env/dec/*.env`, which is never
  committed.
- **[Factor XIV](/factors/root-secrets)** — the one or two root secrets that make
  decryption possible live outside the repo in an external secret service such as
  fiducia-cloud.
- The app itself still reads plain environment variables at runtime, exactly as the
  original Factor III prescribed. Nothing about your application code changes; what
  changes is where the values are stored and how they are audited.

Config remains granular per deploy, never grouped into named "environments" baked into
the code.

> **The litmus test:** could the codebase be open-sourced this minute without leaking a credential — and can you say who changed any config value, when, and in which release it shipped? Twenty-two-factor answers yes to both.

*Adapted from Factor III of the original [twelve-factor methodology](https://12factor.net/config).*
