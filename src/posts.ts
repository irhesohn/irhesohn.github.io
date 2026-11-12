import { getCollection, type CollectionEntry } from 'astro:content';
import { postKey, type Lang } from './i18n';

type Post = CollectionEntry<'writing'>;

/** 공개된 글을 최신순으로 돌려줍니다. (draft: true 인 글은 제외) */
export async function allPosts() {
  const posts = await getCollection('writing', (e) => !e.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** 같은 글의 다른 언어판 (없으면 undefined) */
export const translationOf = (post: Post, posts: Post[]) =>
  posts.find((p) => p.data.lang !== post.data.lang && postKey(p) === postKey(post));

/** 글 목록용: 번역 쌍은 보는 언어의 판 하나만, 한 언어로만 쓴 글은 그대로 보여 줍니다. */
export function postsFor(lang: Lang, posts: Post[]) {
  const groups = new Map<string, Post[]>();
  for (const p of posts) groups.set(postKey(p), [...(groups.get(postKey(p)) ?? []), p]);
  return [...groups.values()]
    .map((g) => g.find((p) => p.data.lang === lang) ?? g[0])
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
