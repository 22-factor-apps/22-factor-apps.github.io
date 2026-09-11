---
number: 10
numeral: "X"
slug: admin-processes
title: "Admin Processes"
tagline: "Run shipped operational code through an isolated administrative control plane"
commandment: "Run administrative work from the shipped release in a separate trust domain through reviewed, auditable procedures."
boundary: "The same release must not mean the same network, identity store, credentials, or privileges as customer-facing processes."
original: true
category: "Operations"
reading: "5 min"
---

Database migrations, repair jobs, re-indexing, data exports, key rotation, and
diagnostic consoles are application behavior. They must ship with the application and
run in the same release context—not from an engineer’s stale checkout with an
approximation of production credentials.

## The commandment

Execute administrative work as explicit one-off process types from the same immutable
artifact, dependency set, and configuration interface as regular processes. Because
these tasks often carry extraordinary authority and blast radius, give them **more**
control and evidence than routine traffic, not less.

Run those processes in a separate administrative VPC or an equivalent network trust
domain with no public ingress. Customer-facing web and API processes must not be able
to route to the administrative datastore, retrieve administrative credentials, or
invoke privileged procedures directly. Grant each one-off a narrowly scoped,
time-bounded path to the exact resource and operation it needs, then remove that path
when the task ends.

Administrative humans and workloads authenticate against a separate administrative
identity service and backing store—not the customer authentication database or public
authentication server. Synchronize only the minimum identifiers needed for audit or
policy through a reviewed boundary. A stolen customer session, compromised product
auth service, or foothold in the customer VPC must not be enough to mint administrator
authority.

Network separation is containment, not proof of trust. Authenticate the operator,
device, workload, release, target, and requested action at the resource boundary;
authorize every invocation explicitly; and fail closed when policy or identity
evidence is unavailable.

Prefer a reviewed, repeatable command over interactive typing. A one-off should have
an owner, input contract, dry-run or preview where possible, idempotency or checkpoint
strategy, bounded scope, progress signal, audit record, and documented recovery path.

## What good looks like

- Migrations and repair tools are versioned with the schema and code they understand.
  Operators invoke them from a named release artifact.
- Admin runners, APIs, identity services, and identity data live in an administrative
  VPC or equivalent trust domain separate from customer workloads. Product services
  have no route to the admin identity store or administrative database.
- Administrative authentication has its own issuer and backing store. Customer tokens
  are never accepted as administrator credentials, even when the same human has both
  roles.
- Production authorization is just-in-time, narrowly scoped, time-limited, and tied
  to the operator or workload identity. Shared permanent “admin” credentials do not
  exist.
- High-risk actions require an explicit plan and, where appropriate, independent
  approval. The system records actor, release, parameters or safe digest, target,
  start, progress, outcome, and affected scope.
- Long jobs checkpoint progress, limit concurrency, respect production capacity, and
  can be paused or resumed without starting from an ambiguous midpoint.
- Backward-compatible data migrations follow the coexistence rules in
  [Factor XIX](/factors/evolutionary-compatibility), with restore or compensating
  procedures tested before execution.

An interactive console remains useful for exploration during an incident, but it is
an emergency instrument. Access should be attributable and recorded, sensitive output
protected, and successful discoveries converted into reviewed automation.

## Common failure modes

Running migrations from laptops, sharing the customer VPC or customer auth database
with the admin plane, accepting customer sessions on admin endpoints, copying a script
into a container, granting a broad database password “for the duration,” executing a
six-hour job with no progress or cancel path, and assuming a transaction can roll back
every external side effect are all signs that one-offs sit outside the operating model.

Beware tools that print secrets or personal data to terminal history and logs. Audit
the action without duplicating the sensitive payload.

## Litmus test

> Can a second operator execute a high-risk task from a named release in an isolated
> administrative trust domain, authenticate without the customer identity system,
> preview its scope, obtain least-privilege access, monitor progress, and recover
> safely—while leaving a complete audit trail?

If success depends on the original author’s laptop, memory, or standing credentials,
the task is not an application process yet.

*Renumbered and modernized from [Factor XII of the original twelve-factor methodology](https://12factor.net/admin-processes). The isolation model follows [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final) and [NIST SP 800-207A](https://csrc.nist.gov/pubs/sp/800/207/a/final): network location alone grants no trust, so network-tier separation must be paired with identity-tier policy.*
