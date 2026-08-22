---
number: 22
numeral: "XXII"
slug: sustainable-operation
title: "Sustainable Operation"
tagline: "Reduce energy, carbon, water, and hardware per unit of useful work"
original: false
category: "Efficiency"
reading: "7 min"
---

Software consumes physical resources even when its interface looks weightless. Compute
uses electricity and water; hardware carries manufacturing and disposal emissions;
data movement and retention compound across replicas; overprovisioning turns idle
capacity into a permanent footprint. Sustainability belongs in architecture because
architecture determines demand.

## The principle

Measure and reduce environmental impact **per unit of useful work** while preserving
explicit reliability, security, privacy, and accessibility constraints. Act through
three direct levers identified by the Green Software Foundation:

- **Energy efficiency:** perform the required work with less electricity.
- **Carbon awareness:** shift flexible work to times or places where electricity is
  cleaner, when data and latency constraints permit.
- **Hardware efficiency:** use provisioned hardware well and extend useful lifetime so
  fewer devices and servers must be manufactured for the outcome.

Track water and other material impacts when they are significant and measurable.
Avoid reducing the problem to a provider’s renewable-energy claim or a single annual
offset.

## Start with useful work

Choose a functional unit: successful transaction, processed document, active-user
hour, model inference meeting a quality threshold, or another product outcome. Measure
energy, estimated carbon intensity, hardware utilization, data transfer, and water
where available against that unit. Absolute totals still matter, but intensity shows
whether engineering improved as demand changed.

The Software Carbon Intensity specification offers one method for connecting software
operation to energy and embodied hardware emissions. Precision will vary by provider
and platform; record boundaries, estimation methods, uncertainty, and excluded impact
so trends are honest.

## Design out unnecessary demand

- Eliminate unused features, duplicate pipelines, polling, runaway retries, excessive
  telemetry, over-retention, and redundant transformations.
- Improve algorithms, queries, data formats, compression, caching, and batching while
  measuring whole-system effects. A cache that saves CPU but triples memory and stale
  invalidation traffic may move rather than reduce impact.
- Right-size resources and autoscaling bounds; increase safe utilization; turn off
  abandoned and non-production capacity; prefer hardware appropriate to the workload.
- Move delay-tolerant builds, batch jobs, and training to cleaner periods or regions
  when residency, latency, and recovery requirements allow.
- For AI workloads, include training, inference, evaluation, data preparation, model
  quality, and accelerator utilization. A smaller model is better only if it still
  meets the required outcome.

Cost and sustainability often align because both penalize unused resources, but not
always. The cheapest region may have higher carbon or water intensity; extra replicas
may be required for a safety objective. Make the trade-off visible rather than letting
price decide silently.

## Common failure modes

Optimizing a microbenchmark while total demand grows, claiming carbon neutrality from
offsets without reducing energy, moving compute across regions while ignoring data
transfer and residency, deleting observability needed for reliability, and reporting
provider-wide averages as workload measurements all produce green theater.

Efficiency gains can trigger rebound effects when cheaper operation encourages much
more usage. Track absolute impact and product demand alongside intensity.

## Litmus test

> Can the team name its functional unit, measurement boundary, energy and carbon
> intensity trend, hardware-utilization signal, largest sources of unnecessary work,
> and the reliability/privacy constraints on shifting or reducing demand—then show one
> verified improvement in both intensity and absolute impact where growth permits?

If the only evidence is the cloud provider’s sustainability page, the workload itself
is still unmeasured.

## Research lineage

The Green Software Foundation’s current principles center energy efficiency, carbon
awareness, hardware efficiency, and measurement. Its SCI specification provides a
vendor-neutral method for scoring software carbon intensity. AWS added sustainability
as a Well-Architected pillar, confirming it as a mainstream architecture concern.

*Sources: [Green Software Foundation principles](https://learn.greensoftware.foundation/introduction/), [Software Carbon Intensity specification](https://sci.greensoftware.foundation/), and [AWS Well-Architected sustainability pillar](https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/definitions.html).*
