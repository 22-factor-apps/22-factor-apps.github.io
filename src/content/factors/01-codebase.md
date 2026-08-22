---
number: 1
numeral: "I"
slug: codebase
title: "Codebase"
tagline: "One codebase tracked in revision control, many deploys"
original: true
---

A twenty-two-factor app is always tracked in a version control system — today that
almost always means git, though the principle is VCS-agnostic. There is exactly one
codebase per app: a single repository from which every deploy of that app is produced.

If there are multiple codebases, it's not an app — it's a distributed system, and each
component in that system is its own app that can individually follow the factors.
Conversely, multiple apps sharing the same code is a violation: shared code should be
factored into libraries and pulled in through the dependency manager (see
[Factor II](/factors/dependencies)).

A **deploy** is a running instance of the app: production, staging, review apps, and
every developer's local copy. All of them share the same codebase, even though each
deploy may be running a different commit — and, under this methodology, production is
always running a **tagged** commit (see [Factor XIX](/factors/deploy-tags)).

The one modern refinement we make to the original: the codebase now legitimately
carries more than application code. Infrastructure definitions, deploy workflows, and
**encrypted** configuration (see [Factor XIII](/factors/encrypted-config)) all belong
in the same repository, so that a single `git checkout <tag>` reproduces not just the
software but the shape of its deployment.

*Adapted from Factor I of the original [twelve-factor methodology](https://12factor.net/codebase).*
