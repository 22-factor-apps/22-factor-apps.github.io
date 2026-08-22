---
number: 21
numeral: "XXI"
slug: code-review
title: "Review Like You Mean It"
tagline: "Small diffs, fast turnarounds, machines before humans, and review as knowledge transfer"
original: false
---

Code review is the highest-leverage quality practice most teams run badly. Done well
it catches design errors while they're cheap, spreads system knowledge, and forms the
audit trail that [Factor XX](/factors/human-in-the-loop) depends on. Done badly it's a
multi-day queue that teaches engineers to batch changes into unreviewable monsters.
Twenty-two-factor prescribes the practices with actual evidence behind them:

## Keep diffs small

Review effectiveness collapses with size — a 2,000-line PR gets a shrug where five
200-line PRs get real scrutiny. Slice work into stacked, independently shippable
changes; separate refactors from behavior changes; never mix a format-the-codebase
commit into a logic diff. If a reviewer cannot hold the change in their head, it's
not a reviewable change yet.

## Machines first, humans second

Every mechanical check runs before a human looks: formatting, linting, type checks,
tests, coverage deltas, dependency and secret scanning (the last one doubly important
given [Factor XIII](/factors/encrypted-config) — plaintext credentials must be
unmergeable, mechanically). Human attention is the scarcest resource in the pipeline;
spending it on brace placement is malpractice. AI review assistants belong in this
tier too: useful for a first pass, never a substitute for the accountable human
approval.

## Turn around fast

Review latency, not review depth, is what teams actually suffer from. Working
agreements beat heroics: first response within a business half-day, reviewing
prioritized above starting new work, PRs that sit flagged in standup. Fast review is
what *makes* small diffs economical — nobody slices work thinly to wait three days
per slice.

## Review the right things, kindly

Reviewers own design, correctness, edge cases, operability (will this drain cleanly
per [Factor XVIII](/factors/stateful-connections)? roll back cleanly per
[Factor XIX](/factors/deploy-tags)?), and comprehensibility. Comments critique code,
never people; authors annotate non-obvious decisions preemptively; disagreements
escalate to a synchronous conversation instead of a 40-comment thread. Approval
means "I'd be comfortable being paged for this" — that's the standard, and everyone
knows it.
