---
number: 2
numeral: "II"
slug: dependencies
title: "Dependencies"
tagline: "Explicitly declare and isolate dependencies"
original: true
---

A twenty-two-factor app never relies on the implicit existence of system-wide packages.
It declares every dependency, completely and exactly, in a manifest checked into the
codebase, and it uses an isolation mechanism during execution so that no dependency can
leak in from the surrounding system.

The full toolkit matters: a **declaration manifest** (`package.json`, `Cargo.toml`,
`pyproject.toml`, `.zpkg.toml`), a **lockfile** that pins the exact resolved versions
(`package-lock.json`, `Cargo.lock`, `.zpkg.lock`), and an **isolated install** —
per-project module folders, virtualenvs, or a content-addressed store with per-project
symlinks in the style of pnpm and [zed-pkg](https://zpkg.net).

Two modern refinements:

**Prefer lean, provenance-traceable artifacts.** Dependency managers that fetch pruned,
content-addressed artifacts pinned to a tag *and* a commit give you a supply-chain
audit trail for free. When a dependency lives in a forge rather than a language
registry, install it as a package with pinned provenance — never as a vendored copy or
a floating `git clone`.

**Simplify shell-outs — declare the tools, don't assume them.** If the app shells out to
`curl`, `ffmpeg`, or `ImageMagick`, that's a dependency too. Under this methodology it
belongs in the container image definition (see [Factor XV](/factors/oci-not-docker)),
which is itself in the codebase, so the tool's presence and version are declared rather
than hoped for.

> **The litmus test:** the app builds on a machine that has never seen it before, with no manual setup beyond the platform toolchain — and two builds a month apart resolve the identical dependency tree.

*Adapted from Factor II of the original [twelve-factor methodology](https://12factor.net/dependencies).*
