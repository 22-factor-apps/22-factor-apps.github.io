---
number: 19
numeral: "XIX"
slug: deploy-tags
title: "Deploy Tags, Not Branches"
tagline: "A branch is a moving conversation; a tag is a decision — production runs decisions"
original: false
---

A branch tip moves. Anyone who has deployed `main` twice in one afternoon and gotten
two different systems knows that "deployed from main" is not an answer to "what is
running in production?" — it's a timestamp wearing a name. Twenty-two-factor deploys
are cut from **annotated, immutable git tags**: `v2.41.0` means one commit, one build,
one release, forever.

## The flow

Work merges into `main` continuously ([Factors XXI](/factors/code-review) and
[XXII](/factors/merge-policy)); `main` stays releasable, and CI runs on every merge.
**Releasing is the separate, explicit act of pushing a tag.** The tag — annotated,
ideally signed — triggers the pipeline that builds the artifacts
([Factor V](/factors/build-release-run)): an OCI image pushed by digest
([Factor XV](/factors/oci-not-docker)), machine images if the release reaches that
deep ([Factor XVII](/factors/immutable-infra)). Environments then *promote the same
artifact*: staging runs `v2.41.0`, production runs `v2.41.0` after its gate
([Factor XX](/factors/human-in-the-loop)) — never a rebuild, never "the same branch."

## Why tags win

**Identity.** Every question about production — what's running, what changed since,
which config shipped with it ([Factor XIII](/factors/encrypted-config)) — resolves to
`git checkout v2.41.0`. **Rollback is a noun.** Redeploy `v2.40.2`; no revert commits
at 3 a.m., no force-pushes. **No environment branches.** `develop`/`staging`/`prod`
branches drift, hotfixes land on one and not another, and merges between them
manufacture conflicts; tags plus artifact promotion delete the entire failure class.
**Auditability.** The tag list *is* the release ledger, each with an author, a date,
and a changelog in the annotation.

## Rules

Tags are immutable — never move or reuse one; a bad release gets a new tag (or a
`+hotfix.1` successor cut from the release commit). Use semver so operational tooling
can reason about upgrade distance. Protect tag creation to the release pipeline and
release managers. And dogfood note: this very site deploys on `v*` tags — pushing to
`main` alone deploys nothing, exactly as prescribed.
