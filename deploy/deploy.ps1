# 本地构建并部署到阿里云 ECS（Windows PowerShell）
# 用法：
#   .\deploy\deploy.ps1 -Server root@1.2.3.4 -Target /var/www/zbblog
# 前提：本机已配置 SSH 密钥登录，服务器已装 nginx

param(
  [Parameter(Mandatory = $true)][string]$Server,
  [string]$Target = '/var/www/zbblog',
  [switch]$SkipBuild,
  [switch]$ReloadNginx
)

$ErrorActionPreference = 'Stop'

if (-not $SkipBuild) {
  Write-Host '==> 构建静态文件...' -ForegroundColor Cyan
  npm run build
}

if (-not (Test-Path './dist/index.html')) {
  throw 'dist/index.html 不存在，构建可能失败。'
}

Write-Host "==> 确保远程目录存在: $Target" -ForegroundColor Cyan
ssh $Server "mkdir -p $Target"

Write-Host '==> 上传 dist/ ...' -ForegroundColor Cyan
scp -r ./dist/* "${Server}:${Target}/"

if ($ReloadNginx) {
  Write-Host '==> 重载 nginx...' -ForegroundColor Cyan
  ssh $Server 'nginx -t && systemctl reload nginx'
}

Write-Host '==> 完成。' -ForegroundColor Green
