---
number: 22
numeral: "XXII"
slug: merge-policy
title: "A Deliberate Merge Policy"
tagline: "Pick a merge vs rebase strategy on purpose, write it down, and never rewrite shared history"
original: false
---

Every team has a merge strategy; most have it by accident. The result is a history
that is half merge-bubbles, half force-push scar tissue — useless for `git bisect`,
hostile to `git log`, and a recurring source of Friday-afternoon conflict archaeology.
Twenty-two-factor doesn't mandate one strategy; it mandates that you **choose one
deliberately, encode it in tooling, and follow it everywhere.**

## The one iron law

**Never rewrite shared history.** Rebase, squash, amend, and force-push are excellent
tools for commits that exist only on your unshared branch — and vandalism on any
branch others have pulled. `main` and release branches accept fast-forwards and merge
commits only; protect them so the rule is mechanical, not cultural
(`--force-with-lease` being the courtesy required even on your own published
branches).

## The sane default

For most teams: **rebase feature branches, squash-or-merge into main.**

- While a PR is open, the author freely rebases onto `main` to stay current and
  reshape WIP commits into a reviewable story ([Factor XXI](/factors/code-review)).
  Conflicts surface early, on the author's desk, commit by commit.
- Landing is one recorded event on `main`: **squash-merge** where the PR is the unit
  of meaning (one PR → one clean, revertable commit), or a true **merge commit**
  where the branch's individual commits are each meaningful and must survive. Pick
  per-repo, enforce in the forge settings, and disable the strategies you didn't pick.

A linear-ish `main` built this way is what makes `git bisect` decisive, `git revert`
surgical, and the release ledger of [Factor XIX](/factors/deploy-tags) legible —
tags point into a history that reads as a sequence of decisions, not a subway map.

## Corollaries

Branches are short-lived integration requests, not habitats — a branch older than a
few days is a merge conflict with a calendar. Long-lived environment branches are
already forbidden by [Factor XIX](/factors/deploy-tags); this factor closes the loop
by forbidding their cousin, the eternal feature branch. Write the policy into
`CONTRIBUTING.md`, wire it into branch protection, and let the tooling — not tribal
memory — say how code lands.
