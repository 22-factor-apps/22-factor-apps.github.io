# The Twenty-Two-Factor App

Source for **[22-factor-apps.github.io](https://22-factor-apps.github.io)** — a
modern, open-source methodology for building software-as-a-service apps.

Factors I–XII are a modernized restatement of the
[twelve-factor methodology](https://12factor.net) (credit: Adam Wiggins and
contributors at Heroku). Factors XIII–XXII are new:

| # | Factor | In one line |
|---|--------|-------------|
| XIII | Encrypted Config in the Codebase | commit config encrypted in `env/enc/`, decrypt to `env/dec/*.env` (gitignored) |
| XIV | Root Secrets Outside the Repo | 1–2 root secrets (e.g. the decryption key) live in an external service like fiducia-cloud |
| XV | OCI, Not Docker | build/run/distribute against the OCI specs, not one vendor's toolchain |
| XVI | Virtual Containers & Virtual OSes | consider microVMs (Firecracker/Kata), gVisor, unikernels |
| XVII | Immutable Infrastructure | bake AMIs/machine images; replace, never mutate |
| XVIII | Own Your Long-Lived Connections | TCP/WebSocket discipline: drain, externalize session state, design for reconnect |
| XIX | Deploy Tags, Not Branches | production runs annotated git tags, never branch tips |
| XX | Humans in the Loop | explicit, recorded approval gates where blast radius lives |
| XXI | Review Like You Mean It | small diffs, fast turnaround, machines before humans |
| XXII | A Deliberate Merge Policy | choose merge vs rebase on purpose; never rewrite shared history |

## Tech

Built with [Astro](https://astro.build). Plain content collections, no client-side
JavaScript, one stylesheet.

```sh
npm install     # Astro toolchain (npm registry)
npm run dev     # local dev server
npm run build   # static build into dist/
```

### Dependency management

- **npm** manages the Astro toolchain — Astro is distributed exclusively through the
  npm registry, so `package.json` declares it (Factor II: declare everything).
- **[zed-pkg](https://zpkg.net)** manages VCS-hosted dependencies: `.zpkg.toml` is the
  manifest, `.zpkg.lock` pins tag + commit. Add forge-hosted deps with
  `zed add <org>/<name>@^1` and install with `zed install --frozen`
  (`brew install zed-pkg`).

## Deploying (we dogfood Factor XIX)

Merging to `main` deploys **nothing**. The site deploys when a version tag is pushed:

```sh
git tag -a v0.2.0 -m "describe the release"
git push origin v0.2.0
```

`.github/workflows/deploy.yml` builds the tag and publishes to GitHub Pages.

### First-time bootstrap

```sh
export GH_TOKEN=ghp_...            # PAT with repo+workflow scope on the org
./scripts/create-and-push.sh       # verifies build, creates repo, pushes main + v0.1.0, enables Pages
```

## Repo layout notes

- `env/enc/` — the reference implementation of Factor XIII lives right here:
  encrypted env files are committed; `env/dec/` is gitignored and holds decrypted
  output at deploy time only. See `env/enc/README.md`.
- `src/content/factors/*.md` — one markdown file per factor; the site builds itself
  from these.

## License

[MIT](LICENSE) © 2026 The 22-Factor Apps Authors. Inspired by, and linking back to,
[12factor.net](https://12factor.net); not affiliated with Heroku or Salesforce.
