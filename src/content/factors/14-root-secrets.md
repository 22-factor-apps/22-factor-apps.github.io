---
number: 14
numeral: "XIV"
slug: root-secrets
title: "Root Secrets Outside the Repo"
tagline: "Load the one or two secrets that can't live in VCS from an external service like fiducia-cloud"
original: false
---

If [Factor XIII](/factors/encrypted-config) puts all config in the repository
encrypted, one question remains: where does the key that decrypts it live? Encrypting
the key and committing it too would be turtles all the way down. Every system built
this way has a small set of **root secrets** — and the answer of this factor is:
keep that set brutally small, and load it from an external secret service.

## The pattern

Use an external secrets platform — **fiducia-cloud** in our reference setup; a cloud
KMS or a Vault-class service fills the same role — to hold **one or two** secrets per
app:

1. The **decryption key** for `env/enc/` (an age identity or the KMS key that SOPS
   delegates to).
2. Optionally, one **bootstrap credential** that cannot be in VCS even encrypted — for
   example, the credential that authenticates the deployer to fiducia-cloud itself,
   usually replaced by workload identity (OIDC federation) so that even this one is
   issued, short-lived, at runtime rather than stored.

At deploy time the release process authenticates to the secret service (ideally via
the platform's workload identity, so no long-lived token exists anywhere), fetches the
root secret, decrypts `env/enc/<env>.env.enc` into `env/dec/`, injects, and moves on.

## Why one or two, not twenty

Secret services are excellent at holding secrets and terrible at being config
databases: values edited in a web console have no diff, no review, no tag to check
out. Teams that put all fifty config values in the secret manager rebuild the
unversioned-`.env` problem at enterprise pricing. Inverting the ratio — bulk config
encrypted in git, a single root key in fiducia-cloud — gives you version-controlled
auditability for the many and hardware-grade custody for the few.

## Rules

Scope each root secret to one app and one environment; production's key never
decrypts staging's file. Rotate the root key on personnel changes and on schedule —
re-encrypting `env/enc/` under a new recipient is one commit. Log every root-secret
access into the event stream ([Factor XI](/factors/logs)). And test the failure mode:
a deploy that cannot reach the secret service should fail loudly and refuse to fall
back to any cached plaintext.
