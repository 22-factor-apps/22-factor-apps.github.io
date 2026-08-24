---
number: 12
numeral: "XII"
slug: secure-by-design
title: "Secure by Design"
tagline: "Make safe behavior the default across identity, code, data, and operations"
commandment: "Design the safe path as the default; verify identity, privilege, inputs, abuse cases, and failure behavior."
boundary: "Authentication is necessary but not sufficient: trusted networks, secure defaults, threat models, and verified deny paths all matter."
original: false
category: "Security"
reading: "7 min"
---

Security is a product property, not a perimeter or a release gate. Design the system
so ordinary users and operators land on safe defaults, untrusted inputs stay inside
explicit boundaries, sensitive actions require proportionate evidence, and failures
do not silently weaken protections. The team that creates the risk owns the path to a
safe outcome; customers should not have to discover and assemble basic defenses.

## The commandment

Model assets, actors, trust boundaries, plausible misuse, and unacceptable outcomes
before implementation fixes the architecture in place. Reduce exposed surface area,
validate at every boundary, fail closed for non-negotiable safety properties, and
exercise both permitted and denied behavior throughout delivery and operation.

Identity remains the control plane of a distributed system. Separate
**authentication** (“who or what is this?”) from **authorization** (“may this actor do
this action here, now?”). Deny by default, grant only the capabilities needed for the
task and duration, and never treat private network location as proof of trust.

This broadens Hoffman’s “Authentication and Authorization” addition with zero trust,
secure-by-design defaults, threat modeling, input and output validation, vulnerability
response, and responsibility for customer security outcomes.

## Workload identity before shared secrets

Prefer platform-issued, short-lived workload credentials bound to a service identity
and audience. Rotate them automatically. A service calling a database should receive
database-specific authority, not a universal secret copied into every environment.
Root secrets may bootstrap identity, but ordinary operation should not require teams
to distribute permanent credentials.

For people, use phishing-resistant authentication where possible, role or
attribute-based authorization, just-in-time elevation for dangerous work, and a
separately monitored break-glass path. Human and workload identities must not be
interchangeable; an engineer should not make automation run under a personal token.

## What good looks like

- Threat models identify protected assets, trust boundaries, attacker goals, abuse
  cases, and controls; tests exercise the highest-risk paths and failure modes.
- Dangerous capabilities are absent or disabled by default. Setup does not require
  customers to discover that a public endpoint, default credential, or broad role must
  be removed after launch.
- Inputs are parsed with allowlisted structure and bounded size. Outputs are encoded
  for their destination. Errors reveal enough to recover without leaking sensitive
  internals, credentials, or cross-tenant facts.
- Every protected operation has one policy decision point with a testable deny path.
  The user interface hiding a button is not authorization.
- Tokens are audience-restricted, time-bound, minimally scoped, and validated for
  issuer, signature, subject, audience, expiry, and relevant context.
- Tenant identity travels end to end and is enforced at every data boundary. Caches,
  queues, batch jobs, and support tools preserve the same isolation as request paths.
- Authorization decisions produce privacy-safe audit evidence: actor, action,
  resource, policy version, decision, and correlation identifier.
- Credential rotation, revocation, identity-provider outage, and key compromise have
  tested procedures with bounded recovery time.

Security requirements, threat models, policy, and safe defaults belong in version
control or another reviewable history. Changes receive tests for positive, negative,
malformed-input, cross-tenant, stale-token, privilege-escalation, and degraded-
dependency cases. Infrastructure and application controls should compose; neither
should silently override the other.

## Common failure modes

One API key per environment, bearer tokens with no audience restriction, roles that
grow forever, implicit trust for internal traffic, authorization checked only at the
gateway, permissive defaults, unbounded parsers, unsafe deserialization, shared admin
accounts, secrets embedded in images, and support tools that bypass tenant controls
all create ambient authority.

Logging complete tokens “for debugging” turns telemetry into a credential leak.
Failing open when the policy system is unavailable turns an outage into a breach.

## Litmus test

> For a randomly selected sensitive operation, can the team name the protected asset,
> threat and abuse cases, authenticated actor, policy decision, minimum capability,
> input boundary, safe default, audit event, and revocation path—and prove malformed,
> cross-tenant, stale, and over-privileged attempts are denied safely?

Then remove network-location signals from the decision. If access becomes impossible
to explain without “it came from inside,” the system still has implicit trust.

## Research lineage

Kevin Hoffman named authentication and authorization as absent from the original
twelve. NIST SP 800-207 adds the essential correction that network location grants no
implicit trust. NIST SSDF, OWASP SAMM, and CISA Secure by Design widen the obligation
across requirements, design, implementation, verification, operations, safe defaults,
and responsibility for customer security outcomes.

*Sources: [Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/), [NIST SP 800-207, Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final), [OWASP SAMM](https://owaspsamm.org/model/), and [CISA Secure by Design](https://www.cisa.gov/securebydesign).*
