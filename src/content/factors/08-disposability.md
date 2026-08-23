---
number: 8
numeral: "VIII"
slug: disposability
title: "Disposability"
tagline: "Start promptly, stop gracefully, and recover by replacement"
original: true
category: "Reliability"
reading: "5 min"
---

Processes should tolerate being created or destroyed whenever capacity, deployment,
maintenance, or failure demands it. Fast startup increases scheduling freedom;
graceful shutdown protects in-flight work; crash-safe recovery prevents replacement
from becoming data corruption.

## The principle

Treat process lifetime as controlled but uncertain. On startup, validate
configuration, establish only necessary connections, advertise readiness after real
dependencies are usable, and begin serving quickly. On termination, stop accepting
new work, drain or hand off what can finish within a bounded grace period, checkpoint
durable progress, and exit.

No shutdown path is guaranteed. Power loss, kernel failure, forced eviction, and
process bugs bypass cleanup. Therefore correctness must survive abrupt termination as
well as graceful termination.

## What good looks like

- Separate **liveness**, **readiness**, and **startup** signals. A process can be alive
  but intentionally not ready for traffic.
- Keep startup deterministic and bounded. Lazy initialization is acceptable when the
  first user does not pay an unbounded or failure-prone warmup cost.
- Handle termination signals explicitly. Remove readiness first, stop intake, finish
  or safely abandon in-flight units, then close resources.
- Make externally visible operations idempotent or transactional. Message consumers
  acknowledge only after durable success; retries can safely resume after crashes.
- Exercise termination during deploys and load, including termination during the
  narrowest critical sections.

Long-lived connections need a drain and reconnect protocol. Large model or cache
warmups need measurable readiness and spare capacity. Stateful processes need
replication, checkpoints, and fenced ownership. Disposability adapts to the workload;
it does not waive physics.

## Common failure modes

Reporting readiness before migrations or caches are usable, ignoring termination
signals, accepting work during drain, relying on a `finally` block for correctness,
acknowledging a message before its side effects commit, and requiring twenty minutes
of unobservable warmup all reduce disposability.

An orchestrator’s “restart on failure” policy is not a recovery design. Without safe
startup and idempotent work, it can repeatedly amplify the original fault.

## Draining long-lived connections

Termination is hardest where connections live longest. A process holding
WebSockets, server-sent events, or raw TCP sessions treats the socket as the
only state it owns: everything the connection means—identity, subscriptions,
undelivered messages—lives in a backing service, so any replica can resume the
session from a token and a cursor. On the termination signal, fail readiness
first, announce closure at the protocol level (close 1001, GOAWAY), and spread
client departure across a grace period sized to the reconnect herd rather than
a default thirty seconds. Clients reconnect with jittered backoff and replay
from their cursor; a deploy at peak then costs a blip, not a session.

## Litmus test

> Under representative traffic, terminate a random instance during startup, steady
> state, and shutdown. Does the service remain within its objective, preserve
> acknowledged work, avoid duplicate effects, and replace the instance automatically?

Measure the time from scheduling to readiness and from termination signal to clean
exit. Unbounded tails are operational debt.

*Renumbered and modernized from [Factor IX of the original twelve-factor methodology](https://12factor.net/disposability).*
