---
number: 6
numeral: "VI"
slug: processes
title: "Processes"
tagline: "Execute the app as one or more stateless processes"
original: true
---

The app runs as one or more processes that are **stateless** and **share-nothing**.
Any data that needs to persist lives in a stateful backing service — typically a
database or object store — never on the local disk or in the memory of a single
process with the expectation that it will be there later.

Memory and local disk remain fine as a brief, single-transaction scratchpad:
downloading a file, transforming it, streaming the result out. What a
twenty-two-factor app never assumes is that anything cached in one process will be
available to a future request. Sticky sessions that pin a user to one process so its
memory can serve as a session store are still a violation; session state belongs in a
datastore with time-expiration, such as Redis or Valkey.

The refinement this methodology adds is honesty about the gray zone. Real systems
increasingly hold **long-lived connections** — WebSockets, server-sent events, gRPC
streams — and a process holding ten thousand open sockets is not stateless in the
naive sense, no matter what its architecture diagram says. Rather than pretend
otherwise, twenty-two-factor keeps Factor VI as the default for request/response
workloads and gives connection-oriented workloads their own discipline in
[Factor XVIII](/factors/stateful-connections): externalized session state, graceful
drains, and clients that treat reconnection as a normal event rather than an outage.

> **The litmus test:** kill any single process at any moment. If anything is lost beyond in-flight requests — and those retry safely — the app scales and restarts freely.

*Adapted from Factor VI of the original [twelve-factor methodology](https://12factor.net/processes).*
