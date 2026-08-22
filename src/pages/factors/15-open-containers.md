---
layout: ../../layouts/Factor.astro
number: 15
title: Open containers
tagline: Build to the OCI standard, not to a vendor
---

The twenty-two-factor app ships as a container image — but it targets the **Open Container
Initiative specifications**, not any particular vendor's product. "Docker" is a company and
a toolchain; **OCI is the standard**: the image format, the runtime contract, and the
distribution protocol that every serious registry, orchestrator, and runtime already speaks.

## The discipline

- **Build with standards-first tooling.** Buildah, BuildKit in standalone mode, kaniko,
  ko, Podman — any builder that emits OCI images. Prefer declarative, daemonless builds
  in CI over builds that require a privileged, long-running Docker daemon.
- **Run on OCI runtimes.** In production your orchestrator already runs containerd or
  CRI-O over `runc` — not Docker. Local development with Podman or containerd-based
  tooling keeps dev/prod parity honest (see
  [Factor 10](/factors/10-dev-prod-parity/)); the same image runs everywhere the spec is
  honored.
- **Address images by digest.** Tags are pointers that move; digests are content hashes
  that don't. Releases pin digests (see
  [Factor 05, Build, release, run](/factors/05-build-release-run/)), matching the
  tags-not-branches rule on the source side
  (see [Factor 19, Tagged releases](/factors/19-tagged-releases/)).
- **Keep images minimal and rootless.** Distroless or slim bases, multi-stage builds, a
  non-root user, no package manager or shell in the final layer that production doesn't
  need. Small images start faster (see [Factor 09](/factors/09-disposability/)) and carry
  less attack surface.
- **Sign and attest.** Sign images and attach SBOM/provenance attestations at build time;
  verify at admission. The image is the deployable unit of trust — treat it like one.

## Why vendor neutrality matters

Registries, ship-tools, and runtimes all compete on the same spec — which means switching
any of them is a pipeline tweak, not a migration. That's this factor's payoff: the
container layer, like every other layer of a twenty-two-factor app, stays **swappable**.
