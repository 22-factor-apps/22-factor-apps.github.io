---
number: 7
numeral: "VII"
slug: concurrency
title: "Concurrency"
tagline: "Scale out through explicit process types and bounded work"
commandment: "Partition work by process type, scale horizontally, and bound every concurrency layer."
boundary: "More workers are not more capacity when queues, connections, contention, or downstream limits are already saturated."
original: true
category: "Scale"
reading: "5 min"
---

Capacity should grow by changing the number and mix of independently schedulable
processes, not by turning one machine into an irreplaceable vertical monolith. The
application exposes its kinds of work so the runtime can scale, isolate, and operate
them according to their actual bottlenecks.

## The commandment

Model each workload as an explicit process type: request serving, queue consumption,
scheduled work, streaming, indexing, or another coherent unit. Scale a process type
horizontally when more instances can divide its work safely. Set concurrency and
resource bounds so overload becomes controlled backpressure rather than memory
exhaustion or dependency collapse.

The original process model remains useful, but modern concurrency has several layers:
instances, threads or async tasks, queue partitions, database connections, and
external rate limits. Increasing one layer blindly can saturate another. A hundred
workers with fifty connections each do not create capacity when the database accepts
two hundred connections.

## What good looks like

- Declare process types and their entry points in the release. Do not make production
  discover them from a human’s shell history.
- Define per-instance resource requests, limits, maximum in-flight work, queue depth,
  connection-pool size, and shutdown behavior.
- Scale on a signal connected to the bottleneck: queue age, concurrency, saturation,
  or SLO risk—not CPU alone by habit.
- Partition work with explicit ownership and safe reassignment. Consumers use leases,
  epochs, or fencing when two workers must never own the same generation.
- Apply backpressure from downstream limits. Shed low-value work, bound queues, and
  preserve recovery capacity before overload becomes a cascading failure.

Horizontal scaling is not universally correct. Some stateful or licensed workloads
scale vertically, and some jobs cannot be partitioned. Make that constraint visible,
measure its ceiling, and plan the next boundary instead of pretending an autoscaler
removes it.

## Common failure modes

Unbounded task creation, one queue shared by latency-sensitive and bulk work, scaling
on noisy metrics, a global scheduler without fencing, and autoscaling that adds
instances faster than dependencies can serve them all turn concurrency into an outage
amplifier. So does assuming an asynchronous API has no resource cost.

## Litmus test

> Double one process type under representative load. Does useful throughput increase
> without duplicate effects, runaway queueing, dependency saturation, or violation of
> latency and cost objectives?

Then remove half the instances abruptly. Safe reassignment and bounded degradation
are part of the concurrency model too.

*Renumbered and modernized from [Factor VIII of the original twelve-factor methodology](https://12factor.net/concurrency).*
