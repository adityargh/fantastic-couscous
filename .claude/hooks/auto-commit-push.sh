#!/usr/bin/env bash
#
# Stop hook — auto commit & push ke `main`.
#
# Dipasang lewat .claude/settings.json, sehingga aktif otomatis di SETIAP sesi
# baru pada repositori ini tanpa perlu diminta ulang.
#
# Alur: commit sisa perubahan yang belum ter-commit -> push HEAD ke `main`
#       -> sinkronkan juga branch kerja saat ini.
#
# Prinsip yang dipegang:
#   - Tidak pernah force-push. Konflik dilaporkan, bukan ditimpa.
#   - Tidak pernah auto-commit berkas yang berbau kredensial.
#   - Diam saat tidak ada yang perlu dikerjakan (tanpa commit kosong/noise).

set -uo pipefail

TARGET_BRANCH="main"
REPO_GUARD="fantastic-couscous"

input=$(cat)

# --- Guard 1: cegah rekursi (hook memicu dirinya sendiri) -------------------
if [[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false' 2>/dev/null)" == "true" ]]; then
  exit 0
fi

# --- Guard 2: harus berada di dalam git repo --------------------------------
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

# --- Guard 3: hanya berlaku untuk repositori proyek ini ---------------------
remote_url=$(git remote get-url origin 2>/dev/null) || exit 0
[[ "$remote_url" == *"$REPO_GUARD"* ]] || exit 0

# --- Guard 4: jangan pernah auto-commit berkas berbau kredensial ------------
# Deteksi berbasis NAMA berkas saja. Pemindaian isi sengaja tidak dilakukan:
# dokumentasi repo ini memuat kata "secret" dan "access_key" sebagai materi
# teknis, sehingga pemindaian isi akan memblokir hampir setiap commit.
changed=$(git status --porcelain -uall | sed -e 's/^...//' -e 's/.* -> //')
risky=$(printf '%s\n' "$changed" | grep -Ei \
  '(^|/)(\.env(\.[^/]*)?|id_(rsa|dsa|ecdsa|ed25519)|[^/]*\.(pem|key|p12|pfx|keystore|jks)|[^/]*credentials[^/]*\.json|[^/]*service-account[^/]*\.json)$' || true)
if [[ -n "$risky" ]]; then
  {
    echo "Auto-commit DIBATALKAN: ada berkas yang berpotensi memuat kredensial."
    printf '  - %s\n' $risky
    echo "Tambahkan ke .gitignore atau hapus berkas tersebut, lalu commit manual."
  } >&2
  exit 2
fi

# --- Commit sisa perubahan --------------------------------------------------
if [[ -n "$changed" ]]; then
  if ! git add -A; then
    echo "Auto-commit gagal pada tahap 'git add'." >&2
    exit 2
  fi

  count=$(git diff --cached --name-only | grep -c . || true)
  head3=$(git diff --cached --name-only | head -3 | paste -sd', ' -)
  [[ "$count" -gt 3 ]] && head3="${head3} (+$((count - 3)) lainnya)"

  if ! git commit -q \
       -m "chore(auto): sync ${count} berkas — ${head3}" \
       -m "$(git diff --cached --name-status)" \
       -m "Commit otomatis oleh .claude/hooks/auto-commit-push.sh"; then
    echo "Auto-commit gagal. Periksa identitas git / konfigurasi signing, lalu commit manual." >&2
    exit 2
  fi
fi

# --- Berhenti diam-diam bila memang tidak ada yang perlu didorong -----------
git fetch -q origin "$TARGET_BRANCH" 2>/dev/null
if [[ -z "$changed" ]] &&
   [[ "$(git rev-parse HEAD)" == "$(git rev-parse "origin/${TARGET_BRANCH}" 2>/dev/null || echo none)" ]]; then
  exit 0
fi

# --- Push ke main -----------------------------------------------------------
if ! out=$(git push origin "HEAD:${TARGET_BRANCH}" 2>&1); then
  {
    echo "Push ke '${TARGET_BRANCH}' GAGAL:"
    printf '%s\n' "$out"
    echo
    echo "Bila penyebabnya non-fast-forward, integrasikan dulu:"
    echo "  git fetch origin ${TARGET_BRANCH} && git merge origin/${TARGET_BRANCH}"
    echo "selesaikan konflik, lalu push ulang. JANGAN force-push."
  } >&2
  exit 2
fi
pushed="$TARGET_BRANCH"

# Sinkronkan branch kerja juga, agar pemeriksa 'unpushed commit' tidak konflik.
current=$(git branch --show-current)
if [[ -n "$current" && "$current" != "$TARGET_BRANCH" ]]; then
  git push -q -u origin "HEAD:refs/heads/${current}" 2>/dev/null && pushed="${pushed} + ${current}"
fi

jq -nc --arg m "Auto-push $(git rev-parse --short HEAD) -> ${pushed}" \
  '{systemMessage: $m, suppressOutput: true}'
exit 0
