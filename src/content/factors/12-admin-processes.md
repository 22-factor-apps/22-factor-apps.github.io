---
number: 12
numeral: "XII"
slug: admin-processes
title: "Admin Processes"
tagline: "Run admin and management tasks as one-off processes"
original: true
---

Database migrations, one-time scripts, an interactive console for inspecting live
data — these one-off administrative tasks run as **one-off processes** in an
environment identical to the app's regular long-running processes. Same release, same
codebase at the same tag, same decrypted config, same dependency isolation. Admin code
ships with application code to avoid synchronization drift.

Under twenty-two-factor, this factor picks up teeth it never had:

**One-offs go through the release, never around it.** The task runs from the same OCI
image ([Factor XV](/factors/oci-not-docker)) as the deploy it administers — `kubectl
run`/`exec`, `podman run`, or your platform's one-off runner — not from a laptop with
approximately-similar code and a hand-exported environment.

**Production one-offs are human-in-the-loop events.** An interactive console attached
to production data is among the most dangerous tools in the shop. Factor
[XX](/factors/human-in-the-loop) applies: such sessions are gated on an approval,
attributed to a named operator, time-boxed, and logged into the event stream
([Factor XI](/factors/logs)).

**Prefer scripted, reviewed one-offs over ad-hoc typing.** A migration or data fix
written as a script gets code review ([Factor XXI](/factors/code-review)), lands via a
merge ([Factor XXII](/factors/merge-policy)), and becomes part of the codebase's
history — reproducible on staging first, auditable forever after.

*Adapted from Factor XII of the original [twelve-factor methodology](https://12factor.net/admin-processes).*
