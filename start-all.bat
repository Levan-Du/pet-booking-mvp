@echo off
chcp 65001 >nul
title 宠物预约系统 - 前后端同时启动

echo ========================================
echo   宠物预约系统 MVP - 启动脚本
echo ========================================
echo.

echo [1/3] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
echo ✅ Node.js 环境正常

echo [2/3] 启动后端服务...
cd back-end
start "后端服务" cmd /k "npm run dev"
cd ..

echo [3/3] 启动前端服务...
cd front-end-taro
start "前端服务" cmd /k "npm run dev:h5"
cd ..

echo.
echo ========================================
echo   ✅ 服务启动完成！
echo ========================================
echo 后端服务: http://localhost:3000
echo 前端服务: http://localhost:10086
echo.
echo 按任意键退出...
pause >nul