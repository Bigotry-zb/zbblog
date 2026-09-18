import { getPublishedPosts } from '../utils/posts';

function stripMarkdown(markdown) {
  return (markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = await getPublishedPosts();

  const data = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    categories: post.data.categories,
    url: `/blog/${post.id}/`,
    content: stripMarkdown(post.body).slice(0, 2000),
  }));

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
