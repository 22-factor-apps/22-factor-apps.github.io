#!/usr/bin/env bash
# One-shot bootstrap: verify the build, create the GitHub repo under the
# 22-factor-apps org, push main + the first release tag, and enable Pages.
#
# Usage:
#   export GH_TOKEN=ghp_...     # a PAT with repo + workflow scope on 22-factor-apps
#   ./scripts/create-and-push.sh
#
# The token is read from the environment only — never hardcode it in this file
# or anywhere else in the repo (see Factors XIII/XIV for where secrets live).

set -euo pipefail

ORG="22-factor-apps"
REPO="22-factor-apps.github.io"
API="https://api.github.com"

if [ -z "${GH_TOKEN:-}" ]; then
  echo "error: set GH_TOKEN to a GitHub PAT with access to the $ORG org" >&2
  exit 1
fi

auth=(-H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github+json")

cd "$(dirname "$0")/.."

echo "==> Verifying the site builds before anything touches GitHub"
npm install
npm run build
echo "==> Build OK"

if [ -f package-lock.json ] && ! git ls-files --error-unmatch package-lock.json >/dev/null 2>&1; then
  echo "==> Committing package-lock.json so CI builds are pinned"
  git add package-lock.json
  git commit -m "chore: commit lockfile from first verified install"
fi

echo "==> Creating $ORG/$REPO (skips if it already exists)"
status=$(curl -s -o /tmp/create-repo.json -w "%{http_code}" "${auth[@]}" \
  -X POST "$API/orgs/$ORG/repos" \
  -d "{\"name\":\"$REPO\",\"description\":\"The Twenty-Two-Factor App — methodology site\",\"homepage\":\"https://$REPO\",\"has_wiki\":false}")
case "$status" in
  201) echo "    created" ;;
  422) echo "    already exists, continuing" ;;
  *)   echo "error: repo creation failed (HTTP $status):"; cat /tmp/create-repo.json; exit 1 ;;
esac

echo "==> Pushing main and release tag"
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$ORG/$REPO.git"
git push -u origin main

if ! git rev-parse v1.0.0 >/dev/null 2>&1; then
  git tag -a v1.0.0 -m "initial public release of the 22-factor methodology site"
fi
git push origin v1.0.0

echo "==> Enabling GitHub Pages (build via Actions)"
status=$(curl -s -o /tmp/pages.json -w "%{http_code}" "${auth[@]}" \
  -X POST "$API/repos/$ORG/$REPO/pages" \
  -d '{"build_type":"workflow"}')
case "$status" in
  201) echo "    Pages enabled" ;;
  409) echo "    Pages already enabled" ;;
  *)   echo "warning: could not enable Pages automatically (HTTP $status) —"
       echo "         enable it once in repo Settings → Pages → Source: GitHub Actions" ;;
esac

echo
echo "Done. The v1.0.0 tag push triggers the deploy workflow (Factor XIX)."
echo "Watch it at: https://github.com/$ORG/$REPO/actions"
echo "Site will be live at: https://$REPO"
