---
layout: ../../layouts/Factor.astro
number: 16
title: Virtual isolation
tagline: Choose isolation deliberately — containers, microVMs, or a virtual OS
---

A container shares its host's kernel; that's what makes it fast, and it's also the entire
limit of its security. The twenty-two-factor app treats **isolation strength as an explicit
design decision**, matched to what the workload runs — not an accident of whatever the
platform defaulted to.

## The spectrum

- **Standard containers** (runc under containerd/CRI-O): shared kernel, near-zero
  overhead. Right for your own trusted, first-party code — which is most of your fleet.
- **Sandboxed runtimes / virtual OS** (gVisor and similar): a userspace kernel
  re-implements the syscall surface, so the workload never talks to the host kernel
  directly. Right when the code is *mostly* trusted but the blast radius must shrink.
- **Virtual containers / microVMs** (Firecracker, Cloud Hypervisor, Kata Containers): each
  workload gets its own hardware-virtualized kernel with millisecond-class boot times.
  Right for multi-tenant platforms, running customer-submitted or AI-generated code, and
  any workload where kernel escape is an unacceptable outcome.
- **Full VMs and dedicated hosts**: the heavy end, still correct for hard compliance
  boundaries and noisy-neighbor-sensitive workloads.

## The discipline

- **Classify workloads by trust, then map each class to a tier.** First-party services,
  third-party dependencies executing at runtime, and untrusted user code do not belong in
  the same isolation class — write the mapping down and enforce it at admission.
- **Keep the artifact constant.** The same OCI image
  (see [Factor 15](/factors/15-open-containers/)) should run under runc, gVisor, or a
  microVM unchanged — isolation is a *runtime class*, one line of deploy config, so
  upgrading a workload's isolation is not a rebuild.
- **Budget the overhead honestly.** Sandboxes tax syscall-heavy I/O; microVMs cost memory
  per instance. Measure with your workload; pay for isolation where it buys real risk
  reduction.
- **Isolation is not an excuse.** A microVM around a container full of unpatched CVEs is a
  clean cage around a sick animal. This factor stacks on image hygiene
  (see [Factor 15](/factors/15-open-containers/)) and immutable hosts
  (see [Factor 17](/factors/17-immutable-infrastructure/)) — it doesn't replace them.

## The litmus test

For any process in the fleet, you should be able to answer: *what's the worst code that
could run here, and what kernel does it share with whom?* If the answer surprises anyone,
the isolation tier was chosen by default, not by design.
