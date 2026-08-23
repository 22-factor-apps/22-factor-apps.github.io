---
layout: ../../layouts/Factor.astro
number: 13
title: Encrypted config
tagline: Commit env vars to the repo — encrypted, versioned, and reviewed
---

The twelve-factor era told us to keep environment variables *out* of version control:
`.env` files on laptops, secret values pasted into CI settings and platform dashboards.
The result, at scale, is config that is **unversioned, unreviewed, unauditable, and
scattered** — the last remaining part of the system that ignores every discipline the other
factors established for code.

The twenty-two-factor app inverts the rule: **environment variables live in the repo,
encrypted**.

## The shape of it

```text
env/
├── enc/                    # committed — ciphertext
│   ├── production.env.enc
│   ├── staging.env.enc
│   └── development.env.enc
└── dec/                    # gitignored — plaintext, generated
    ├── production.env
    └── staging.env
```

- Secret values are encrypted **value-by-value**, keys left readable, so diffs and reviews
  still make sense (`DATABASE_URL` changed; the reviewer sees *which* variable, not the
  plaintext).
- At deploy or boot, tooling decrypts `env/enc/*.env.enc` to `env/dec/*.env` and the
  platform injects the result as ordinary environment variables — the runtime contract of
  [Factor 03, Config](/factors/03-config/) is unchanged. `env/dec/` is disposable,
  gitignored, and never leaves the machine that needed it.
- The decryption key is **not in the repo** — it's the root of trust, held externally
  (see [Factor 14](/factors/14-root-of-trust/)).

Mature tooling exists — SOPS with age or KMS, sealed-secrets, git-crypt — and the pattern
works with any of them.

## Why this wins

Config changes get pull requests, reviewers, history, and rollback — the same machinery as
code, because they cause incidents like code. Environments can be diffed
(see [Factor 10, Dev/prod parity](/factors/10-dev-prod-parity/)). Disaster recovery needs
the repo plus one key, not a scavenger hunt across dashboards. And onboarding is
`git clone` plus key access, not a folklore-driven `.env` assembly ritual.

## The rule of thumb

If a config value would page someone when wrong, it belongs in `env/enc/` where changing it
requires a reviewed commit. The repo remains safe to open-source at any moment — everything
secret in it is ciphertext.
