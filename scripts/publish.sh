#!/bin/zsh
# Obsidian 60.Blog 폴더의 글을 사이트에 올립니다.
# Obsidian: 명령 팔레트 → "Execute: 블로그 올리기"  /  터미널: 이 파일을 실행
set -u
# 마지막 실행 기록: site/.publish.log
exec > >(tee "${0:A:h:h}/.publish.log") 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 시작"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

SITE="${0:A:h:h}"
BLOG="${BLOG_DIR:-$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/LLM Wiki/60.Blog}"
VAULT="${BLOG:h}"
cd "$SITE" || { echo "사이트 폴더를 찾지 못했습니다: $SITE"; exit 1; }

python3 scripts/sync_blog.py "$BLOG" "$VAULT" "$SITE" || { echo "글을 복사하지 못했습니다."; exit 1; }

LOG="$(mktemp)"
if ! npm run build >"$LOG" 2>&1; then
  echo "사이트를 만들다 오류가 나서 올리지 않았습니다. 글의 맨 위 속성(title, date, category, lang)을 확인해 주세요."
  grep -E -i "error|invalid|expected|required" "$LOG" | head -8
  exit 1
fi

git add src/content/writing public/writing-media 2>/dev/null
git add -A src/content/writing
if git diff --cached --quiet; then
  echo "바뀐 글이 없어 올리지 않았습니다."
  exit 0
fi
git commit -q -m "Publish writing from Obsidian" || { echo "커밋하지 못했습니다."; exit 1; }
git pull -q --rebase origin main >/dev/null 2>&1
if git push -q origin main 2>"$LOG"; then
  echo "올렸습니다. 1–2분 뒤 irhesohn.com 에 반영됩니다."
else
  echo "GitHub에 올리지 못했습니다:"; head -5 "$LOG"; exit 1
fi
