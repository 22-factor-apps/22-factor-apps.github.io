---
number: 16
numeral: "XVI"
slug: data-lifecycle-privacy
title: "Data Lifecycle & Privacy"
tagline: "Minimize, classify, govern, and delete data across every copy"
commandment: "Collect only justified data; preserve user agency; govern every copy through verifiable deletion."
boundary: "Encryption protects bytes, but it does not justify collection, confer user control, or complete retention and deletion."
original: false
category: "Trust"
reading: "7 min"
---

Data outlives requests, processes, services, and often the purpose for which it was
collected. Design its complete lifecycle—from collection and derivation through use,
sharing, retention, backup, and disposal—before production creates copies no one can
find or govern.

## The commandment

Collect the minimum data necessary for a stated purpose. Classify it, identify its
subjects and owner, constrain where it may flow, protect it in transit and at rest,
retain it only as long as justified, and make access, correction, portable export, and
deletion operational capabilities rather than emergency projects. When the product
domain permits, preserve useful offline access and open, durable formats so a provider
outage or shutdown does not erase the user’s agency over their own work.

Privacy is not synonymous with encryption. Encryption protects bytes from some forms
of access; it does not justify collection, prevent misuse by an authorized service,
honor deletion, or explain a derived feature sent to an analytics vendor.

## Map the real lifecycle

Maintain an inventory that follows data across primary stores, caches, queues,
search indexes, logs, traces, analytics systems, data lakes, exports, model training
sets, support tools, replicas, and backups. Record:

- purpose and lawful or organizational basis for processing;
- classification, sensitivity, residency, and tenant or subject boundary;
- producers, consumers, processors, and accountable owner;
- retention trigger and duration, deletion mechanism, and backup behavior;
- encryption, key ownership, access policy, and audit requirements;
- derivations and whether deleting source data also invalidates derived data.

Data contracts should encode classification and evolution alongside schema. A new
field is not “just data”; it changes privacy risk, retention, telemetry, export,
support access, and downstream compatibility.

## What good looks like

- Reject or redact sensitive fields at telemetry boundaries. Do not rely on every
  caller remembering what not to log.
- Use tenant-aware authorization and isolation in storage, caches, search, batch jobs,
  and support paths—not only at the API gateway.
- Test deletion end to end. Tombstones and retention policy propagate through derived
  systems; backups expire or support a documented restore-and-redelete procedure.
- Separate operational access from product access. Just-in-time support workflows are
  scoped, attributable, time-limited, and visible to audit.
- Exercise restore, export, residency failover, key rotation, corruption recovery,
  and subject-request workflows under realistic volume.
- Make export complete enough to use elsewhere, documented, and available without a
  support escalation. For user-authored work, test what remains usable when the network
  or provider is unavailable and how long-lived formats can be recovered.

Immutability and deletion can conflict. Resolve the tension deliberately: append a
cryptographic tombstone, isolate eras under destroyable keys, minimize personal data
in immutable logs, and document regulatory or safety retention that prevents immediate
erasure.

## Common failure modes

“Store everything in case it becomes useful,” production data copied to developer
laptops, user IDs as metric labels, soft delete with no eventual purge, backups with
indefinite retention, data residency inferred from an account name, and machine-
learning features with no lineage all create unbounded obligations.

A privacy policy is not a lifecycle implementation. If no service owns deletion in a
derived index, the organization cannot make the promise operationally true.

## Litmus test

> Select one sensitive field. Can the team enumerate every place it or a reversible
> derivative flows, state why each copy exists and who can access it, then execute and
> verify retention expiry, subject export, and deletion—including downstream systems
> and backup restoration procedures?

An unknown copy or manual spreadsheet breaks the chain.

## Research lineage

The NIST Privacy Framework defines data processing across collection, retention,
transformation, use, disclosure, sharing, transmission, and disposal, and aligns
privacy outcomes with the full system-development lifecycle. Local-first software adds
a complementary user lens: offline availability, longevity, privacy, portable data,
and ultimate user control. This factor makes both lifecycle governance and practical
agency application-architecture obligations without prescribing a local-first design
for domains that require central authority.

*Sources: [NIST Privacy Framework](https://www.nist.gov/privacy-framework/privacy-framework), [NIST guidance for applying it to the SDLC](https://www.nist.gov/privacy-framework/using-privacy-framework-11), and [Ink & Switch on Local-first Software](https://www.inkandswitch.com/essay/local-first/).*
