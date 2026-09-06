---
number: 18
numeral: "XVIII"
slug: stateful-connections
title: "Own Your Long-Lived Connections"
tagline: "TCP connections and WebSockets are state — drain them, externalize them, design for reconnect"
original: false
---

The stateless ideal of [Factor VI](/factors/processes) meets reality the day your app
holds ten thousand WebSockets. Chat, presence, collaborative editing, streaming, game
servers, MQTT and gRPC streams — connection-oriented services are now ordinary, and a
methodology that pretends otherwise just produces systems that violate it silently.
Twenty-two-factor instead gives long-lived connections their own contract:

## The connection is state; the session is data

Treat the open socket as the *only* state the process holds. Everything a connection
*means* — who is subscribed to what, where the cursor is, what was delivered —
lives in a backing service ([Factor IV](/factors/backing-services)): Redis/Valkey,
a pub/sub bus, a database. Any replica must be able to pick up a session from that
data alone. The socket is a resumable transport, never the system of record.

## Design for reconnect as a normal event

Clients reconnect with jittered exponential backoff, resume with a session token, and
reconcile with either server-side replay (consumer offsets, resume tokens à la MQTT
sessions or SSE `Last-Event-ID`) or an idempotent state re-sync. Every message path is
idempotent or deduplicated, because at-least-once is what the network gives you.
Heartbeat at the application layer — TCP keepalive alone lies — and enforce idle
timeouts consistent with every proxy on the path.

## Drain, don't drop

Disposability ([Factor IX](/factors/disposability)) for a connection-heavy process
means a **graceful drain**: on SIGTERM, stop accepting new connections (fail the
readiness probe, keep liveness green), send a going-away signal (WebSocket close 1001,
HTTP/2 GOAWAY), let clients reconnect elsewhere, and hold a termination grace period
sized to your reconnect storm, not to a default 30 seconds. Roll deploys in waves
sized so the remaining fleet absorbs the herd.

## Route deliberately

Prefer stateless routing plus external session data; where affinity is unavoidable,
use consistent hashing or sticky routing that any replica can *recover from*, never
one only the original process can serve. Load-balance by least-connections, and give
the balancer connection lifetimes so drains converge. The test: kill any single
process at peak — clients should experience a reconnect blip, zero lost messages, and
zero paged humans.
