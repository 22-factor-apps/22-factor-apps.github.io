---
number: 20
numeral: "XX"
slug: human-in-the-loop
title: "Humans in the Loop"
tagline: "Automate the pipeline; gate the blast radius on explicit human judgment"
original: false
---

Full automation is the goal for everything that is reversible. For everything that
isn't, twenty-two-factor prescribes a **human in the loop**: a named person making an
explicit, recorded decision at exactly the points where judgment beats throughput.
The craft is putting the gates where blast radius lives — and nowhere else.

## Where gates belong

**Production promotion.** The pipeline builds and verifies `v2.41.0` and stages it
everywhere automatically ([Factor XIX](/factors/deploy-tags)); a human approves the
production promotion for releases that touch risk — schema migrations, auth paths,
payment flows. Low-risk services may earn continuous deployment; that earning is
itself a recorded decision.

**Destructive operations.** Data deletions and irreversible migrations, secret and
root-key rotations ([Factor XIV](/factors/root-secrets)), production consoles and
break-glass SSH ([Factors XII](/factors/admin-processes) and
[XVII](/factors/immutable-infra)) — all gated, all attributed, all time-boxed.

**Agent-executed change.** New since the original twelve: AI agents now write code,
open PRs, and operate tooling. Twenty-two-factor treats agent output like any other
untrusted-until-reviewed change — it enters through the same review gate
([Factor XXI](/factors/code-review)) and the same promotion gates, with the agent's
actions logged to the same event stream ([Factor XI](/factors/logs)).

## How to gate well

Make approvals **first-class pipeline objects** — protected environments and approval
steps in the deploy system, not a thumbs-up emoji in chat. Show the approver a real
diff: code delta, config delta (readable, thanks to
[Factor XIII](/factors/encrypted-config)), migration plan, rollback plan. Record who,
what, when, and why into the audit stream. Time-box everything: approvals expire,
break-glass access self-revokes, and every exception opens a follow-up task by
default.

## What this factor forbids

Rubber stamps — a gate everyone clicks through unread is worse than no gate, because
it manufactures false accountability. Surprise heroics — if a human routinely
intervenes *inside* an automated process, that's a missing design, not diligence.
And silent overrides: the break-glass path must be louder, not quieter, than the
normal one.
