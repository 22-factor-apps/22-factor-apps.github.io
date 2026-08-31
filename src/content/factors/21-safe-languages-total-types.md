---
number: 21
numeral: "XXI"
slug: safe-languages-total-types
title: "Safe Languages & Total Types"
tagline: "Eliminate ambient null and memory hazards; isolate every escape hatch"
commandment: "Prefer memory-safe languages and total types; make absence, failure, and invalid states explicit, and isolate every unsafe boundary."
boundary: "A safe language cannot prevent incorrect requirements, authorization flaws, races, or misuse; unsafe and nullable interop still require containment, contracts, and adversarial tests."
original: false
category: "Correctness"
reading: "8 min"
---

Language design decides which defects ordinary code can express. An application built
on ambient null references, unchecked pointer arithmetic, use-after-free hazards, and
implicit error conventions spends review and test effort rediscovering failures a
compiler or runtime could have excluded by construction.

## The commandment

Choose a memory-safe language for new application code, especially for network-facing,
privileged, parser, cryptographic, concurrency, and data-boundary components. Prefer a
language and configuration in which safe code cannot dereference null, read freed
memory, double-free an allocation, or race unsynchronized memory.

Rust is a strong systems example: ownership and borrowing provide compile-time memory
safety without a garbage collector; references are non-null; and absence is represented
by `Option<T>` rather than making every `T` nullable. Garbage-collected languages can
also provide memory safety, but must enable their strict nullability and type-checking
modes rather than treating dynamically unchecked values as ordinary application data.

Use total, intention-revealing types:

- `Option<T>` or an equivalent sum type for legitimate absence;
- `Result<T, E>` or typed error variants for expected failure;
- validated newtypes for identifiers, quantities, secrets, and constrained strings;
- closed state and command variants with exhaustive pattern matching;
- non-empty, bounded, authenticated, or initialized types when those properties are
  required before an operation is legal; and
- constructors that validate once and return values that cannot represent the invalid
  input afterward.

Avoid unchecked assertions, force unwraps, sentinel values, magic strings, broadly
nullable fields, and dictionary-shaped domain objects. They move missing cases out of
the type system and back into production.

## Contain unsafe and foreign code

Real systems cross C ABIs, operating-system APIs, device drivers, databases, and
libraries that cannot provide the same guarantees. Treat each crossing as a hazardous
material boundary:

- keep `unsafe`, raw pointers, foreign calls, reflection, and unchecked casts in the
  smallest practical module;
- document every precondition, ownership transfer, lifetime, alignment, nullability,
  thread-safety rule, and cleanup obligation next to the boundary;
- validate foreign values before constructing safe domain types;
- expose a narrow safe wrapper so ordinary callers cannot violate the contract;
- test null, malformed, aliased, concurrent, and lifetime-edge behavior with fuzzing,
  sanitizers, interpreters, static analysis, or platform-specific verification; and
- inventory transitive native dependencies—a safe top-level language cannot repair an
  unsafe library hidden below it.

If an existing product cannot migrate at once, publish a risk-ranked memory-safety
roadmap. Put new high-risk components in safe languages, isolate legacy code, enable
compiler and runtime hardening, fuzz exposed boundaries, and move the most privileged
or attacker-controlled paths first.

## What good looks like

- The repository records its supported languages, strictness modes, unsafe-code policy,
  and migration plan for legacy memory-unsafe components.
- Safe code is the default. Exceptions require a reviewable safety contract, an owner,
  focused tests, and a safe public abstraction.
- Nullability is local and explicit. A value of type `T` is usable; a value that may be
  absent has a different type and must be handled before use.
- Expected errors appear in function signatures and exhaustive handling. Panics and
  process aborts are reserved for genuinely unrecoverable invariant violations.
- Deserialized and foreign data cannot enter the domain model until it has been
  validated and normalized.
- Static analysis, dependency policy, fuzzing, and memory-safety tools run in CI for the
  languages and native boundaries that need them.

## Common failure modes

Calling a codebase safe because its primary language is Rust while most parsing occurs
in an unaudited native dependency; using `unsafe` to bypass ownership whenever the
compiler objects; enabling TypeScript without strict null checks; force-unwrapping
optional values on reachable input; treating `undefined`, empty string, zero, and
missing as interchangeable; and mapping every failure to an untyped string all restore
the ambiguity the language was supposed to remove.

Memory safety is not total correctness. Safe programs can authorize the wrong actor,
deadlock, leak secrets, lose data, or faithfully implement a harmful requirement.
Combine this factor with [Formal Methods & Functional Core](/factors/formal-methods-functional-core),
[Secure by Design](/factors/secure-by-design), and runtime evidence.

## Litmus test

> Select one nullable field, one expected failure, one protocol state, and one native or
> unchecked boundary. Can the compiler distinguish every case, do callers handle them
> exhaustively, is ordinary code unable to dereference null or freed memory, and is the
> remaining escape hatch small enough to state and test its complete safety contract?

If “we know this cannot be null” or “this pointer should still be valid” exists only in
a comment or reviewer memory, the type boundary has failed.

## Research lineage

CISA, NSA, and international partners recommend memory-safe languages and explicit
migration roadmaps because they eliminate vulnerability classes rather than repeatedly
mitigating individual instances. Rust demonstrates both parts of this commandment:
ownership enforces memory safety for safe code, while `Option<T>` separates absence
from ordinary values and exhaustive matching requires the missing case to be handled.
Its explicit `unsafe` escape hatch also makes the proof boundary visible instead of
pretending foreign systems do not exist.

*Sources: [CISA's case for memory-safe roadmaps](https://www.cisa.gov/resources-tools/resources/case-memory-safe-roadmaps), [CISA/FBI product security bad practices](https://www.cisa.gov/news-events/alerts/2025/01/17/cisa-and-fbi-release-updated-guidance-product-security-bad-practices), [NSA memory-safety guidance](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/3215760/nsa-releases-guidance-on-how-to-protect-against-software-memory-safety-issues/), the Rust Book on [ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) and [Option instead of null](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html), and Google's Comprehensive Rust guidance on [isolating unsafe code](https://google.github.io/comprehensive-rust/unsafe-rust/unsafe.html).*
