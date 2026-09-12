---
layout: ../../layouts/Factor.astro
number: 4
title: Backing services
tagline: Treat backing services as attached, swappable resources
---

A **backing service** is anything the app consumes over the network: databases, caches,
message brokers, object storage, email and SMS gateways, observability collectors, LLM and
payment APIs. The twenty-two-factor app makes **no distinction between local and
third-party services**: both are attached resources, reached via a handle (URL, credentials)
that lives in config.

## The modern restatement

- **Resources attach and detach without code changes.** Swapping a self-hosted Postgres for
  a managed one, or one queue provider for another, is a config change and a deploy — not a
  refactor. Keep provider-specific behavior behind thin adapters at the edge of the app.
- **Managed services are the default.** The economics have settled: unless data gravity,
  compliance, or cost at scale says otherwise, rent the database and spend your operations
  budget on your actual product. The factor is what makes that choice reversible.
- **Expect attachment to fail.** Modern platforms restart, migrate, and rebalance backing
  services routinely. The app must tolerate a resource disappearing and reappearing:
  reconnect with backoff, time out aggressively, and degrade gracefully rather than
  crash-looping (see [Factor 09, Disposability](/factors/09-disposability/) and
  [Factor 18, Stateful connections](/factors/18-stateful-connections/)).
- **Credentials rotate.** Because each resource handle is config — versioned and encrypted
  per [Factor 13](/factors/13-encrypted-config/) — rotating a credential is an ordinary,
  reviewable change, not an emergency spelunking session through CI settings.

## Anti-patterns

Hardcoded hostnames; SDK calls scattered through business logic so the provider can never
be changed; apps that only start if every backing service is already healthy; "temporary"
direct connections to another team's database that outlive both teams.
