---
number: 14
numeral: "XIV"
slug: supply-chain-integrity
title: "Supply Chain Integrity"
tagline: "Make every artifact traceable, verifiable, and admissible"
original: false
category: "Security"
reading: "7 min"
---

Software is the output of a chain: source control, dependencies, build definitions,
toolchains, runners, registries, deployment systems, and the people or workloads
authorized to operate them. Protecting application source while trusting every other
link implicitly does not protect the artifact users run.

## The principle

Every released artifact should be traceable to reviewed source and declared inputs,
built by an identified and hardened process, accompanied by verifiable provenance and
a dependency inventory, signed or otherwise bound to an authenticated producer, and
checked against policy before execution.

NIST’s Secure Software Development Framework treats security as part of the complete
development lifecycle. SLSA provides an incremental vocabulary for source and build
assurance. Adopt the controls proportionate to risk, but make the current assurance
level and remaining trust explicit.

## Protect source and dependencies

Require strong identity, review, protected branches or equivalent change controls,
and attributable emergency paths for release source. Pin dependencies and automation
to immutable versions or digests; continuously evaluate known vulnerabilities,
malicious updates, licenses, and maintenance health. [Factor II](/factors/dependencies)
defines the graph; this factor establishes why that graph should be trusted.

Generate a machine-readable software bill of materials for the artifact actually
produced, not merely the manifest in the repository. An SBOM describes contents;
provenance describes how an artifact was produced. They answer different questions
and both are useful.

## Harden build and distribution

- Isolate builds from developer workstations and unrelated tenants at the assurance
  level the workload requires. Prevent a build from silently reading undeclared
  credentials or mutable host state.
- Record source revision, resolved inputs, build definition, builder identity,
  parameters, outputs, and digests in signed provenance.
- Prefer reproducible or at least independently verifiable builds. Investigate
  unexplained differences instead of normalizing nondeterminism.
- Store immutable artifacts in a registry with retention, access controls, malware
  and vulnerability scanning, and an auditable promotion history.
- Verify digest, signature, provenance, builder identity, and policy **at admission**.
  Generating attestations no runtime checks is compliance theater.

Plan for key compromise and malicious releases. Signing keys should be short-lived or
hardware-backed where appropriate, rotation must be rehearsed, and revocation should
prevent further admission without erasing forensic evidence.

## Common failure modes

Floating CI actions, mutable base-image tags, build scripts that curl and execute
unverified binaries, long-lived registry credentials, attestations stored beside an
artifact but never verified, and an SBOM generated from the wrong stage all create a
false sense of integrity.

A passing vulnerability scan is not a trust proof. It says known signatures were not
found at one time; it does not establish source review, builder integrity, provenance,
or freedom from malicious behavior.

## Litmus test

> Select a production artifact by digest. Can an independent verifier prove which
> reviewed source and declared inputs produced it, which trusted builder ran the
> build, what components it contains, which policy admitted it, and whether the exact
> bytes have changed since publication?

Then introduce an artifact from an untrusted builder or with mismatched provenance.
The deployment boundary must reject it automatically.

## Research lineage

This factor draws from NIST SSDF’s lifecycle practices, the CNCF security model, and
the SLSA specification’s incremental source/build assurance and provenance formats.

*Sources: [NIST SP 800-218, Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) and [SLSA v1.2](https://slsa.dev/spec/v1.2/).*
