---
number: 1
numeral: "I"
slug: codebase
title: "Codebase"
tagline: "Make every deploy traceable to one authoritative source history"
commandment: "Map every deploy to one authoritative source history."
boundary: "This requires traceable release identity, not one repository per service or a ban on monorepos."
original: true
category: "Source"
reading: "4 min"
---

Every running instance of an application should be explainable from one authoritative
version-control history. Production, staging, review environments, and developer
machines may run different revisions, but they are deploys of the same codebase—not
hand-maintained cousins that merely resemble one another.

## The commandment

A **codebase** is the history from which a deployable application is built. One
codebase can produce many deploys; one deploy must not be assembled from mystery
files, a laptop’s unpushed changes, or code copied between repositories. If two
components can be built, released, scaled, and retired independently, treat them as
separate applications even when they live in a monorepo.

This distinction matters. “One app, one repository” is a useful default, not a law.
A monorepo can contain many applications when each has an explicit build root,
ownership boundary, dependency graph, and release identity. Conversely, splitting one
application across repositories does not create healthy modularity if a release still
requires an undocumented combination of branch tips.

## What good looks like

- Every artifact records the source revision, build definition, and repository that
  produced it. Operators can move from a running instance back to reviewed source.
- Infrastructure definitions, database migrations, interface schemas, and delivery
  workflows that must change with the application are versioned beside it or pinned
  by digest from another authoritative codebase.
- Shared code becomes a declared dependency with an owner and version. It is not
  copied into several trees and patched independently.
- Branches are collaboration surfaces. A release identifies an immutable revision,
  and [Factor V](/factors/build-release-run) turns that revision into one immutable
  artifact promoted across environments.

The purpose is not repository tidiness. It is **causal clarity**: when behavior
changes, there is one inspectable history of who changed what, why it was reviewed,
which evidence passed, and where the resulting artifact ran.

## Common failure modes

Watch for deployment scripts that copy files from a shared server, hotfixes performed
directly on production hosts, environment-specific branches that drift for months,
libraries vendored by copy-and-paste, or a “release” assembled from whatever happens
to be at the tip of several repositories. Each creates a state that version control
cannot faithfully reproduce.

Also avoid mistaking a huge repository for a single application. If no team can name
the deployable boundaries, a monorepo becomes a correlated-release machine rather
than a source-of-truth advantage.

## One history, curated deliberately

An authoritative history stays authoritative only if the team curates it the same
way every time. Choose one landing strategy—rebase feature branches and squash, or
merge commits that preserve deliberate series—then encode it in the forge's
settings and disable the alternatives. Shared history is immutable: once commits
are on a branch others consume, they are never rewritten, and force-push stays
reserved for an author's own unshared work.

Review is part of the history, not an obstacle to it. Every change lands through a
small, reviewed request with at least one non-author approval, and review latency
is a team agreement—slow review quietly manufactures the oversized diffs it then
struggles to read. Six months later, `git log` should read as a sequence of
reviewed decisions, each explaining what changed and why.

## Litmus test

> Pick any running instance. Can an engineer identify one immutable source revision,
> rebuild its artifact without private workstation state, and explain every other
> codebase that contributed through pinned dependencies?

If the answer requires guessing a branch, asking who last copied a file, or checking
an unversioned server directory, the application does not have an authoritative
codebase yet.

*Modernized from [Factor I of the original twelve-factor methodology](https://12factor.net/codebase).*
