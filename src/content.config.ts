import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 블로그 글: src/content/writing/*.md
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['essay', 'note', 'news']),
    lang: z.enum(['en', 'ko']),
    summary: z.string().nullish(),
    slug: z.string().optional(),
    // 번역 쌍: 한국어판과 영어판이 같은 pair 값을 가지면 한 글로 묶입니다 (올리기 스크립트가 자동으로 넣습니다)
    pair: z.string().optional(),
    // 사이트에 보이는 태그는 topics 속성에서 읽습니다 (영어, 띄어쓰기 가능).
    // Obsidian의 tags 속성은 볼트 안 정리용이라 사이트에서 읽지 않습니다.
    topics: z.array(z.string()).nullish().transform((v) => (v ?? []).map((t) => t.trim()).filter(Boolean)),
    draft: z.boolean().default(false),
  }),
});

// 고정 페이지: src/content/pages/<en|ko>/<research|teaching|about>.md
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    tag: z.string().optional(),
    summary: z.string().optional(),
  }),
});

export const collections = { writing, pages };
