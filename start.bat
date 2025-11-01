@echo off
echo ====================================
echo 机器学习任务演化可视化
echo ====================================
echo.
echo 正在启动本地服务器...
echo.

:: 检查Python是否可用
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 使用Python启动服务器...
    echo.
    echo 服务器地址: http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    echo Python未找到，请手动启动服务器。
    echo.
    echo 您可以使用以下方式之一:
    echo 1. Python: python -m http.server 8000
    echo 2. Node.js: npx http-server -p 8000
    echo 3. VSCode: 使用 Live Server 扩展
    echo.
    pause
)

