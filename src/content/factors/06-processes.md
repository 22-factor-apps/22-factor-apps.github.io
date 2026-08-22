---
number: 6
numeral: "VI"
slug: stateless-processes
title: "Stateless Processes"
tagline: "Execute as share-nothing processes; persist through backing services"
original: true
category: "Runtime"
reading: "5 min"
---

Application processes should be disposable compute. They may hold temporary working
state while handling a request or job, but correctness must not depend on a particular
process, host, local filesystem, or in-memory session surviving the next moment.

## The principle

Persist durable state in an attached backing service with an explicit consistency,
retention, and recovery model. Any healthy process of the correct release should be
able to accept the next unit of work. The scheduler may replace, relocate, or multiply
processes without coordinating hidden local state.

Stateless does not mean “the application has no state.” Useful applications are full
of state. It means the **execution process is not the authoritative owner** of state
that must outlive it. Databases, durable queues, object stores, and replicated state
systems take that role under [Factor IV](/factors/backing-services).

## What good looks like

- Session identity and durable workflow progress live outside the web process. A load
  balancer does not need sticky sessions for correctness.
- Local files are scratch space or immutable packaged assets. Uploads move to durable
  storage before the request is acknowledged.
- Caches are reconstructible, bounded, and safe to lose. A cache miss changes
  performance, not truth.
- Workers checkpoint durable progress and use idempotency keys or fenced leases so a
  retry on another process cannot double-apply an effect.
- Background work is represented in a durable queue or state machine, not an
  untracked thread spawned from a request handler.

Some workloads require local state for performance—stream processors, databases,
agents with large models, or edge applications. Keep the principle by making
ownership, replication, checkpointing, recovery, and reassignment explicit. “Stateful”
is a design category, not permission to hope the process stays alive.

## Common failure modes

User sessions in one web server’s memory, files written to an ephemeral container and
returned later, scheduled jobs stored only in process memory, unbounded local caches,
and consumers that acknowledge messages before durable effects all bind correctness
to process lifetime.

Shared filesystems can hide the problem rather than solve it. They introduce their own
concurrency, availability, and consistency contract and should be treated as a backing
service, not as “local disk that happens to be everywhere.”

## Litmus test

> Terminate any process between two units of work, route the next unit to a fresh
> instance, and verify that no acknowledged data disappears, no action is duplicated,
> and no user must reconnect to the same machine for correctness.

If the test fails, identify the state the process implicitly owned and give it a
durable home with an explicit recovery protocol.

*Modernized from [Factor VI of the original twelve-factor methodology](https://12factor.net/processes).*
