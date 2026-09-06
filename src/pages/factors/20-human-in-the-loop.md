---
layout: ../../layouts/Factor.astro
number: 20
title: Human in the loop
tagline: Automate everything; gate the irreversible on a human
---

Full automation is the goal for everything that can be undone. For everything that can't,
the twenty-two-factor app places a **deliberate human gate**: a named person, with real
context, making an explicit decision that is recorded. The craft is in knowing which is
which — and in designing the gates so well that humans approve *meaningfully* instead of
rubber-stamping.

## Where the gates go

- **Irreversible operations.** Destructive migrations, data deletion, key rotation of the
  root of trust (see [Factor 14](/factors/14-root-of-trust/)), production-wide config
  changes. Automation prepares, validates, and stages; a human pulls the trigger.
- **Release promotion.** Cutting the tag (see
  [Factor 19, Tagged releases](/factors/19-tagged-releases/)) and promoting a canary to
  the full fleet are natural human checkpoints — low frequency, high consequence.
- **AI-generated changes.** Code, config, and operations increasingly originate from
  automated agents. Agent-authored output enters production through the same gates as
  human work — review, approval, provenance — with the *authoring agent identified*, never
  laundered through a human's name.

## The discipline of a good gate

- **Small surface, full context.** The approver sees the diff, the blast radius, the
  rollback plan, and the canary's numbers — in the approval itself, not four dashboards
  away. An approval request that can't be evaluated in minutes is a design failure.
- **Approvals are recorded and attributable.** Who approved what, when, seeing which
  evidence. This is an audit trail, and it is also how the *next* approver learns what
  normal looks like.
- **The gate must not become a bottleneck-shaped rubber stamp.** If approvals are so
  frequent that people click through them, the boundary is drawn wrong — automate more of
  the reversible middle, keep the human moments rare and real.
- **Break-glass exists and is loud.** Emergencies need a documented bypass that alerts
  everyone, expires quickly, and generates a mandatory review. An undocumented bypass is
  just a vulnerability with good intentions.

## The litmus test

List the actions in your delivery pipeline that a human must approve. If the list is long,
you're using people as an error-correction layer for weak automation. If it's empty, an
unattended process can destroy something you can't get back. Both are failures of design.
