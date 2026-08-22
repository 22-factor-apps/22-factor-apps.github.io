---
number: 5
numeral: "V"
slug: build-release-run
title: "Build, Release, Run"
tagline: "Strictly separate build and run stages"
original: true
---

A codebase becomes a running deploy through three strictly separated stages:

- **Build** — transform the code at a given tag into an executable bundle: fetch
  dependencies at lockfile-pinned versions, compile, and produce an artifact. Under
  this methodology the canonical build artifact is an **OCI image** (see
  [Factor XV](/factors/oci-not-docker)) or an immutable machine image (see
  [Factor XVII](/factors/immutable-infra)).
- **Release** — combine the build with the deploy's config (decrypted from `env/enc/`
  at this moment, per [Factor XIII](/factors/encrypted-config)) into a release that is
  ready for immediate execution.
- **Run** — launch processes from the release in the execution environment.

Changes cannot flow backward: there is no editing code at runtime, no tweaking config
inside a running container. Every release has a unique, ordered identifier, and under
this methodology the release identity is anchored to a **git tag** rather than the tip
of a branch (see [Factor XIX](/factors/deploy-tags)) — so "what is production running?"
always has a one-word answer.

Releases are append-only. Rolling back means running a previous release, not mutating
the current one. Keep old builds and old encrypted config reachable — with config
encrypted *in* the repo, checking out an old tag reproduces the code **and** the config
that shipped with it, which the original methodology could never quite promise.

> **The litmus test:** if a fix can only be applied by editing something inside a running container, the pipeline has failed. Fix the code, cut a new tag, release again — and make that path fast enough to be the easy one.

*Adapted from Factor V of the original [twelve-factor methodology](https://12factor.net/build-release-run).*
