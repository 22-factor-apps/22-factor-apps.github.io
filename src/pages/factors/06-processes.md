---
layout: ../../layouts/Factor.astro
number: 6
title: Processes
tagline: Execute the app as one or more stateless processes
---

The app executes as one or more **stateless, share-nothing processes**. Anything that must
persist lives in a backing service (see
[Factor 04](/factors/04-backing-services/)); anything in a process's memory or local disk
is a disposable, single-transaction cache at best.

## The modern restatement

Statelessness won. Containers, serverless functions, and autoscaling groups all assume it.
What experience has added is precision about the edges:

- **Local state is a cache with a lifespan of one request.** Downloading a file to tmpfs
  while streaming it to object storage is fine. Expecting that file on the next request —
  which will land on another instance — is not.
- **Sticky sessions are still a violation.** Session state belongs in a datastore with
  expiry. If a specific instance dying logs users out, this factor is broken.
- **In-memory caches must be safe to lose.** Warm-up costs are acceptable; correctness
  depending on cache contents is not.
- **Some workloads are legitimately stateful.** Long-lived WebSocket and TCP connections
  concentrate real state in specific processes. Twenty-two-factor doesn't pretend
  otherwise — it gives those workloads their own discipline in
  [Factor 18, Stateful connections](/factors/18-stateful-connections/), which builds on
  this factor rather than exempting itself from it: the *durable* state still lives
  outside; only the connection itself is process-local.

## The litmus test

Kill any single process at any moment. If anything is lost beyond in-flight requests — and
those are retried safely — the app is stateless enough to scale horizontally
(see [Factor 08, Concurrency](/factors/08-concurrency/)) and restart freely
(see [Factor 09, Disposability](/factors/09-disposability/)).
