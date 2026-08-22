# The Twenty-Two-Factor App

Source for **[22-factor-apps.github.io](https://22-factor-apps.github.io)**: an
open-source field guide for building software that can be understood, trusted,
changed, and operated.

This edition keeps ten durable principles from the original
[twelve-factor methodology](https://12factor.net/), retires two mechanisms whose
intent is better expressed elsewhere, and adds twelve modern production obligations.

## The set

| # | Factor | Class | Core idea |
|---:|---|---|---|
| I | Codebase | Original | One authoritative history for every deploy |
| II | Dependencies | Original | Declare, resolve, verify, and isolate everything |
| III | Configuration | Original | Bind deploy-specific values after build |
| IV | Backing Services | Original | Treat network dependencies as attached resources |
| V | Build, Release, Run | Original | Create once, bind once, promote without mutation |
| VI | Stateless Processes | Original | Persist through explicit backing services |
| VII | Concurrency | Original | Scale with explicit process types and bounds |
| VIII | Disposability | Original | Start promptly, stop gracefully, recover by replacement |
| IX | Environment Parity | Original | Keep feedback fast and production behavior representative |
| X | Admin Processes | Original | Run operational work from the same release |
| XI | Contract-First Interfaces | New | Define behavior before transport |
| XII | Identity & Least Privilege | New | Authenticate every actor; authorize every action |
| XIII | Observability & SLOs | New | Connect signals to user-visible decisions |
| XIV | Supply Chain Integrity | New | Make artifacts traceable, verifiable, and admissible |
| XV | Resilience & Fault Containment | New | Bound failure amplification |
| XVI | Data Lifecycle & Privacy | New | Govern data from collection through deletion |
| XVII | Infrastructure & Policy as Code | New | Declare desired state and reconcile drift |
| XVIII | Progressive Delivery | New | Expand exposure with evidence |
| XIX | Evolutionary Compatibility | New | Let consecutive versions coexist |
| XX | Operational Ownership | New | Give every service a team and learning loop |
| XXI | Cost as Architecture | New | Tie usage to value and budgets |
| XXII | Sustainable Operation | New | Reduce physical impact per unit of useful work |

The retired originals are **Port Binding** and **Logs as Event Streams**. Port
binding remains a good implementation pattern, but Contract-First Interfaces is the
transport-neutral principle. Structured logs remain essential, but Observability &
SLOs covers the complete signal and decision model. The site keeps detailed
[retirement notes](https://22-factor-apps.github.io/retired) and credits the original
authors.

## Research lineage

The three most direct additions—API first, telemetry, and authentication / authorization—
come from Kevin Hoffman’s *Beyond the Twelve-Factor App*. The remaining additions
synthesize primary guidance from Google SRE, CNCF and OpenGitOps, NIST, SLSA,
Semantic Versioning and Kubernetes, the FinOps Foundation, and the Green Software
Foundation. The site publishes an [annotated research trail](https://22-factor-apps.github.io/research).

## Local development

The site is deliberately small: Astro builds static HTML from 22 Markdown documents,
one shared layout, and one stylesheet. It ships no client-side JavaScript and fetches
no web fonts.

```sh
npm ci
npm run build
npm run dev
```

Factor documents live in `src/content/factors/`. Each includes frontmatter used by the
index and article layout, followed by the principle, concrete practices, failure
modes, a litmus test, and source lineage.

## Deployment

GitHub Pages deploys an immutable version tag through
`.github/workflows/deploy.yml`. The workflow installs from `package-lock.json`, builds
the static site, and uploads the Pages artifact.

```sh
git tag -a v0.2.0 -m "Twenty-Two-Factor field guide"
git push origin v0.2.0
```

The workflow can also be dispatched manually for recovery. Third-party actions are
pinned to exact commits; update the commit and version comment together.

## License and credit

[MIT](LICENSE) © 2026 The 22-Factor Apps Authors.

This project is inspired by and links to the
[original twelve-factor methodology](https://12factor.net/) created by Adam Wiggins
and contributors at Heroku. It is not affiliated with Heroku or Salesforce.
