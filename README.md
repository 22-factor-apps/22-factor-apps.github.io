# The Twenty-Two-Factor App

Source for **[22-factor-apps.github.io](https://22-factor-apps.github.io)**: an
open-source field guide for building software that can be understood, trusted,
changed, and operated. The static site also publishes the canonical generated
factor catalog and a portable, unscored assessment template.

This edition keeps ten durable principles from the original
[twelve-factor methodology](https://12factor.net/), retires two mechanisms whose
intent is better expressed elsewhere, and adds twelve modern production obligations.

## The set

| # | Factor | Class | Commandment |
|---:|---|---|---|
| I | Codebase | Original | Map every deploy to one authoritative source history. |
| II | Dependencies | Original | Declare, lock, verify, and isolate every build and runtime dependency. |
| III | Configuration | Original | Build without deploy-specific values; bind validated configuration later. |
| IV | Backing Services | Original | Depend on explicit contracts; attach and replace services through configuration. |
| V | Build, Release, Run | Original | Build once, identify releases immutably, and promote artifacts unchanged. |
| VI | Stateless Processes | Original | Keep execution disposable and durable state behind explicit contracts. |
| VII | Concurrency | Original | Partition work, scale horizontally, and bound every concurrency layer. |
| VIII | Disposability | Original | Start ready, stop safely, and remain correct under abrupt termination. |
| IX | Environment Parity | Original | Shorten feedback and test production-significant differences against reality. |
| X | Admin Processes | Original | Run administrative work from the shipped release through auditable procedures. |
| XI | Contract-First Interfaces | New | Specify consumer-visible behavior first, then evolve it with consumers. |
| XII | Secure by Design | New | Make the safe path the default and verify identity, inputs, abuse, and failure. |
| XIII | Observability & SLOs | New | Define user-visible objectives, instrument causality, and alert on actionable risk. |
| XIV | Supply Chain Integrity | New | Admit only artifacts traceable to reviewed source and verifiable builds. |
| XV | Resilience & Fault Containment | New | Bound time, retries, queues, load, and blast radius, then prove recovery. |
| XVI | Data Lifecycle & Privacy | New | Collect justified data, preserve agency, and govern every copy through deletion. |
| XVII | Infrastructure & Policy as Code | New | Express reviewed desired state and reconcile drift within safety bounds. |
| XVIII | Progressive Delivery | New | Separate deployment from exposure and expand only while evidence holds. |
| XIX | Evolutionary Compatibility | New | Change additively until coexistence, migration, and rollback are proved. |
| XX | Formal Methods & Functional Core | New | Model critical states and keep transformations pure, explicit, typed, and exhaustive. |
| XXI | Safe Languages & Total Types | New | Prefer memory-safe languages, explicit absence, and verified unsafe boundaries. |
| XXII | Sustainable Operation | New | Deliver useful work with less physical impact without exporting harm. |

The retired originals are **Port Binding** and **Logs as Event Streams**. Port
binding remains a good implementation pattern, but Contract-First Interfaces is the
transport-neutral principle. Structured logs remain essential, but Observability &
SLOs covers the complete signal and decision model. The site keeps detailed
[retirement notes](https://22-factor-apps.github.io/retired) and credits the original
authors.

## Research lineage

The three most direct additions—API first, telemetry, and authentication / authorization—
come from Kevin Hoffman’s *Beyond the Twelve-Factor App*. The current edition compares
the set against the Reactive Manifesto, SRE, the Principles of Chaos Engineering,
DORA, three Well-Architected frameworks, CNCF and OpenGitOps, OWASP SAMM, NIST and
CISA secure-development guidance, the Agile Manifesto, Local-first Software, FinOps,
sustainable-software principles, and Google’s AI-focused Sixteen-Factor extension.
The site publishes the [full compare-and-contrast analysis](https://22-factor-apps.github.io/research).

## Local development

The site is deliberately small: Astro builds static HTML from 22 Markdown documents,
one shared layout, and one stylesheet. It ships no client-side JavaScript and fetches
no web fonts.

```sh
npm ci
npm run build
npm run check:links
npm run dev
```

Factor documents live in `src/content/factors/`. Each includes a one-sentence
commandment and a boundary against common over-reading, followed by concrete practices,
failure modes, a litmus test, and source lineage.

`npm run generate:catalog` derives `public/catalog/v1/factors.json` and
`public/assessment/v1/template.json` from those same 22 documents. CI fails when
the committed generated artifacts drift; there is no second hand-maintained
taxonomy. The [audit guide](https://22-factor-apps.github.io/audit) connects these
artifacts to the companion
[`22-factor-apps-audit`](https://github.com/22-factor-apps/22-factor-apps-audit)
Rust CLI.

## Deployment

GitHub Pages deploys an immutable version tag through
`.github/workflows/deploy.yml`. The workflow installs from `package-lock.json`, builds
the static site, and uploads the Pages artifact.

```sh
git tag -a v0.5.0 -m "Formal and safe-language edition"
git push origin v0.5.0
```

The workflow can also be dispatched manually for recovery. Third-party actions are
pinned to exact commits; update the commit and version comment together.

## License and credit

[MIT](LICENSE) © 2026 The 22-Factor Apps Authors.

This project is inspired by and links to the
[original twelve-factor methodology](https://12factor.net/) created by Adam Wiggins
and contributors at Heroku. It is not affiliated with Heroku or Salesforce.
