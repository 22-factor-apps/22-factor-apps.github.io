---
number: 10
numeral: "X"
slug: dev-prod-parity
title: "Dev/Prod Parity"
tagline: "Keep development, staging, and production as similar as possible"
original: true
---

Historically, development and production diverged across three gaps: the **time gap**
(code took weeks to ship), the **personnel gap** (developers wrote it, ops deployed
it), and the **tools gap** (SQLite and nginx locally; PostgreSQL and a cloud load
balancer in production). The twenty-two-factor app is designed for continuous
deployment, which means keeping every gap small.

Time: a change written today deploys within hours. Personnel: the people who wrote the
code stay involved in deploying and observing it — with the review and approval
disciplines of [Factors XX](/factors/human-in-the-loop) and
[XXI](/factors/code-review) providing the safety that used to be (badly) provided by
handoffs. Tools: run the same database, the same queue, the same runtime versions
everywhere.

The modern toolchain has largely dissolved the tools gap — if you let it. The same OCI
image built once in CI ([Factor XV](/factors/oci-not-docker)) runs in development,
staging, and production; containerized backing services make running "the real"
PostgreSQL locally a one-liner. Twenty-two-factor adds a parity dimension the original
couldn't: **config parity**. Because each environment's config is committed encrypted,
side by side, in `env/enc/` ([Factor XIII](/factors/encrypted-config)), staging/prod
drift shows up as a reviewable diff instead of a 2 a.m. surprise.

Resist the urge to use lightweight stand-ins for backing services. The cost of parity
has never been lower; the cost of divergence is the same as it ever was.

*Adapted from Factor X of the original [twelve-factor methodology](https://12factor.net/dev-prod-parity).*
