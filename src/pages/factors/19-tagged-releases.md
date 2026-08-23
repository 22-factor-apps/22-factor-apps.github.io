---
layout: ../../layouts/Factor.astro
number: 19
title: Tagged releases
tagline: Deploy immutable git tags, never moving branches
---

A branch is a moving pointer; whatever `main` means right now, it will mean something else
after the next merge. The twenty-two-factor app therefore **deploys from git tags** —
immutable, human-created names for exact commits — and never from branches. "What's in
production?" must have a one-word answer, and that word is a tag.

## The discipline

- **Tags are the only deploy trigger.** CI builds and ships when an annotated tag matching
  the release pattern (`v1.4.2`) is pushed — not on every push to a branch. Branch pushes
  run tests and build previews; **tags create releases**
  (see [Factor 05, Build, release, run](/factors/05-build-release-run/)).
- **Tags are annotated, signed, and protected.** An annotated tag records who cut the
  release and when; a signed tag proves it. Repository rules forbid moving or deleting
  release tags — a tag that can be force-pushed is just a slow branch.
- **Cutting a tag is deliberate.** Continuous *delivery* means every commit on `main` is
  releasable; it does not require that every commit deploys itself. The tag is where a
  human (or a policy bot) says "ship this" — the natural anchor for
  [Factor 20, Human in the loop](/factors/20-human-in-the-loop/).
- **Rollback is a tag too.** Re-deploy the previous tag; the artifact for it still exists,
  by digest (see [Factor 15](/factors/15-open-containers/)). No revert-merge scramble, no
  "which commit was good?" debate at 3 a.m.
- **Provenance chains end at the tag.** Attestation ties image digest → commit → tag →
  approver. Auditors, incident reviewers, and future-you all walk the same chain.

## Anti-patterns

Deploying `main` on every merge with no release identity; `latest` images promoted by
timestamp; re-tagging a different commit with the same version; environment branches
(`prod`, `staging`) that get force-pushed as a "deploy mechanism" — every one of these
makes "what is running?" a research question.

## The litmus test

At any moment, `git describe` on the production deploy should print a tag that appears in
your release notes, your registry, and your audit log — the same tag in all three.
