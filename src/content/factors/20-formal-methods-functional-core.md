---
number: 20
numeral: "XX"
slug: formal-methods-functional-core
title: "Formal Methods & Functional Core"
tagline: "Model the states that matter; keep effects explicit and transformations total"
commandment: "Model critical state transitions explicitly; implement a functional core with pure transformations, immutable values, typed errors, and exhaustive cases."
boundary: "Formal does not mean proving every line, and functional does not mean forbidding state or effects; apply rigor where failure matters and push effects to controlled boundaries."
original: false
category: "Correctness"
reading: "8 min"
---

Production failures often begin in behavior that prose and happy-path tests left
ambiguous: a retry arrives after cancellation, an authorization result becomes stale,
two leaders act at once, a payment is captured from the wrong state, or an asynchronous
completion mutates an object that has already moved on. Treat important behavior as a
state-transition system before distributing it across handlers and callbacks.

## The commandment

Name the states, events, inputs, outputs, guards, effects, and invalid transitions of
every high-consequence lifecycle. State the invariants that must always hold and the
liveness conditions that must eventually hold. For concurrent or distributed
protocols, explore interleavings with a model checker or another formal technique
before production becomes the state-space explorer.

Make that model the operational authority. Derive capabilities from the current state,
reject invalid transitions without mutation, and suppress stale asynchronous results.
A diagram that implementation can ignore is documentation, not a correctness boundary.

Implement a **functional core with an imperative shell**:

- pass explicit inputs and return explicit outputs;
- prefer immutable values and pure transformations;
- represent expected failure with typed results rather than exceptions or sentinel
  values that can be forgotten;
- encode states and events as sum types or equivalent closed variants;
- exhaustively match every meaningful variant, avoiding wildcard branches when a new
  state should force a compile error;
- compose small transformations through pipelines, iterators, or method chains when
  each step keeps its contract visible; and
- push clocks, randomness, files, networks, databases, UI, and process mutation to a
  narrow effect boundary.

The shell performs effects. The core decides what those effects mean. This separation
makes the decision logic deterministic, replayable, property-testable, and easier to
compare with the formal model.

## Use a verification ladder

Rigor should scale with consequence and uncertainty. Start with the cheapest method
that can falsify the claim, then climb when the remaining risk justifies it:

1. types that exclude illegal combinations and make absence and failure explicit;
2. exhaustive matching, assertions, contracts, and invariant checks;
3. example, property-based, mutation, fuzz, and state-machine tests;
4. executable specifications and bounded model checking for important interleavings;
5. proof-oriented tools or independently reviewed safety cases for the highest-risk
   algorithms and domains.

Formal methods do not require one language or tool. TLA+, PlusCal, Alloy, Quint, Lean,
Coq, Dafny, SPARK, model-based testing, temporal properties, and property-based testing
cover different questions. Choose the smallest model that captures the dangerous
state, not a ceremonial specification of implementation detail.

## What good looks like

- A critical lifecycle has one versioned transition model. Every command names its
  allowed source state, destination state, guards, effects, and failure result.
- Safety invariants and progress properties are reviewable and checked automatically
  where practical. Counterexamples become regression tests.
- Domain values are immutable by default. Mutation is localized, named, and justified
  by an effect or performance boundary.
- Pure functions contain policy and calculation; adapters contain I/O. Tests exercise
  the core without a network, clock, database, or hidden global state.
- Errors are values with meaningful variants. Callers must handle or deliberately
  propagate each expected failure.
- Pattern matches are exhaustive. A new state or error variant breaks every consumer
  that has not decided what it means.
- Concurrency commands carry generation, epoch, version, or fencing evidence so stale
  completions cannot mutate current state.

## Common failure modes

A state enum beside unrelated mutable booleans, a flowchart that no code enforces, a
default match arm that silently accepts future states, `null` or strings as protocol
states, pure-looking functions that read global clocks, effects inside retryable
transformations, and tests that cover examples but never transition sequences all
leave the real state machine implicit.

Formal notation can also become theater. A proof of an oversimplified model says
nothing about implementation unless assumptions, refinement boundaries, and runtime
checks connect the two. Property tests are not proofs, and compile-time exhaustiveness
does not establish that the state set or invariants are correct.

## Litmus test

> Choose the most dangerous lifecycle and add one state, one late asynchronous result,
> and one invalid transition. Does the model expose the new interleavings, does the
> compiler or checker force every case to be reconsidered, does the invalid command
> leave state unchanged, and can the decision logic be replayed without real effects?

If correctness still depends on remembering which booleans may coexist or which
callback is “probably latest,” the system has an undocumented state machine.

## Research lineage

TLA+ describes concurrent systems through initial conditions, next-state relations,
and properties over behaviors. Functional design contributes explicit data flow,
immutable values, composable transformations, and controlled effects. Rust's
exhaustive `match` demonstrates how a compiler can force all variants—including
absence—to be considered, while its immutable-by-default bindings make mutation
visible without pretending mutation can disappear.

*Sources: Leslie Lamport's [high-level view of TLA+](https://lamport.azurewebsites.net/tla/high-level-view.html) and [Specifying Systems](https://lamport.azurewebsites.net/tla/book.html), the Rust Book on [exhaustive matching](https://doc.rust-lang.org/stable/book/ch06-02-match.html), and the Rust Reference on [immutable-by-default variables](https://doc.rust-lang.org/stable/reference/variables.html).*
