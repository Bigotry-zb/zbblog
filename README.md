# zbblog

个人静态博客。文章用 Markdown 编写、存放在 Git 仓库，构建成纯静态文件后由 Nginx 托管，适合部署到阿里云 ECS 并完成 ICP 备案。

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 站点生成 | [Astro](https://astro.build/) 5 | 输出纯静态 HTML，无运行时 |
| 内容 | Markdown + frontmatter | 文件即文章，Git 管理 |
| 样式 | 原生 CSS（含深色模式） | 无框架依赖 |
| 托管 | Nginx | 静态文件 + gzip + HTTPS |
| 服务器 | 阿里云 ECS | 备案主体 |

> 你熟悉 Java/Spring，但静态博客不需要后端。Spring 更适合动态站（评论、后台 API），可以后续单独加，不放进本仓库。

## 快速开始

```bash
npm install
npm run dev        # 本地预览 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 预览构建结果
```

新建文章：

```bash
npm run new -- "我的第一篇文章"
```

## 目录结构

```
zbblog/
├─ src/
│  ├─ content/
│  │  └─ blog/            # ★ 所有文章（Markdown），唯一真实来源
│  ├─ pages/              # 路由：首页/列表/详情/标签/关于/RSS
│  ├─ layouts/            # 页面骨架
│  ├─ components/         # 头部/页脚/文章卡片
│  ├─ styles/global.css   # 全局样式
│  ├─ consts.ts           # 站点名、导航、备案号
│  └─ content.config.ts   # 文章 frontmatter 校验规则
├─ public/                # 原样拷贝到 dist 的静态资源
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ images/             # 文章配图（小图放这里）
├─ scripts/new-post.mjs   # 新建文章脚本
├─ deploy/                # Nginx 配置 + 部署脚本
└─ astro.config.mjs       # site 域名、sitemap
```

## 文章存放位置（重点）

核心原则：**Markdown 文件是唯一真实来源，数据库和服务器都不是。**

```
写作设备                        服务器(阿里云 ECS)
┌──────────────┐               ┌──────────────┐
│ 本地编辑器    │  git push     │              │
│ src/content/ │ ───────────▶  │  只有 dist/  │
│  blog/*.md   │               │  (静态 HTML) │
└──────────────┘               └──────────────┘
       │
       ▼
  Git 远程仓库（Gitee / GitHub / 自建 Gitea）
  ← 真正的文章备份与版本历史
```

### 1. 文章正文 → Git 仓库里的 Markdown

- 路径：`src/content/blog/`
- 每个 `.md` 文件就是一篇，frontmatter 记录标题、日期、标签、草稿状态
- 好处：可 diff、可回滚、可搜索、换电脑 clone 即可继续写

### 2. 草稿 → `draft: true` 或独立分支

- 单篇草稿：frontmatter 写 `draft: true`，生产构建自动排除，本地 `npm run dev` 仍可见
- 整批未完成：放 `drafts/` 分支，合并到 `main` 才算发布
- 建议仓库设为**私有**，避免草稿被搜索引擎抓到

### 3. 图片 → 分两种

| 场景 | 存放位置 |
| --- | --- |
| 少量小图、图标 | `public/images/`，随仓库一起走 |
| 大量配图、大图、相册 | 阿里云 **OSS**，Markdown 里写 OSS 的 URL |

OSS 方案能省服务器带宽和磁盘，也便于以后加 CDN。开 OSS 后建议绑定自定义域名 + 开防盗链。

### 4. 服务器上存什么

- **只存 `dist/` 构建产物**（`/var/www/zbblog`），不存源码、不存 Git
- 服务器故障也不影响文章，因为文章在 Git 里
- 好处：ECS 可以随时重装/换机，重新上传 dist 即可

### 5. 构建在哪里跑

| 方式 | 适合 | 做法 |
| --- | --- | --- |
| 本地构建 + 上传 | 个人博客，最简单（推荐起步） | `npm run build` 后 `deploy/deploy.ps1` |
| 服务器构建 | 想在服务器上写 | 服务器 clone 仓库，装 Node，`npm run build` |
| CI 自动构建 | 多设备写作 | Gitee/GitHub Actions，push 后自动构建并 rsync 到 ECS |

### 6. 备份策略（三层）

1. **Git 远程仓库**：文章的主体备份，天然带历史版本
2. **定期打包**：把 `src/content/` 打成 zip 存到 OSS/网盘，防止误删仓库
3. **服务器 dist**：只是产物，不必备份，随时可重建

## 部署到阿里云 ECS

### 1. 准备

- 购买 ECS（国内地域，Ubuntu 22.04），安全组放行 22/80/443
- 注册域名并实名认证
- 提交 **ICP 备案**（需备案服务码），通过后再做**公安联网备案**
- 备案号填入 `src/consts.ts` 的 `icp` 字段

### 2. 服务器装 Nginx

```bash
sudo apt update && sudo apt install -y nginx
sudo systemctl enable --now nginx
```

### 3. 改域名与备案号

- `astro.config.mjs` 的 `site` 改成 `https://你的域名`
- `public/robots.txt` 里的 sitemap 地址同步修改
- `src/consts.ts` 填 `icp`

### 4. 构建并上传

```powershell
npm run build
.\deploy\deploy.ps1 -Server root@你的公网IP -Target /var/www/zbblog
```

### 5. 配置 Nginx

把 `deploy/nginx.conf` 放到 `/etc/nginx/conf.d/zbblog.conf`，替换域名后：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 6. HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名 -d www.你的域名
```

## 写文章速查

```md
---
title: 文章标题
description: 摘要（列表页与 SEO 使用）
pubDate: 2026-09-18
tags: ['标签1', '标签2']
draft: false
pinned: false
---

正文……
```

改完 → `npm run build` → 部署，即可上线。
