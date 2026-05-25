#!/usr/bin/env bash
# Weekly regenerate + push awesome-stackpicks/README.md.
#
# Run manually (recommended weekly):
#   bash scripts/sync-awesome-repo.sh
#
# Or wire to cron-job.org / a GitHub Action later. Sindre's master Awesome list
# wants ~30 days of regular commits before accepting your PR — running this
# weekly is enough to satisfy that.
#
# Setup (one-time):
#   1. Have a local clone of awesome-stackpicks somewhere — defaults to ~/awesome-stackpicks
#   2. If different path, export AWESOME_REPO_DIR=/your/path before running
#   3. Make sure `gh` CLI or git push works for that repo

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
AWESOME_REPO_DIR="${AWESOME_REPO_DIR:-$HOME/awesome-stackpicks}"

echo "═══════════════════════════════════════════════════════════════════"
echo " awesome-stackpicks sync"
echo "═══════════════════════════════════════════════════════════════════"
echo " Source seed:   $REPO_ROOT/scripts/seed-data.ts"
echo " Target repo:   $AWESOME_REPO_DIR"
echo

# 1. Clone the awesome repo on first run
if [ ! -d "$AWESOME_REPO_DIR/.git" ]; then
  echo "→ awesome-stackpicks not cloned yet. Cloning..."
  git clone https://github.com/jangirpiyush008-hash/awesome-stackpicks.git "$AWESOME_REPO_DIR"
else
  echo "→ Pulling latest from awesome-stackpicks origin..."
  ( cd "$AWESOME_REPO_DIR" && git pull --quiet )
fi

# 2. Regenerate the README from current seed-data
echo "→ Regenerating README.md from seed-data..."
cd "$REPO_ROOT/scripts"
./node_modules/.bin/tsx gen-awesome-readme.ts > "$AWESOME_REPO_DIR/README.md"
WORD_COUNT=$(wc -w < "$AWESOME_REPO_DIR/README.md")
ENTRY_COUNT=$(grep -c '^- \*\*\[' "$AWESOME_REPO_DIR/README.md" || echo 0)
echo "  README is $WORD_COUNT words / $ENTRY_COUNT entries"

# 3. Commit + push if anything changed
cd "$AWESOME_REPO_DIR"
if [ -n "$(git status --porcelain README.md)" ]; then
  STAMP=$(date -u +"%Y-%m-%d")
  git add README.md
  git -c user.email="stackpicks.dev@gmail.com" \
      -c user.name="Piyush Jangir" \
      commit --quiet -m "chore: weekly regen ($STAMP) — $ENTRY_COUNT curated picks"
  git push --quiet origin main
  echo "✓ Pushed update to awesome-stackpicks"
else
  echo "= README unchanged, nothing to push"
fi

echo
echo "Done. View: https://github.com/jangirpiyush008-hash/awesome-stackpicks"
