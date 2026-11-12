"""Obsidian 블로그 폴더의 글을 사이트로 복사하고 Obsidian 문법을 바꿉니다.

사용: python3 sync_blog.py <블로그 폴더> <볼트 폴더> <사이트 폴더>
- 블로그 폴더 바로 아래의 .md 파일만 다룹니다 (`_`로 시작하는 파일과 CLAUDE.md 제외).
- 번역 쌍: `이름.ko.md` 와 `이름.en.md` 는 같은 글의 한국어판·영어판으로 묶입니다.
- 사이트 태그는 topics 속성입니다. Obsidian의 tags 속성은 복사할 때 빼서 공개되지 않게 합니다.
- draft: true 인 글은 복사하지 않습니다. GitHub 저장소가 공개라서 초고가 밖에 보이지 않게 하기 위해서입니다.
- 300KB가 넘는 사진은 긴 변 1600px로 줄이고, JPEG는 품질 70으로 다시 저장해서 올립니다 (볼트의 원본은 그대로).
- 유튜브 끼워 넣기: 한 줄에 `![설명](https://www.youtube.com/watch?v=ID&t=754)` 처럼 쓰면
  사이트에서는 그 시점부터 재생되는 영상으로 바뀝니다 (Obsidian에서도 영상으로 보입니다).
  t= 는 초(754), 754s, 12m34s, 1h2m3s 모두 됩니다.
- src/content/writing 과 public/writing-media 는 이 스크립트가 통째로 관리합니다.
"""
import os, re, shutil, subprocess, sys, unicodedata
from urllib.parse import quote

src, vault, site = (os.path.abspath(a) for a in sys.argv[1:4])
dest = os.path.join(site, 'src', 'content', 'writing')
media = os.path.join(site, 'public', 'writing-media')
SKIP_DIRS = {'.obsidian', '.trash', '.git', 'node_modules', '.archive'}

_index = None
def find_in_vault(name):
    global _index
    if _index is None:
        _index = {}
        for root, dirs, files in os.walk(vault):
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith('.')]
            for f in files:
                _index.setdefault(f, os.path.join(root, f))
    base = os.path.basename(name)
    for root, dirs, files in os.walk(src):
        if base in files: return os.path.join(root, base)
    return _index.get(base)

posts = sorted(f for f in os.listdir(src)
               if f.endswith('.md') and not f.startswith(('_', '.')) and f != 'CLAUDE.md')
if not posts:
    print('60.Blog 폴더에 글이 없습니다.'); sys.exit(0)

os.makedirs(dest, exist_ok=True)
shutil.rmtree(media, ignore_errors=True)
problems, public, drafts, kept = [], 0, 0, []

for fname in posts:
    stem = unicodedata.normalize('NFC', fname[:-3])  # macOS 파일 이름(NFD)을 웹 주소용(NFC)으로
    suffix = re.search(r'\.(ko|en)$', stem)  # 번역 쌍: 이름.ko.md / 이름.en.md
    pair = stem[:suffix.start()] if suffix else None
    out_name = f'{pair}--{suffix.group(1)}.md' if suffix else fname
    if suffix: stem = f'{pair}--{suffix.group(1)}'
    text = open(os.path.join(src, fname), encoding='utf-8').read()
    if not text.startswith('---'):
        problems.append(f'{fname}: 맨 위 속성(---)이 없습니다.'); continue
    end = text.index('\n---', 3) + 4
    front, body = text[:end], text[end:]
    if re.search(r'^draft:\s*true', front, re.M):
        drafts += 1; continue
    public += 1; kept.append(out_name)
    if suffix:
        # 쌍을 묶는 이름을 속성에 넣고, 언어 표시가 파일 이름과 맞는지 확인합니다
        m = re.search(r'^slug:\s*(.+)$', front, re.M)
        if m:
            pair = m.group(1).strip().strip('"\'')
            front = re.sub(r'^slug:.*\n', '', front, flags=re.M)
        front = re.sub(r'^pair:.*\n', '', front, flags=re.M)
        front = front[:-4] + f'\npair: {pair}\n---' if front.endswith('\n---') else front
        lm = re.search(r'^lang:\s*(\w+)', front, re.M)
        if not lm or lm.group(1) != suffix.group(1):
            problems.append(f'{fname}: 파일 이름은 .{suffix.group(1)} 인데 lang 속성이 다릅니다. lang: {suffix.group(1)} 로 고쳐 주세요.')

    # Obsidian의 tags 속성은 볼트 안 정리용이라 공개 저장소로 보내지 않습니다 (사이트 태그는 topics)
    front = re.sub(r'^tags:[^\n]*\n(?:[ \t]+-[^\n]*\n)*', '', front, flags=re.M)
    body = re.sub(r'%%.*?%%', '', body, flags=re.S)

    def embed(m):
        target, _, alt = m.group(1).partition('|')
        target = target.split('#')[0].strip()
        path = find_in_vault(target)
        if not path or not os.path.isfile(path):
            problems.append(f'{fname}: 이미지 "{target}"를 볼트에서 찾지 못했습니다.'); return ''
        if not re.search(r'\.(png|jpe?g|gif|webp|svg|avif)$', path, re.I):
            problems.append(f'{fname}: "{target}"는 이미지가 아니라서 뺐습니다.'); return ''
        img = unicodedata.normalize('NFC', os.path.basename(path))
        out = os.path.join(media, stem); os.makedirs(out, exist_ok=True)
        shutil.copy2(path, os.path.join(out, img))
        target = os.path.join(out, img)
        if os.path.getsize(path) > 300_000 and re.search(r'\.(png|jpe?g)$', img, re.I):
            cmd = ['sips', '-Z', '1600']
            if re.search(r'\.jpe?g$', img, re.I):
                cmd += ['-s', 'formatOptions', '70']
            subprocess.run(cmd + [target], capture_output=True)
        alt = alt if alt and not alt.isdigit() else ''
        return f'![{alt}](/writing-media/{quote(stem)}/{quote(img)})'
    body = re.sub(r'!\[\[([^\]]+)\]\]', embed, body)

    def youtube(m):
        alt, url = m.group(1), m.group(2)
        vid = re.search(r'(?:v=|youtu\.be/|/embed/)([\w-]{11})', url)
        if not vid: return m.group(0)
        t = re.search(r'[?&](?:t|start)=([\dhms]+)', url)
        sec = 0
        if t:
            v = t.group(1)
            if v.isdigit(): sec = int(v)
            else:
                for n, u in re.findall(r'(\d+)([hms])', v): sec += int(n) * {'h': 3600, 'm': 60, 's': 1}[u]
        src = f'https://www.youtube-nocookie.com/embed/{vid.group(1)}' + (f'?start={sec}' if sec else '')
        watch = f'https://www.youtube.com/watch?v={vid.group(1)}' + (f'&t={sec}s' if sec else '')
        stamp = f'{sec // 3600}:{sec % 3600 // 60:02d}:{sec % 60:02d}' if sec >= 3600 else f'{sec // 60}:{sec % 60:02d}'
        title = alt or 'YouTube'
        cap = (alt + ' · ' if alt else '') + (stamp + '부터 · ' if sec else '') + f'<a href="{watch}">YouTube에서 보기</a>'
        return (f'<figure class="video"><div class="frame"><iframe src="{src}" title="{title}" loading="lazy" '
                f'allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'
                f'<figcaption>{cap}</figcaption></figure>')
    body = re.sub(r'^!\[([^\]]*)\]\((https?://(?:www\.)?(?:youtube\.com|youtu\.be)/[^)\s]+)\)\s*$', youtube, body, flags=re.M)

    def link(m):
        target, _, label = m.group(1).partition('|')
        return label or target.split('#')[0]
    body = re.sub(r'\[\[([^\]]+)\]\]', link, body)

    open(os.path.join(dest, out_name), 'w', encoding='utf-8').write(front + body)

for f in os.listdir(dest):
    if f.endswith('.md') and f not in kept:
        os.remove(os.path.join(dest, f))

print(f'글 {len(posts)}편을 확인했습니다 (공개 {public}편, 비공개 {drafts}편).')
for p in problems: print('주의:', p)
