---
layout: ../../layouts/Factor.astro
number: 2
title: Dependencies
tagline: Explicitly declare, isolate, and verify dependencies
---

A twenty-two-factor app never relies on the implicit existence of system-wide packages. All
dependencies are **declared** completely and exactly in a manifest, **isolated** so nothing
leaks in from the surrounding system, and — the modern addition — **verified** against a
lockfile so every build resolves the identical dependency tree.

## The modern restatement

In 2011 the battle was getting teams to declare dependencies at all. That battle is won;
today's risks are subtler:

- **Lockfiles are mandatory.** A manifest expresses intent; the lockfile
  pins the exact resolved versions and their content hashes. Both are committed. A build
  that resolves dependencies freshly at deploy time is a build you cannot reproduce.
- **The supply chain is an attack surface.** Typosquatting, hijacked maintainer accounts,
  and malicious post-install scripts are routine. Pin versions, verify checksums and (where
  available) signatures and provenance attestations, and vet new dependencies as seriously
  as new code — they *are* new code, running with your app's privileges.
- **Build tools are dependencies too.** The compiler, runtime, and package manager versions
  belong in the repo (version files, container build stages) so that dev, CI, and production
  agree (see [Factor 10, Dev/prod parity](/factors/10-dev-prod-parity/)).

## Isolation

Use the ecosystem's isolation mechanism — virtual environments, vendored modules,
per-project toolchains — and build inside containers (see
[Factor 15, Open containers](/factors/15-open-containers/)) so the host system contributes
nothing to the result. If the app builds on a machine that has never seen it before with no
manual setup beyond the platform toolchain, this factor is satisfied.
