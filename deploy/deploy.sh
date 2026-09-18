#!/usr/bin/env bash
# 本地构建并部署到阿里云 ECS（Linux / macOS / Git Bash）
# 用法: ./deploy/deploy.sh root@1.2.3.4 /var/www/zbblog
set -euo pipefail

SERVER="${1:?用法: deploy.sh <user@host> [target_dir]}"
TARGET="${2:-/var/www/zbblog}"

echo "==> 构建静态文件..."
npm run build

if [ ! -f ./dist/index.html ]; then
  echo "dist/index.html 不存在，构建失败" >&2
  exit 1
fi

echo "==> 上传到 ${SERVER}:${TARGET}"
ssh "$SERVER" "mkdir -p '$TARGET'"
rsync -avz --delete ./dist/ "${SERVER}:${TARGET}/"

echo "==> 完成"
