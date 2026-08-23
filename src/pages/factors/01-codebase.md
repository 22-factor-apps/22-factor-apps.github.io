---
layout: ../../layouts/Factor.astro
number: 1
title: Codebase
tagline: One codebase tracked in version control, many deploys
---

A twenty-two-factor app is always tracked in a version control system — in practice, git.
There is exactly **one codebase per app**: a single repository (or a well-defined
subdirectory of a monorepo) that is the sole source of truth for what the app *is*.

A **deploy** is a running instance of that codebase: production, staging, preview
environments, and every developer's local copy. All deploys share the same codebase, even
though each may run a different revision.

## The modern restatement

The original factor still holds — but the ecosystem has settled some questions it left open:

- **Monorepos are fine.** "One codebase per app" means one *authoritative location*, not
  necessarily one repository per service. A monorepo hosting many apps satisfies this factor
  as long as each app has a clearly bounded root and its own build and release pipeline.
- **Shared code is a dependency.** If two apps need the same code, that code is factored
  into a library and consumed through the dependency manager (see
  [Factor 02, Dependencies](/factors/02-dependencies/)) — never copy-pasted between codebases.
- **The repo is the deployable unit of truth.** Everything a deploy needs — including
  configuration, encrypted where secret (see
  [Factor 13, Encrypted config](/factors/13-encrypted-config/)) — lives in, or is derived
  from, the codebase.

## Anti-patterns

Multiple repos "sharing" hand-synced copies of the same app; snowflake deploys built from
code that exists only on a build server; hotfixes applied directly to production that never
land back in the repo. If you can't point to the commit a deploy is running, you don't have
a codebase — you have an archaeology project.
