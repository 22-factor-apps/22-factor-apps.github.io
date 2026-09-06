---
layout: ../../layouts/Factor.astro
number: 11
title: Logs
tagline: Treat telemetry as event streams the app never manages
---

A twenty-two-factor app **never concerns itself with routing or storing its own output**.
Each process writes its event stream, unbuffered, to `stdout`; the execution environment
captures, aggregates, and ships it. Where logs end up — and for how long — is an
operational decision made outside the app.

## The modern restatement

The original factor said *logs are event streams*. The industry took the idea further:
logs, metrics, and traces are three views of the same underlying events — and the app's
obligations grew accordingly:

- **Log structured events.** Emit one JSON (or otherwise machine-parseable) object per
  event, with consistent field names, levels, and timestamps. Prose logs made for humans
  scrolling terminals become regex archaeology at aggregation scale.
- **Propagate correlation.** Attach request, trace, and span identifiers to every event, and
  forward inbound context to outbound calls. One user-visible failure should be traceable
  across every process it touched. OpenTelemetry is the settled vocabulary for this.
- **Still no log files, still no in-app shipping.** Writing to disk breaks
  [Factor 06, Processes](/factors/06-processes/); embedding a delivery pipeline in the app
  couples it to today's observability vendor. The platform's collector tails streams and
  ships them; swapping vendors is then a platform change, not an app change.
- **Logs are an interface — treat them with review care.** Alerts and dashboards parse
  these events, and secrets must never appear in them. Log lines that things depend on
  deserve the same scrutiny as API responses (see
  [Factor 21, Code review](/factors/21-code-review/)).

## Anti-patterns

Log files with rotation cron jobs; each app shipping directly to a hosted logging API;
printf-debugging formats that no query language can parse; tokens and PII splattered into
events that outlive every retention promise you've made.
