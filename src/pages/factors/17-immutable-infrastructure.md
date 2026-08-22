---
layout: ../../layouts/Factor.astro
number: 17
title: Immutable infrastructure
tagline: Bake images; replace servers, never patch them
---

Servers that get configured after they boot inevitably drift — every SSH session, hotfix,
and half-run configuration script makes each machine a little more unique, until the fleet
is a collection of snowflakes no one can rebuild. The twenty-two-factor app runs on
**immutable infrastructure**: machine images are *baked* ahead of time, instances are
launched from them, and changes ship as **new images and replacement instances**, never as
edits to running ones.

## The discipline

- **Bake, don't bootstrap.** Build AMIs (or the equivalent machine images on your cloud)
  in a pipeline — Packer or your platform's image builder — from a versioned image
  definition in the repo. Boot-time configuration shrinks to injecting instance config,
  in seconds, not a configuration-management run in minutes.
- **The image is a release.** Version images, tie each to the commit and tag that
  produced it (see [Factor 19, Tagged releases](/factors/19-tagged-releases/)), and
  promote the same image through staging to production — the infrastructure-level echo of
  [Factor 05, Build, release, run](/factors/05-build-release-run/).
- **Patching is rebuilding.** A CVE in the base OS means: rebuild the image, roll the
  fleet. Rolling replacement with health checks makes this routine; disposable processes
  (see [Factor 09](/factors/09-disposability/)) make it invisible to users.
- **Rollback is relaunching.** Yesterday's image still exists; pointing the autoscaling
  group back at it beats forensically un-editing a mutated server every time.
- **Turn off the side doors.** If SSH-ing into production to change things is possible,
  it will eventually happen under pressure. Lock instances down; when hands-on debugging
  is unavoidable, treat the instance as condemned — inspect it, learn from it, terminate
  it. Fixes land in the image definition
  (see [Factor 12, Admin processes](/factors/12-admin-processes/)).

This factor and [Factor 15, Open containers](/factors/15-open-containers/) are the same
philosophy at two layers: the container image is immutable app packaging; the machine
image is immutable host packaging. Kubernetes nodes, VM fleets, and even bare metal (with
image-based provisioning) all take the same shape.

## The litmus test

Could you terminate every instance in the fleet right now and be fully restored, from
images and config alone, without a human remembering anything? If yes, infrastructure is
cattle. If no, somewhere a pet is limping.
