---
title: 从零部署到阿里云 ECS
description: 记录买服务器、域名、备案、Nginx 托管静态博客的完整流程。
pubDate: 2026-09-17
tags: ['运维', 'Nginx', '阿里云']
---

这篇笔记记录把一个静态博客部署到阿里云 ECS 的完整流程。

## 一、购买与备案

1. 购买 ECS（地域选国内，如杭州），系统用 Ubuntu 22.04
2. 在万网注册域名，完成实名认证
3. 提交 **ICP 备案**：需要域名、服务器（阿里云会提供一个备案服务码）
4. 备案通过后，再做 **公安联网备案**
5. 页脚展示备案号（本站配置在 `src/consts.ts` 的 `icp` 字段）

> 备案期间网站不能对外提供访问，80/443 会被拦截。可以用临时端口先测试。

## 二、服务器初始化

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx
sudo systemctl enable nginx
```

安全组放行 `22 / 80 / 443`。

## 三、上传静态文件

本地构建：

```bash
npm run build
```

把 `dist/` 传到服务器 `/var/www/zbblog/`：

```bash
scp -r dist/* root@your-server-ip:/var/www/zbblog/
```

## 四、配置 Nginx

见项目 `deploy/nginx.conf`，核心是静态托管 + gzip + 缓存：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/zbblog;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

## 五、HTTPS

用 certbot 申请免费证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

certbot 会自动改 Nginx 配置并设置自动续期。
