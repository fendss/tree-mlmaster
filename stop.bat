@echo off
echo 正在关闭占用端口8000的进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo 关闭进程 PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul
echo 完成！

