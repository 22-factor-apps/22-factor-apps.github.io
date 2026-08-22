---
number: 11
numeral: "XI"
slug: contract-first-interfaces
title: "Contract-First Interfaces"
tagline: "Define behavior before transport and evolve it for real consumers"
original: false
category: "Architecture"
reading: "6 min"
---

Every application participates in a system larger than itself. Its durable boundary is
not the port, framework, or broker it happens to use; it is the contract other people
and software rely on. Define that contract before implementation, make it testable,
and evolve it as a product.

## The principle

Start significant capabilities with a consumer-visible interface. For an HTTP service
that may be an OpenAPI description. For an event stream it may be an AsyncAPI schema
plus delivery semantics. For a library it is the public type and behavior contract;
for a CLI, command syntax, exit status, streams, and machine-readable output; for a
data product, schema, freshness, ownership, and quality expectations.

“API first” was one of Kevin Hoffman’s three additions in *Beyond the Twelve-Factor
App*. Contract-first broadens the idea: **not every useful application is a web API,
but every integration has consumers and observable behavior**.

## What belongs in the contract

A schema is necessary but rarely sufficient. Specify:

- meaning, units, ordering, nullability, defaults, invariants, and stable identifiers;
- authentication and authorization expectations, tenant boundaries, and sensitive
  fields;
- timeouts, idempotency, pagination, concurrency, rate limits, and backpressure;
- error taxonomy, retryability, partial success, and asynchronous completion;
- delivery guarantees and deduplication for messages and events;
- versioning, deprecation, support windows, and compatibility policy;
- examples that cover failure and boundary cases, not only a polished happy path.

Keep the contract close to source and review it with implementation changes. Generate
types, validators, documentation, mocks, and conformance tests from one authoritative
definition where practical. Generated clients reduce accidental drift, but consumers
still need semantic tests: a field can keep the same type while its meaning breaks.

## Design with consumers, not for them

Before implementation, identify representative consumers and walk their workflows.
Prefer capability-oriented interfaces over database-shaped CRUD. Make safe usage easy:
use bounded defaults, explicit idempotency, stable errors, and authorization that does
not require consumers to reconstruct internal policy.

Consumer contract tests should run against the provider before release. Providers
publish a compatibility report; consumers publish which behaviors they actually use.
[Factor XIX](/factors/evolutionary-compatibility) governs how the contract changes
when old and new versions must coexist.

## Common failure modes

Implementation-first APIs leak storage models and require breaking changes when the
internals evolve. Ad-hoc JSON with no schema, events named after database mutations,
inconsistent error shapes, implicit retries, undocumented rate limits, and SDKs that
behave differently from the wire contract all transfer design cost to every consumer.

Do not mistake GraphQL, gRPC, REST, or an event broker for a contract strategy. Each is
a transport or interaction style. None supplies ownership, semantics, compatibility,
or empathy automatically.

## Litmus test

> Can a consumer team implement and test a correct client—including authentication,
> limits, retries, and failure handling—using the published contract and examples,
> without reading provider source or asking which undocumented behavior is “normal”?

Then change the provider’s internal framework or storage model. If conforming
consumers need not change, the interface is doing its job.

## Research lineage

This factor extends Hoffman’s **API First** addition and the CNCF reference
architecture’s emphasis on interoperable services. Semantic Versioning reinforces the
prerequisite: versioning has meaning only after a precise public API exists.

*Sources: [Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/), [CNCF Cloud Native Architecture](https://architecture.cncf.io/), and [Semantic Versioning](https://semver.org/).*
