---
number: 11
numeral: "XI"
slug: logs
title: "Logs"
tagline: "Treat logs as event streams"
original: true
---

Logs are the stream of time-ordered events emitted by all of an app's running
processes and backing services. A twenty-two-factor app **never concerns itself with
routing or storage of its own output**: it does not write logfiles, rotate them, or
ship them. Each process writes its event stream, unbuffered, to `stdout`.

In development, the developer watches the stream in a terminal. In deployment, the
execution environment captures each process's stream, collates it with all others,
and routes it to wherever the operators have attached: a log indexer, an object-store
archive, an alerting pipeline. Those destinations are attached resources
([Factor IV](/factors/backing-services)), invisible to the app.

Modern refinements:

**Emit structured events.** One JSON object per line turns the log stream into a
queryable dataset rather than a wall of prose, and lets the platform attach trace and
span identifiers so a request can be followed across process types.

**Logs are one signal of three.** Metrics and traces follow the same rule as logs: the
app emits, the environment collects (OpenTelemetry being the lingua franca), and
nothing about a destination is hardcoded.

**Log the lifecycle, not the secrets.** Deploys, drains, config reloads, and approval
events ([Factor XX](/factors/human-in-the-loop)) belong in the stream — decrypted
config values ([Factor XIII](/factors/encrypted-config)) never do.

*Adapted from Factor XI of the original [twelve-factor methodology](https://12factor.net/logs).*
