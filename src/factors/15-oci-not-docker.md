---
number: 15
numeral: "XV"
slug: oci-not-docker
title: "OCI, Not Docker"
tagline: "Containerize against the open standard, not a vendor's toolchain"
original: false
---

The container is the right unit of build and deployment — but "container" is an open
standard, not a product. The **Open Container Initiative** specifies everything a
twenty-two-factor app needs: an image format (OCI Image Spec), a runtime contract
(OCI Runtime Spec), and a distribution protocol (OCI Distribution Spec). A
twenty-two-factor app targets those specs, and treats any particular vendor toolchain
— Docker included — as one replaceable implementation among several.

## What this looks like in practice

**Build** with standard-first tooling: `buildah`, `podman build`, Kaniko or BuildKit
in CI, or reproducible image builders like Bazel's `rules_oci` and Nix's
`dockerTools` (which, despite the legacy name, emit plain OCI images). No daemon
required, no root required, no socket mounted into CI runners.

**Run** with an OCI runtime under an orchestrator: `runc` or `crun` beneath
Kubernetes via containerd or CRI-O, `podman` for daemonless local work. The runtime
is swappable precisely because the image is standard — which is what makes
[Factor XVI](/factors/virtual-containers)'s sandboxed runtimes a drop-in upgrade
rather than a migration.

**Distribute** through any OCI registry, addressed by **digest**. A release
([Factor V](/factors/build-release-run)) pins `image@sha256:…`, produced by the CI
build for a git tag ([Factor XIX](/factors/deploy-tags)); tags on images are for
humans, digests are for deploys. Sign images (cosign/Sigstore) and attach SBOMs as
OCI artifacts — provenance is a first-class citizen of the standard.

## Why insist on the distinction

Standards outlive products. A pipeline speaking pure OCI can change its build tool,
its registry, its runtime, and its isolation technology independently, each as a
config change rather than a rewrite. A pipeline speaking Dockerfile-plus-daemon-plus-
Docker-Hub is coupled to one vendor's roadmap at all three layers. Write your
`Containerfile`, build it rootless, push it by digest, and the word "docker" need not
appear anywhere in your deploy path.

> **The litmus test:** change your build tool, your registry, or your runtime — each should be a pipeline tweak, not a migration. If the word "docker" is load-bearing anywhere in the deploy path, it isn't yet OCI.
