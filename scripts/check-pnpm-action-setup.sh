#!/bin/sh

set -eu

REPO="pnpm/action-setup"
CURRENT_MAJOR_PREFIX='v4.'
MIN_AGE_DAYS=7

if [ -z "${GITHUB_TOKEN:-}" ] && [ -n "${GH_TOKEN:-}" ]; then
  export GITHUB_TOKEN="$GH_TOKEN"
fi

release_json=$(
  gh release list --repo "$REPO" --limit 20 --json tagName,publishedAt --jq \
    "map(select(.tagName | startswith(\"$CURRENT_MAJOR_PREFIX\"))) | .[0]"
)
if [ "$release_json" = "null" ] || [ -z "$release_json" ]; then
  exit 0
fi

version=$(printf '%s\n' "$release_json" | jq -r '.tagName')
published_at=$(printf '%s\n' "$release_json" | jq -r '.publishedAt')
tag_sha=$(gh api "repos/$REPO/git/ref/tags/$version" --jq '.object.sha')
published_epoch=$(date -j -f '%Y-%m-%dT%H:%M:%SZ' "$published_at" '+%s')
now_epoch=$(date '+%s')
age_seconds=$((now_epoch - published_epoch))
min_age_seconds=$((MIN_AGE_DAYS * 24 * 60 * 60))

printf '\n[notice] pnpm/action-setup is managed manually.\n'
if [ "$age_seconds" -ge "$min_age_seconds" ]; then
  printf '[notice] @%s is older than %s days. Update the pinned SHA by hand if needed.\n' "$version" "$MIN_AGE_DAYS"
else
  printf '[notice] @%s is newer than %s days. Keep the current pinned SHA for now.\n' "$version" "$MIN_AGE_DAYS"
fi
printf '[notice] Latest v4 release date: %s\n' "$published_at"
printf '[notice] Latest v4 release SHA: %s\n' "$tag_sha"
