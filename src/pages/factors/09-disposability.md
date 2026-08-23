---
layout: ../../layouts/Factor.astro
number: 9
title: Disposability
tagline: Maximize robustness with fast startup and graceful shutdown
---

Processes of a twenty-two-factor app are **disposable**: they start in seconds, stop
cleanly on demand, and can be killed at any moment without collateral damage. Disposability
is what makes elastic scaling, rapid deploys, and self-healing platforms possible — the
orchestrator's whole worldview assumes it.

## The modern restatement

- **Startup is seconds, not minutes.** Lazy-load what you can, defer warm-up, and keep
  images small (see [Factor 15, Open containers](/factors/15-open-containers/)). Slow
  startup silently taxes every deploy, every scale-up, every recovery.
- **`SIGTERM` is a contract.** On termination signal: stop accepting new work, finish or
  hand back in-flight work within the grace period, close connections deliberately, then
  exit. The platform's grace window (often 30 seconds) is part of your config, not trivia.
- **Readiness and liveness are different questions.** "Don't send me traffic yet" and "I am
  wedged, restart me" need separate probes. Conflating them turns routine GC pauses into
  restart storms.
- **Workers make jobs re-runnable.** Queue workers return the job on shutdown; job design
  makes retries safe through idempotency, because at-least-once delivery is the only
  delivery you'll ever really get.
- **Crash-only is the baseline.** Graceful shutdown is an optimization, not a dependency.
  Power loss, OOM kills, and spot-instance reclaims skip your handlers entirely; the app
  must recover from an unclean death with no manual repair.

Long-lived connections deserve — and get — their own treatment: draining a process holding
ten thousand WebSockets is [Factor 18, Stateful connections](/factors/18-stateful-connections/).

## The litmus test

`kill -9` a random instance during peak traffic. If users notice anything beyond a retried
request, disposability needs work.
