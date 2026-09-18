---
title: 你好，世界
description: 这是本站的第一篇文章，介绍博客的技术选型与写作方式。
pubDate: 2026-09-18
categories: ['随笔']
tags: ['Astro']
pinned: true
---

欢迎来到我的博客。

## 技术选型

本站使用 [Astro](https://astro.build/) 构建，输出纯静态 HTML/CSS/JS：

- **文章**：Markdown 文件，存放在 Git 仓库中
- **构建**：本地或 CI 执行 `npm run build`，产物在 `dist/`
- **部署**：`dist/` 上传到阿里云 ECS，由 Nginx 托管

## 为什么用静态博客

1. 没有数据库，不用担心 SQL 注入、数据丢失
2. 页面是预渲染的 HTML，打开速度快，SEO 友好
3. 文章就是纯文本文件，随时可以迁移到任何平台
4. 服务器成本低，1 核 2G 的 ECS 足够

## 如何写一篇新文章

在 `src/content/blog/` 下新建 `.md` 文件，顶部写好 frontmatter：

```md
---
title: 文章标题
description: 摘要，用于列表和 SEO
pubDate: 2026-09-18
tags: ['标签1', '标签2']
---

正文内容……
```

然后运行 `npm run dev` 本地预览，或 `npm run build` 构建。
