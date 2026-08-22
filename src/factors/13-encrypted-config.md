---
number: 13
numeral: "XIII"
slug: encrypted-config
title: "Encrypted Config in the Codebase"
tagline: "Commit config encrypted in env/enc — decrypt to env/dec at deploy time, never commit plaintext"
original: false
---

The original twelve-factor methodology told you to keep config in the environment and
out of the repo — and the industry translated that into `.env` files: unversioned,
unaudited plaintext scattered across laptops, CI secret pages, and pastebins-of-shame.
Twenty-two-factor inverts the storage decision while keeping the runtime contract:
**config lives in the repository, encrypted; plaintext exists only at the moment of
use, and never in version control.**

## The layout

```
env/
├── enc/                     # committed — encrypted with age or SOPS
│   ├── production.env.enc
│   ├── staging.env.enc
│   └── dev.env.enc
└── dec/                     # gitignored — decrypted output, deploy-time only
    └── production.env       # never committed, never leaves the machine
```

Each deploy environment gets one encrypted file under `env/enc/`. At deploy (or local
dev) time, a single command decrypts the file for the target environment into
`env/dec/*.env`, and the process manager loads it into the environment of the app's
processes. The app still reads plain environment variables, exactly per
[Factor III](/factors/config).

## Why encrypt-in-repo wins

**Config gets a history.** Every credential rotation, every new resource handle, is a
commit — diffable, reviewable ([Factor XXI](/factors/code-review)), revertible, and
attributable. "What changed in production config last Tuesday?" becomes `git log
env/enc/production.env.enc`.

**Releases become fully reproducible.** Checking out a tag
([Factor XIX](/factors/deploy-tags)) reproduces code *and* the config that shipped
with it — the original methodology's build/release split, finally with both halves
under version control.

**No out-of-band sync.** New teammate, new CI runner, new region: `git clone` delivers
the config. The only thing they need from outside the repo is the decryption key —
which is precisely the job of [Factor XIV](/factors/root-secrets).

## Rules

Use a modern, audited AEAD tool — [age](https://age-encryption.org) or
[SOPS](https://github.com/getsops/sops) — not ad-hoc OpenSSL invocations. Gitignore
`env/dec/` and every loose `*.env` so plaintext cannot land in history even by
accident. Rotate any value that was ever committed unencrypted; encryption added after
the fact does not un-leak a secret. And keep the decrypted lifetime short: decrypt at
release assembly ([Factor V](/factors/build-release-run)), inject, and clean up.

> **The litmus test:** if a config value would page someone when wrong, it belongs in `env/enc/`, where changing it requires a reviewed commit — and the repo stays safe to open-source at any moment, because everything secret in it is ciphertext.
