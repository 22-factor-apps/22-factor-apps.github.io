---
number: 15
numeral: "XV"
slug: resilience-fault-containment
title: "Resilience & Fault Containment"
tagline: "Assume failure, bound amplification, and preserve the critical path"
commandment: "Assume components fail; bound time, retries, queues, load, and blast radius, then prove recovery."
boundary: "Retries, replicas, and restarts can amplify failure unless their budgets, independence, and correctness are tested."
original: false
category: "Reliability"
reading: "7 min"
---

Distributed systems fail partially: one dependency slows, one zone disappears, one
queue partition sticks, one certificate expires, or one customer sends pathological
load while everything else appears healthy. Design those failures as ordinary states
with bounded consequences, not as surprises the runtime is expected to heal by magic.

## The commandment

Every remote call and shared resource needs a **failure budget**: a timeout, concurrency
limit, retry policy, queue bound, and fallback or explicit failure behavior. Isolate
unrelated workloads so one tenant, feature, dependency, or background job cannot
consume all capacity needed by the critical path.

Resilience is not maximizing uptime at any cost. It is preserving the most important
user outcomes, maintaining correctness, and recovering predictably under the failures
the system is designed to tolerate.

## Make failure semantics explicit

- Set end-to-end deadlines and propagate a shrinking time budget downstream. A
  timeout at every layer that exceeds the caller’s deadline only manufactures work
  nobody is waiting for.
- Retry only errors likely to be transient, only when the operation is idempotent or
  protected by an idempotency key, and with a strict attempt budget, exponential
  backoff, and jitter. Retry at one appropriate layer.
- Bound concurrency, connection pools, queues, payloads, and memory. Reject or shed
  work before saturation prevents recovery.
- Use bulkheads to isolate tenants, priorities, dependency pools, and background work.
  Circuit breakers can reduce repeated harm but require carefully tested recovery and
  should not become synchronized flapping machines.
- Define graceful degradation: stale read, reduced fidelity, queued work, read-only
  mode, or explicit unavailability. Never degrade authentication, tenant isolation,
  financial correctness, or another non-negotiable safety property.

Model the dependency graph, including control planes, identity, DNS, telemetry, and
deployment systems. Redundancy does not help when replicas share the same hidden
failure domain or a single control plane can misconfigure all of them at once.

## Prove recovery, not just redundancy

Backups matter only when restore meets a declared recovery point and recovery time.
Multi-region architectures matter only when failover preserves data semantics and
operators can invoke or stop it safely. Regularly exercise dependency latency,
throttling, malformed responses, network partitions, process termination, capacity
loss, and control-plane unavailability in environments representative enough to
expose real behavior.

Tie experiments to [Factor XIII](/factors/observability-slos): define steady state in
user-visible terms, state the expected SLI impact, constrain the blast radius, name the
abort condition, and preserve evidence of recovery. Prefer realistic continuous
experiments where their risk is bounded; simulation and staging evidence do not prove
that production dependencies share the same failure behavior.

## Common failure modes

Infinite retries, retry storms at several layers, queues used as unbounded memory,
health checks that mark an overloaded service healthy, global caches or thread pools,
active-active claims without conflict semantics, and fallbacks that return plausible
but wrong data all amplify failure.

“The orchestrator restarts it” addresses process death, not duplicated side effects,
corrupted state, dependency saturation, or region-wide loss.

## Isolation is a containment decision

The blast radius of compromised or misbehaving code is set by its isolation
boundary, and that boundary should be chosen, not inherited. Namespace
containers share the host kernel—appropriate for trusted first-party services.
Sandboxed runtimes such as gVisor interpose a userspace kernel; microVMs
(Firecracker, Kata Containers) give each workload its own kernel with boot
times measured in milliseconds; unikernels and WASM sandboxes shrink the
surface further for single-purpose or plugin-sized code. Because the artifact
is a standard container image, moving a workload up the spectrum is a
runtime-class annotation, not a rewrite. Classify workloads by the worst code
that could run in them—multi-tenant, customer-submitted, or AI-generated code
sits high on that list—and map each class to a tier in writing.

## Litmus test

> Inject latency and errors into one important dependency under peak representative
> load. Does the application respect end-to-end deadlines, keep retries within budget,
> shed low-priority work, preserve correctness and tenant isolation, remain observable,
> and recover without a manual restart storm?

If one failing dependency consumes every worker or all recovery capacity, the fault
boundary is still the entire system.

## Research lineage

Google SRE frames reliability through explicit risk and objectives. The Reactive
Manifesto makes responsiveness, resilience, elasticity, isolation, and backpressure
composable system properties. The Principles of Chaos Engineering add empirical
steady-state hypotheses, realistic events, continuous experiments, and minimized blast
radius. Amazon’s Builders’ Library documents the practical necessity—and danger—of
timeouts, retries, backoff, jitter, and idempotency in remote calls.

*Sources: [Google SRE, Embracing Risk](https://sre.google/sre-book/embracing-risk/), [The Reactive Manifesto](https://www.reactivemanifesto.org/), [Principles of Chaos Engineering](https://principlesofchaos.org/), [Amazon on idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/), and [CNCF Cloud Native Architecture](https://architecture.cncf.io/).*
