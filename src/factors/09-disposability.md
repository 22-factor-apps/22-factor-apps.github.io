---
number: 9
numeral: "IX"
slug: disposability
title: "Disposability"
tagline: "Maximize robustness with fast startup and graceful shutdown"
original: true
---

Processes in a twenty-two-factor app are **disposable**: they can be started or
stopped at a moment's notice. Disposability is what makes elastic scaling, rapid
releases, and self-healing infrastructure possible — and it is a prerequisite for
immutable infrastructure ([Factor XVII](/factors/immutable-infra)), where "deploy"
means "replace all the processes."

**Minimize startup time.** A process should be serving within seconds of launch. Fast
startup is a compounding asset: faster rollouts, faster rollbacks, faster autoscaling
response. This is one reason to consider microVMs and lightweight virtual OSes
([Factor XVI](/factors/virtual-containers)) — modern virtualization can cold-start a
strongly isolated workload in hundreds of milliseconds.

**Shut down gracefully on SIGTERM.** A web process stops accepting new requests,
finishes in-flight ones, and exits. A worker returns its current job to the queue;
jobs are therefore designed to be reentrant — idempotent, or wrapped in transactions.
A process holding WebSockets or other long-lived connections has a longer checklist —
announce, drain, and hand off, as specified in
[Factor XVIII](/factors/stateful-connections) — but the contract is the same:
termination is routine, not an emergency.

**Be robust against sudden death.** Hardware fails and kernels OOM-kill. A
twenty-two-factor architecture uses queues that return unacknowledged work and crash-only
design so that an unclean exit is an inconvenience, never a data-integrity event.

> **The litmus test:** `kill -9` a random instance during peak traffic. If users notice anything beyond a retried request, disposability needs work.

*Adapted from Factor IX of the original [twelve-factor methodology](https://12factor.net/disposability).*
