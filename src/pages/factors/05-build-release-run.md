---
layout: ../../layouts/Factor.astro
number: 5
title: Build, release, run
tagline: Strictly separate the build, release, and run stages
---

The path from codebase to running deploy has three strictly separated stages. The **build**
stage turns a specific commit into an immutable artifact — for a twenty-two-factor app,
typically an OCI image (see [Factor 15, Open containers](/factors/15-open-containers/)).
The **release** stage combines that artifact with the deploy's config to produce a release.
The **run** stage executes the release in the target environment.

## The modern restatement

- **Builds start from tags.** A build is triggered by, and traceable to, an immutable git
  tag — not whatever a branch happened to point at when CI woke up (see
  [Factor 19, Tagged releases](/factors/19-tagged-releases/)).
- **Artifacts are immutable and content-addressed.** The same image digest that passed
  staging is what runs in production. Rebuilding "the same code" for each environment
  reintroduces the drift this factor exists to kill.
- **Releases are append-only.** Every release gets a unique identifier and can be rolled
  back to. Rollback means *run a previous release*, never *edit the current one*.
- **No code changes at runtime.** If a fix can only be applied by SSH-ing into a running
  instance, the pipeline has failed. Fix the code, cut a new tag, release again — the
  pipeline must be fast enough to make this the easy path.
- **Provenance is part of the build.** Modern build systems emit signed attestations tying
  artifact to source commit, builder, and dependencies. Keep them; they turn "what is
  actually running?" from an investigation into a lookup.

## Anti-patterns

CI pipelines that rebuild per environment; mutable image tags like `latest` in production;
config baked into images at build time (that's the release stage's job); hot-patching
running containers.
