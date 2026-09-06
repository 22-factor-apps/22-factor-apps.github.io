---
number: 17
numeral: "XVII"
slug: immutable-infra
title: "Immutable Infrastructure"
tagline: "Bake images — AMIs, machine images, OCI images — and replace, never mutate"
original: false
---

Servers that are patched, tweaked, and SSH'd into over months become **snowflakes** —
unique, unreproducible, and load-bearing in ways nobody remembers. Twenty-two-factor
infrastructure is **immutable**: every layer of the stack is a baked artifact that is
replaced wholesale, never modified in place.

## Bake, don't patch

The build stage ([Factor V](/factors/build-release-run)) extends below the app. With
Packer, EC2 Image Builder, or a Nix/OSTree-based pipeline, CI bakes a **machine
image** — an AMI on AWS, equivalent images on GCP/Azure, or a bootable container
image for image-based Linux hosts — containing the OS, hardening, agents, and
runtime. App-level OCI images ([Factor XV](/factors/oci-not-docker)) then ride on top
of those hosts. Both kinds of image are versioned, signed, and traceable to the git
tag that produced them ([Factor XIX](/factors/deploy-tags)).

## Replace, don't reconfigure

A deploy or an OS patch is a **rolling replacement**: bring up instances from the new
image behind the load balancer, drain the old ones
([Factor IX](/factors/disposability), [Factor XVIII](/factors/stateful-connections)
for the connection-heavy services), and terminate them. Rollback is the same motion
pointed at the previous image — which still exists, because images are append-only
like releases. Autoscaling groups and instance refresh make this the platform's job,
not a script's.

## Consequences

**SSH is a break-glass event**, not a management tool — gated and logged per
[Factor XX](/factors/human-in-the-loop). **No configuration management drift**: if a
setting must change, it changes in the image definition in the repo, via review
([Factor XXI](/factors/code-review)), and rolls out as a new image. **State is
explicit**: anything that must survive replacement lives in a backing service or
attached volume ([Factor IV](/factors/backing-services)) — the instance itself is
cattle by construction. The test of the whole factor is one question: *could you
terminate any instance right now and explain, from the repo alone, exactly what
replaces it?*
