import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 文章集合：src/content/blog 下的所有 .md / .mdx 文件
// 文章内容只以 Markdown 文件形式存在于 Git 仓库中，不依赖数据库。
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // 草稿：draft=true 时生产构建不会输出，本地 dev 仍可见
    draft: z.boolean().default(false),
    // 置顶
    pinned: z.boolean().default(false),
    cover: z.string().optional(),
    author: z.string().default('ZB'),
  }),
});

export const collections = { blog };
