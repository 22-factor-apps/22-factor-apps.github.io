---
number: 2
numeral: "II"
slug: dependencies
title: "Dependencies"
tagline: "Declare, resolve, verify, and isolate every dependency"
commandment: "Declare, lock, verify, and isolate every build and runtime dependency."
boundary: "A manifest alone is not reproducibility, and vendoring alone is not integrity."
original: true
category: "Build"
reading: "5 min"
---

An application should never succeed because a convenient package, compiler, shared
library, certificate bundle, or command happens to be installed on one machine.
Everything required to build and run it is declared; everything resolved from those
declarations is pinned and verifiable.

## The commandment

Use the ecosystem’s dependency declaration and isolation mechanisms. A manifest says
what the application permits. A lockfile or equivalent resolution says exactly what
was selected, including transitive dependencies. An isolated build and runtime ensure
that undeclared software cannot silently satisfy an import or alter behavior.

The modern dependency graph is wider than application libraries. It includes the
language toolchain, package manager, code generators, operating-system packages,
container base image, CI actions, browser assets, policy bundles, and plugins loaded
at runtime. A floating `latest` image is as undeclared as a library copied into
`/usr/local/lib` by hand.

## What good looks like

- Commit manifests and lockfiles. Update them through reviewed, automated changes
  that show what moved and why.
- Pin build images and external automation by immutable digest where the ecosystem
  supports it. Record toolchain versions in the build definition.
- Build in a clean environment with network access restricted to the explicit
  resolution step. A second build from the same inputs should not discover new code.
- Maintain an inventory or software bill of materials for the released artifact, then
  connect it to vulnerability and license policy. [Factor XIV](/factors/supply-chain-integrity)
  adds provenance, signatures, and admission verification.
- Remove dependencies that no longer earn their attack surface, update burden,
  startup cost, or operational complexity.

Isolation applies at runtime too. The application must not assume a shell utility,
system package, or globally installed interpreter module unless that dependency is
part of the declared runtime image. Prefer a minimal runtime that contains only what
the process needs.

## Common failure modes

Typical violations include `npm install` without a lockfile in CI, broad version
ranges resolved afresh during every deployment, unpinned Git URLs, mutable container
tags, build scripts that download executables without checking a digest, and a local
tooling dependency documented only as “install the usual stuff.”

Vendoring is not automatically safer. Checked-in dependency source still needs an
origin, version, update path, license record, and integrity story. A repository full
of abandoned copies is a dependency graph with its labels removed.

## Dependencies from forges

Language registries are not the only source of dependencies. When a dependency
lives in a forge—an internal library, a sibling application's client, a tool
distributed as source—install it as a package with pinned provenance, never as a
vendored copy or a floating clone. Version-control-native package managers such
as [zed-pkg](https://zpkg.net) resolve a semver range to a tag, pin the tag and
the commit hash in a lockfile, and fetch a pruned artifact rather than repository
history. The team standard: registry-distributed toolchains stay in the language
manifest; forge-hosted dependencies are declared in `.zpkg.toml` and locked in
`.zpkg.lock`, so both kinds of input satisfy the same test—declared, resolved,
verified, and isolated.

## Litmus test

> Start from a minimal clean builder with only the declared bootstrap toolchain. Can
> it resolve the locked graph, verify every fetched input, and build without reading
> globally installed packages or mutable tags?

Then remove network access and rebuild from the captured inputs. An unexpected fetch
or a changed artifact reveals an undeclared dependency or non-hermetic build.

*Modernized from [Factor II of the original twelve-factor methodology](https://12factor.net/dependencies).*
