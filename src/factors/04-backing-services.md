---
number: 4
numeral: "IV"
slug: backing-services
title: "Backing Services"
tagline: "Treat backing services as attached resources"
original: true
---

A **backing service** is anything the app consumes over the network: databases,
message queues, caches, SMTP relays, object stores, third-party APIs. A
twenty-two-factor app makes no distinction between local and third-party services —
both are **attached resources**, addressed by a handle (URL plus credentials) held in
config.

A deploy should be able to swap a local PostgreSQL for a managed one, or one email
provider for another, purely by changing config — no code changes, no redeploy of a
different artifact. Resources can be attached and detached at will: when a database
misbehaves, you attach a fresh replica restored from backup and detach the old one.

Two modern refinements:

**Handles come from the encrypted config chain.** The URL-and-credential handle for
each resource is exactly the kind of value that belongs in `env/enc/` (see
[Factor XIII](/factors/encrypted-config)) — versioned, encrypted, auditable — with
rotation performed as an ordinary reviewed commit.

**Know which of your resources hold connections open.** Stateless HTTP backends can
treat attachment as instantaneous, but resources speaking long-lived protocols —
database connection pools, message-bus consumers, WebSocket fan-out layers — need the
drain-and-reattach discipline described in
[Factor XVIII](/factors/stateful-connections).

> **The litmus test:** swapping any backing service's provider is a config change and a deploy. The moment it's a refactor, provider details have leaked past the adapter boundary.

*Adapted from Factor IV of the original [twelve-factor methodology](https://12factor.net/backing-services).*
