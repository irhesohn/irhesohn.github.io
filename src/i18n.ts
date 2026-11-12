export type Lang = 'en' | 'ko';
export const langs: Lang[] = ['en', 'ko'];
export const other = (l: Lang): Lang => (l === 'en' ? 'ko' : 'en');

const base = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';

/** 언어와 경로로 내부 링크 주소를 만듭니다. 영어는 /, 한국어는 /ko/ 아래. */
export const href = (lang: Lang, path = '') =>
  base + (lang === 'ko' ? 'ko/' : '') + (path ? path.replace(/^\/|\/$/g, '') + '/' : '');
/** 글은 언어와 상관없이 /writing/<파일이름>/ 주소를 씁니다. */
/** 글 주소: /writing/YYYY-MM-DD-이름/ (날짜는 글의 date 에서 자동으로 붙습니다) */
type PostRef = { id: string; data: { date: Date; lang: Lang; pair?: string } };
export const plainId = (id: string) => id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
/** 글의 이름. 번역 쌍(한국어판·영어판)은 같은 이름을 가집니다. */
export const postKey = (p: PostRef) => p.data.pair ?? plainId(p.id).replace(/--(en|ko)$/, '');
export const postSlug = (p: PostRef) => p.data.date.toISOString().slice(0, 10) + '-' + postKey(p);
/** 영어 글은 /writing/…, 한국어 글은 /ko/writing/… */
export const postHref = (p: PostRef) =>
  base + (p.data.lang === 'ko' ? 'ko/' : '') + 'writing/' + postSlug(p) + '/';
export const asset = (path: string) => base + path.replace(/^\//, '');

/** [...lang] 경로용: 영어(접두어 없음)와 한국어(/ko) 두 벌을 만듭니다. */
export const langPaths = () => [
  { params: { lang: undefined }, props: { lang: 'en' as Lang } },
  { params: { lang: 'ko' }, props: { lang: 'ko' as Lang } },
];

export const ui = {
  en: {
    research: 'Research', teaching: 'Teaching', writing: 'Writing', about: 'About & CV',
    work: 'Work', latest: 'Latest writing', all: 'All writing →', cvLink: 'Curriculum vitae (PDF) →',
    site: 'Site', contact: 'Contact', email: 'Email', cv: 'Curriculum vitae (PDF)',
    writingTitle: 'Writing', writingSummary: 'Research notes, essays, and reviews of films and books.',
    empty: 'New writing will appear here soon.',
    tags: 'Tags',
    contents: 'Contents',
    prev: '← Previous', next: 'Next →', language: 'Language', langName: 'English',
    cat: { essay: 'Essay', note: 'Research note', news: 'News' },
  },
  ko: {
    research: '연구', teaching: '강의', writing: '글', about: '소개 · CV',
    work: '작업', latest: '최근 글', all: '모든 글 →', cvLink: 'CV 내려받기 (PDF) →',
    site: '사이트', contact: '연락', email: '이메일', cv: 'CV 내려받기 (PDF)',
    writingTitle: '글', writingSummary: '연구 노트와 에세이, 영화와 책에 대한 리뷰.',
    empty: '새 글이 곧 올라옵니다.',
    tags: '태그',
    contents: '목차',
    prev: '← 이전 글', next: '다음 글 →', language: '언어', langName: '한국어',
    cat: { essay: '에세이', note: '연구 노트', news: '소식' },
  },
} as const;

export function fmtDate(d: Date, lang: Lang, long = false) {
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
  if (lang === 'ko') return long ? `${y}. ${m}. ${day}` : `${y}. ${m}`;
  return d.toLocaleDateString('en-US', long
    ? { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
    : { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
