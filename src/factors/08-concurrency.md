---
number: 8
numeral: "VIII"
slug: concurrency
title: "Concurrency"
tagline: "Scale out via the process model"
original: true
---

In a twenty-two-factor app, processes are first-class citizens and the unit of
scale. Workloads are assigned **process types**: web processes handle HTTP, worker
processes consume queues, scheduled processes run periodic jobs. The app scales out
horizontally by running more instances of a type — never solely by inflating one
instance into an ever-larger VM.

This does not forbid in-process concurrency. Async runtimes, thread pools, and
green-thread schedulers can and should multiplex work inside each process; the point
is that the **share-nothing, horizontally partitionable** process remains the shape
that scaling adds more of. That shape maps directly onto modern orchestrators — a
process type becomes a Deployment or a service definition, and autoscaling adjusts
replica counts against load.

Two refinements:

**Processes never daemonize.** They rely on the platform's process manager — an
orchestrator, systemd, a supervisor — to manage output streams
([Factor XI](/factors/logs)), respond to crashes, and handle restarts.

**Scale-down is a first-class event.** Adding replicas is easy; removing them safely is
where systems rot. Because processes are disposable
([Factor IX](/factors/disposability)) and long-lived connections are drained rather
than dropped ([Factor XVIII](/factors/stateful-connections)), the autoscaler can
contract the formation as confidently as it expands it.

> **The litmus test:** double the replica count of any process type. Throughput should roughly double; if two instances trample each other, revisit [Factor VI](/factors/processes) first.

*Adapted from Factor VIII of the original [twelve-factor methodology](https://12factor.net/concurrency).*
