@echo off
echo 🚀 启动宠物预约系统...

echo.
echo 📦 1. 启动后端服务...
cd back-end
start "Backend Server" cmd /k "npm run dev"

echo.
echo ⏳ 等待后端服务启动...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 2. 启动前端项目...
cd ../front-end-taro
start "Frontend Dev" cmd /k "npm run dev:h5"

echo.
echo ✅ 系统启动完成！
echo 📍 后端服务: http://localhost:3000
echo 📍 前端页面: 请查看 HBuilderX 控制台
echo 📍 测试页面: /pages/test-admin
echo 📍 Admin 登录: /pages/admin/admin

pause