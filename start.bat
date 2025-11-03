@echo off
chcp 65001 >nul
echo ====================================
echo 机器学习任务演化可视化
echo ====================================
echo.

:: 先关闭可能存在的旧服务器
echo 检查并关闭旧服务器...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo 正在启动服务器...
start "Python HTTP Server" cmd /k "chcp 65001 >nul && echo 服务器运行中... && python -m http.server 8000 --bind 127.0.0.1"
timeout /t 3 /nobreak >nul
start http://127.0.0.1:8000
echo.
echo 服务器已启动！
echo 地址: http://127.0.0.1:8000
echo.
echo 如果浏览器没有自动打开，请手动访问上述地址
echo 关闭服务器窗口即可停止服务器
pause

