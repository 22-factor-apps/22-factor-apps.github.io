---
layout: ../../layouts/Factor.astro
number: 18
title: Stateful connections
tagline: Treat long-lived connections as first-class, drainable state
---

WebSockets, gRPC streams, server-sent events, raw TCP: real products hold **long-lived
connections**, and each one pins live state — auth context, subscriptions, in-flight
messages — to one specific process. Twelve-factor's stateless ideal
(see [Factor 06, Processes](/factors/06-processes/)) didn't cover this; pretending
otherwise is why "we deployed" and "everyone got disconnected" so often mean the same
thing. The twenty-two-factor app gives connection state an explicit discipline.

## The discipline

- **Separate durable state from connection state.** What must survive the connection —
  session identity, subscription lists, undelivered messages — lives in a backing service
  (see [Factor 04](/factors/04-backing-services/)). The connection itself is the *only*
  process-local state, and it is rebuildable from the durable side.
- **Design for resumption.** Clients reconnect with jittered backoff and present a cursor
  or session token; the server replays what was missed from a short-retention buffer.
  A dropped connection then costs a hiccup, not a lost cart or a desynced document.
- **Drain, don't drop.** On shutdown (see [Factor 09, Disposability](/factors/09-disposability/)):
  stop accepting new connections, tell existing clients to reconnect (protocol-level
  GOAWAY / close frames with a reason), spread their departure over the grace window, and
  extend that window for connection-heavy process types — 30 seconds is not enough to
  politely drain 50,000 sockets.
- **Route smart, rebalance always.** Connection-aware load balancing (least-connections,
  consistent hashing for topic affinity) beats sticky sessions that turn instances into
  pets. Autoscaling needs connection counts, not CPU, as its signal — and scale-*down*
  must drain before it terminates.
- **Do the pub/sub between instances properly.** When instance A must push to a client
  connected to instance B, that fan-out goes through a broker or bus — never through
  instances knowing about each other directly.

## The litmus test

Deploy at peak. If connected clients experience, at worst, a transparent reconnect with no
lost messages, connection state is being treated as what it is: real state, with a real
lifecycle, owned on purpose.
