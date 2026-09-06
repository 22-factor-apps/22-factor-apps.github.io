---
layout: ../../layouts/Factor.astro
number: 22
title: Merge discipline
tagline: Pick one history strategy; enforce it mechanically
---

Every team fights the merge-versus-rebase war once. The twenty-two-factor app ends it by
**choosing a written strategy and enforcing it in repository settings**, because git
history is not a diary — it's the operational record that `bisect`, `revert`, incident
forensics, and [Factor 19, Tagged releases](/factors/19-tagged-releases/) all depend on.

## The strategy that works

- **Rebase feature branches; never rewrite shared ones.** Keep short-lived branches
  current by rebasing onto `main` — the history that matters stays linear and
  conflict-resolution happens close to the code's author. The iron rule: once commits are
  shared (pushed to a branch others consume, or on `main` itself), they are **immutable**.
  Force-push is for your own unmerged branch, nothing else.
- **Land on `main` by squash — or by true merge commit for multi-commit stories — but
  pick one.** Squash-merge gives one reviewable, revertable, bisectable commit per PR,
  which is exactly the granularity review happens at
  (see [Factor 21, Code review](/factors/21-code-review/)). Teams that craft deliberate
  commit series can use merge commits with linear-history-per-branch instead. What kills
  you is *mixing* strategies, which produces history no tool and no human can read.
- **`main` is always releasable.** Whatever lands is green, reviewed, and could be tagged
  now (see [Factor 19](/factors/19-tagged-releases/)). Long-lived divergent branches —
  `develop`, `release-*` as permanent fixtures, environment branches — reintroduce the
  drift and merge-day terror this factor exists to abolish.
- **Enforce mechanically, not socially.** Branch protection: required reviews and status
  checks, linear history required, force-push and deletion blocked, merge button limited
  to the chosen strategy. A convention that depends on everyone remembering it is a
  convention that fails during an incident.
- **Write commit messages for the investigator.** The subject explains *what*, the body
  explains *why*, and the PR link carries the discussion. Six months from now, `git log`
  is the only teammate still available at 2 a.m.

## The litmus test

Run `git log --oneline --graph` on `main`. If it reads as a clean, ordered sequence of
reviewed changes — one line per decision — history is an asset. If it reads like tangled
holiday lights, every future incident just got thirty minutes longer.
