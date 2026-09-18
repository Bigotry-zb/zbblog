import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => {
    // 生产构建排除草稿，本地 dev 可以看到草稿以便预览
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return posts.sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return b.data.pubDate.getTime() - a.data.pubDate.getTime();
  });
}

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getAllCategories(posts: CollectionEntry<'blog'>[]) {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const category of post.data.categories) {
      map.set(category, (map.get(category) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function groupByYear(posts: CollectionEntry<'blog'>[]) {
  const map = new Map<number, CollectionEntry<'blog'>[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(post);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}
