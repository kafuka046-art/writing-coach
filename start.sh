#!/usr/bin/env bash
# 写作助手一键启动（macOS / Linux）
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "[错误] 未检测到 Node.js，需要 18 或更高版本"
  echo "请先安装 Node.js: https://nodejs.org/ 然后重新运行本脚本"
  exit 1
fi

echo "=========================================="
echo "  写作助手 · 代理服务器启动中"
echo "  http://localhost:8768/"
echo "  按 Ctrl+C 停止"
echo "=========================================="

( sleep 2; (command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:8768/) || open http://localhost:8768/ 2>/dev/null || true ) &

node proxy-server.js
