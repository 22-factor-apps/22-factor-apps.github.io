---
number: 12
numeral: "XII"
slug: identity-least-privilege
title: "Identity & Least Privilege"
tagline: "Authenticate every actor and authorize every action explicitly"
original: false
category: "Security"
reading: "7 min"
---

Identity is the control plane of a distributed system. Every person, workload, device,
automation, and external integration that crosses a protected boundary should present
an explicit identity. Every requested action should be authorized for that identity,
resource, operation, tenant, and context—without relying on network location as proof
of trust.

## The principle

Separate **authentication** (“who or what is this?”) from **authorization** (“may this
actor do this action here, now?”). Deny by default. Grant only the capabilities needed
for the task, for the shortest practical duration, and make delegation visible.

This modernizes Hoffman’s “Authentication and Authorization” addition with the
resource-centric model of zero trust. A request from the private network, the same
cluster, or a company-owned device is not inherently trusted. The relevant evidence
is authenticated identity, device or workload posture where needed, and policy at the
resource boundary.

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

Policy belongs in version control or another reviewable, immutable history. Changes
receive tests for positive, negative, cross-tenant, stale-token, and privilege-
escalation cases. Infrastructure identity and application authorization should
compose; neither should silently override the other.

## Common failure modes

One API key per environment, bearer tokens with no audience restriction, roles that
grow forever, implicit trust for internal traffic, authorization checked only at the
gateway, shared admin accounts, secrets embedded in images, and support tools that
bypass tenant controls all create ambient authority.

Logging complete tokens “for debugging” turns telemetry into a credential leak.
Failing open when the policy system is unavailable turns an outage into a breach.

## Litmus test

> For a randomly selected sensitive operation, can the team name the authenticated
> actor, policy decision, minimum granted capability, credential lifetime, tenant
> boundary, audit event, and revocation path—and prove a neighboring tenant or stale
> identity is denied?

Then remove network-location signals from the decision. If access becomes impossible
to explain without “it came from inside,” the system still has implicit trust.

## Research lineage

Kevin Hoffman named authentication and authorization as absent from the original
twelve. NIST SP 800-207 adds the essential modern correction: no implicit trust is
granted solely because of network location or ownership; policy protects resources.

*Sources: [Beyond the Twelve-Factor App](https://www.oreilly.com/library/view/beyond-the-twelve-factor/9781492042631/) and [NIST SP 800-207, Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final).*
