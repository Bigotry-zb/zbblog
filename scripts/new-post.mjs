#!/usr/bin/env node
// 用法：npm run new -- "文章标题"
// 在 src/content/blog 下生成带 frontmatter 的 Markdown 文件。
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogDir = resolve(__dirname, '../src/content/blog');

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('用法: npm run new -- "文章标题"');
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const slug =
  title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || `post-${now.getTime()}`;

const file = join(blogDir, `${date}-${slug}.md`);

const content = `---
title: ${title}
description: ''
pubDate: ${date}
tags: []
draft: true
---

在这里开始写正文。
`;

try {
  await access(file);
  console.error(`文件已存在: ${file}`);
  process.exit(1);
} catch {
  // 文件不存在，继续创建
}

await mkdir(blogDir, { recursive: true });
await writeFile(file, content, 'utf8');
console.log(`已创建: ${file}`);
