@echo off
chcp 936 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，需要 18 或更高版本
  echo 请先到 https://nodejs.org/ 下载安装，然后重新双击本文件。
  echo.
  pause
  exit /b 1
)
echo.
echo ==========================================
echo   写作助手 · 代理服务器启动中
echo   http://localhost:8768/
echo   浏览器将自动打开；关闭本窗口即停止服务
echo ==========================================
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 2; Start-Process 'http://localhost:8768/'"
node proxy-server.js
pause
