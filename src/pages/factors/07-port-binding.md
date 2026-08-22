---
layout: ../../layouts/Factor.astro
number: 7
title: Port binding
tagline: Export services via port binding; own your listener
---

The twenty-two-factor app is **completely self-contained**: it exports its service by
binding to a port and listening. It does not rely on runtime injection into an external
web server — the HTTP server is a library inside the app, not a host the app is deployed
into.

## The modern restatement

This factor quietly became the foundation of the container era: an OCI container *is* a
self-contained process exporting a port. The modern refinements:

- **The port is config.** Read it from the environment (`PORT` or equivalent). The routing
  layer — ingress controller, service mesh, load balancer — maps public traffic to it.
- **One port per protocol, all declared.** Apps commonly export a service port plus
  separate listeners for health checks and metrics. Each is declared and documented, none
  is assumed by magic.
- **Any protocol qualifies.** HTTP, gRPC, WebSockets, raw TCP — port binding is the
  contract regardless. Long-lived protocols bring extra obligations covered in
  [Factor 18, Stateful connections](/factors/18-stateful-connections/).
- **Apps compose by URL.** One app's exported port is another app's backing service
  (see [Factor 04](/factors/04-backing-services/)); service discovery hands out the URLs.
- **TLS terminates at the edge you choose — deliberately.** Whether the platform
  terminates TLS or the app speaks it end-to-end (mTLS in a mesh), make it an explicit,
  versioned decision, not an accident of whichever proxy was already there.

## Anti-patterns

Apps that only run inside a specific application server; hardcoded port numbers; containers
whose health endpoint shares a port and thread pool with heavy request traffic, so the
health check fails exactly when you need it to be accurate.
