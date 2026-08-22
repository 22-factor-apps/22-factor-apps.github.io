---
layout: ../../layouts/Factor.astro
number: 21
title: Code review
tagline: Review small changes fast; spend humans on substance, not style
---

Every change to a twenty-two-factor app — code *and* config, because config is in the repo
(see [Factor 13, Encrypted config](/factors/13-encrypted-config/)) — lands through a
reviewed pull request. Review is the highest-leverage quality practice we have, and also
the easiest to degrade into ritual. This factor is about keeping it real.

## The discipline

- **Small diffs or no deal.** Review quality collapses with diff size; a 2,000-line PR
  gets a shrug where ten 200-line PRs get scrutiny. Stack dependent changes, split
  refactors from behavior changes, and treat "this PR is too big" as actionable feedback.
- **Fast turnaround is a team SLA.** A review that sits for two days forces authors into
  bigger batches and stale rebases — slow review *causes* the large PRs it complains
  about. Same-day first response keeps the whole system liquid.
- **Machines review style; humans review substance.** Formatting, lint, type errors,
  coverage gates, and secret scanning run in CI before a human looks. Human attention goes
  where machines are blind: is the approach right, are the failure modes handled, is the
  data model sound, would the on-call engineer understand this at 3 a.m.?
- **Review the tests hardest.** Tests encode the author's claim about what the change
  does. Missing cases, tautological asserts, and tests deleted to go green are the
  most expensive things a reviewer can miss.
- **At least one non-author, with authority to block.** Approval must mean something:
  the reviewer understood the change and would co-own the incident it might cause.
  Rubber-stamp culture is measurable — approval-to-comment ratios don't lie.
- **Review is teaching, in both directions.** Comments explain *why*; authors respond
  with changes or reasons, not silence. The archive of review threads is part of the
  team's institutional memory.

Agent-authored code goes through the same gate with the bar raised: a human reviewer owns
the approval, and the agent's involvement is disclosed, not laundered
(see [Factor 20, Human in the loop](/factors/20-human-in-the-loop/)).

## The litmus test

Pick a random merged PR from last month. If the review thread shows a real question, a
real answer, and a change made because of it — review is alive. If it shows "LGTM" eleven
minutes after a 900-line diff was opened, you have a merge queue with extra steps.
