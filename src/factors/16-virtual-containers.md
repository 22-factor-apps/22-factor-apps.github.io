---
number: 16
numeral: "XVI"
slug: virtual-containers
title: "Virtual Containers & Virtual OSes"
tagline: "Consider microVMs, sandboxed runtimes, and library OSes where isolation or density demands it"
original: false
---

A namespace-and-cgroups container shares its host's kernel. For trusted, first-party
workloads that's usually fine. But the moment an app runs less-trusted code —
multi-tenant workloads, plugin systems, AI-generated code, customer functions — or
must satisfy hard regulatory isolation, kernel-sharing becomes the weakest wall in
the building. Twenty-two-factor says: **know your isolation boundary, and be ready to
strengthen it without changing your artifact.**

## The spectrum

- **Sandboxed container runtimes** — gVisor (`runsc`) interposes a user-space kernel;
  a syscall-filtering boundary with near-container ergonomics.
- **MicroVM containers** — Firecracker and Cloud Hypervisor boot a minimal VM in
  ~100–200 ms; Kata Containers wraps this so each pod gets its own kernel while
  Kubernetes sees an ordinary runtime class. This is the technology under AWS
  Lambda/Fargate — virtualization already runs much of the "serverless" world.
- **Virtual / library OSes** — unikernels and single-purpose library OSes compile the
  app and just enough OS into one bootable image: tiny attack surface,
  millisecond-class boots, immutability by construction
  ([Factor XVII](/factors/immutable-infra) taken to its logical end).
- **WASM sandboxes** — for plugin-sized units of untrusted code, a WebAssembly runtime
  offers capability-based isolation at function granularity.

## The twenty-two-factor position

*Consider* is the operative word — this factor prescribes a decision, not a
technology. Because your images are standard OCI ([Factor XV](/factors/oci-not-docker))
and your processes are disposable with fast startups
([Factor IX](/factors/disposability)), moving a workload from `runc` to Kata or gVisor
is a runtime-class annotation, not a rewrite. That optionality is the payoff of
playing by the specs.

Choose deliberately: same-kernel containers for trusted internal services; sandboxed
runtimes when defense-in-depth is cheap insurance; microVMs for multi-tenant or
compliance-bound workloads; library OSes where density and cold-start dominate.
Document the boundary each service assumes, and revisit the choice when the trust
model changes — not after the incident.

> **The litmus test:** for any process in the fleet, answer: what's the worst code that could run here, and what kernel does it share with whom? If the answer surprises anyone, the isolation tier was chosen by default, not by design.
