---
number: 3
numeral: "III"
slug: config
title: "Configuration"
tagline: "Keep deploy-specific values out of immutable application artifacts"
original: true
category: "Runtime"
reading: "5 min"
---

Configuration is everything that legitimately varies between deploys: resource
addresses, feature policy, regional settings, credentials, and operational limits.
It must be supplied explicitly at release or runtime, never baked into application
code or smuggled in through an environment-specific build.

## The principle

Build one artifact and bind deploy-specific configuration later. The application
reads values through a small, documented interface—environment variables, mounted
files, or a configuration service—and validates the complete configuration before it
begins accepting work.

Separating config from code does **not** mean configuration should be unversioned or
ownerless. Schemas, safe defaults, policy, encrypted values, and non-secret desired
state can be reviewed in version control. Secret plaintext belongs in a dedicated
secret system or a short-lived deployment boundary. Encrypted configuration may be
committed when key custody is genuinely separate, but encryption is not permission
to scatter credentials through source trees.

## What good looks like

- Define a typed schema with purpose, owner, required/optional status, safe range,
  sensitivity, and reload behavior for every setting.
- Fail closed at startup when required values are missing or malformed. Do not run
  half-configured and discover the error on the first production request.
- Use orthogonal values rather than named environment bundles. A deploy chooses a
  database handle, region, and feature policy independently; it does not inherit an
  opaque `production.rb` full of unrelated decisions.
- Make sensitive values short-lived, narrowly scoped, redacted from diagnostics, and
  rotatable without rebuilding the artifact. [Factor XII](/factors/identity-least-privilege)
  covers workload identity and least privilege.
- Record a non-secret configuration fingerprint with each release so operators can
  correlate behavior without exposing values.

Config changes are production changes. They deserve validation, review, progressive
exposure, and rollback just like code. A feature flag that can redirect all traffic
has a larger blast radius than many source patches.

## Common failure modes

Hard-coded service URLs, credentials in source, one artifact per environment,
plaintext `.env` files passed through chat, unlimited feature-flag accumulation, and
configuration with no schema or owner all violate the intent. So does a centralized
configuration service that can mutate every instance instantly without history,
approval, or compatibility checks.

Avoid secrets in command-line arguments, where process listings and shell histories
may expose them. Avoid logging the entire environment during startup or failure.

## Encrypted configuration belongs in the codebase

The strongest form of reviewable configuration is committed ciphertext. Store
each deploy's variables in the repository under `env/enc/`—values encrypted one
by one with an audited tool such as age or SOPS, keys left readable so a diff
still says which setting changed. At release time, decrypt to `env/dec/*.env`
(gitignored, short-lived) and inject through the environment interface above;
the application never knows the difference. Config changes then carry a commit,
an author, a review, and a revert path, and checking out any tag reproduces the
code and the configuration that shipped with it.

What cannot live in the repository is the root of trust: the decryption key.
Hold that—and at most one bootstrap credential beside it—in an external secrets
service such as fiducia-cloud, fetched at deploy time via workload identity and
logged on every access. One or two secrets outside the codebase, everything
else encrypted within it: that inversion is what lets the litmus below pass
without a scavenger hunt.

## Litmus test

> Could the repository become public and the released artifact be copied to another
> environment without disclosing a credential or rebuilding—and would the process
> reject an incomplete configuration before serving traffic?

That test is stricter than “we use environment variables.” It checks separation,
validation, secrecy, and portability together.

*Modernized from [Factor III of the original twelve-factor methodology](https://12factor.net/config).*
