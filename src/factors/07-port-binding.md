---
number: 7
numeral: "VII"
slug: port-binding
title: "Port Binding"
tagline: "Export services via port binding"
original: true
---

A twenty-two-factor app is **completely self-contained**: it does not rely on runtime
injection of a webserver into its execution environment. The web app exports HTTP as a
service by binding to a port and listening for requests on it — the same way in a
developer's local environment as in production.

This is achieved through the dependency declarations of
[Factor II](/factors/dependencies): the HTTP server — Express, Hono, actix-web,
uvicorn, whatever fits the stack — is a library the app carries with it, not a
container the app is dropped into. In deployment, a routing layer (load balancer,
ingress, service mesh sidecar) forwards public traffic to the port the process bound.

The port itself is config ([Factor III](/factors/config)), conventionally `PORT`.

Note that HTTP is just the common case: any protocol that speaks over a socket can be
exported by port binding, which makes any twenty-two-factor app a candidate
**backing service** for another app ([Factor IV](/factors/backing-services)). Apps
that export long-lived, connection-oriented protocols — WebSockets on that same bound
port, raw TCP for a game server or MQTT broker — take on the additional obligations of
[Factor XVIII](/factors/stateful-connections), because the router in front of a bound
port must then participate in draining and reconnection, not just request forwarding.

> **The litmus test:** run the image anywhere with only `PORT` set. If it comes up listening, self-contained is true; if it needs a particular host server preinstalled, it isn't.

*Adapted from Factor VII of the original [twelve-factor methodology](https://12factor.net/port-binding).*
