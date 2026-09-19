# 一键更新：本地构建 -> 打包 -> 上传 -> 服务器解压
# 用法：
#   .\deploy\update.ps1 -Server root@118.31.105.123
#   .\deploy\update.ps1 -Server root@118.31.105.123 -Target /www/wwwroot/zbblog
# 说明：首次需要输入一次服务器密码；配置免密后以后无需输入。

param(
  [Parameter(Mandatory = $true)][string]$Server,
  [string]$Target = '/www/wwwroot/zbblog'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
  Write-Host '==> 1/4 构建静态文件...' -ForegroundColor Cyan
  npm run build

  if (-not (Test-Path './dist/index.html')) {
    throw 'dist/index.html 不存在，构建可能失败。'
  }

  $tar = Join-Path $env:TEMP 'zbblog-dist.tar.gz'
  if (Test-Path $tar) { Remove-Item $tar -Force }

  Write-Host '==> 2/4 打包...' -ForegroundColor Cyan
  tar -czf $tar -C dist .

  Write-Host '==> 3/4 上传到服务器...' -ForegroundColor Cyan
  scp $tar "${Server}:/tmp/zbblog-dist.tar.gz"

  Write-Host '==> 4/4 服务器解压到站点目录...' -ForegroundColor Cyan
  ssh $Server "mkdir -p '$Target' && tar -xzf /tmp/zbblog-dist.tar.gz -C '$Target' && rm -f /tmp/zbblog-dist.tar.gz"

  Write-Host '==> 完成！刷新浏览器即可看到更新。' -ForegroundColor Green
}
finally {
  Pop-Location
}
