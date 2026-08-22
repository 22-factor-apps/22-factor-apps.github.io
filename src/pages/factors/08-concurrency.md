---
layout: ../../layouts/Factor.astro
number: 8
title: Concurrency
tagline: Scale out via the process model
---

The twenty-two-factor app scales by **running more processes**, not by growing one process
forever. Workload diversity is expressed as **process types** — web processes serve
requests, workers drain queues, schedulers fire clocked jobs — and each type scales
independently.

## The modern restatement

The process model became the orchestrator's model: replicas of a deployment, consumers in a
group, function instances under a concurrency limit. What's changed is who does the
arithmetic:

- **Autoscaling is the default operator.** Scale on load signals — requests in flight, queue
  depth, CPU — with explicit floors and ceilings. The app's job is to make that safe:
  fast startup, graceful shutdown (see [Factor 09, Disposability](/factors/09-disposability/)),
  and no hidden coordination between instances (see [Factor 06, Processes](/factors/06-processes/)).
- **In-process concurrency is fine; it just doesn't replace scale-out.** Async runtimes and
  thread pools multiply what one process handles. The factor's rule is that the *unit of
  scaling and failure* remains the process — you add capacity by adding instances, and any
  one instance is disposable.
- **Never daemonize.** Processes don't background themselves or write PID files; they run
  in the foreground and rely on the platform's supervisor for lifecycle, restarts, and log
  capture (see [Factor 11, Logs](/factors/11-logs/)).
- **Singletons are a smell.** A process type that "must only ever run once" reintroduces a
  single point of failure. Where uniqueness is truly required — a scheduler, a migration
  runner — enforce it with leases or locks in a backing service, not by hoping.

## The litmus test

Double the replica count of any process type. If throughput roughly doubles and nothing
breaks, this factor is satisfied. If two instances trample each other, revisit
[Factor 06](/factors/06-processes/) first.
