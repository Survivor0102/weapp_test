@echo off
chcp 65001 >nul

echo 🚀 启动待办事项 + 番茄钟应用
echo.

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到 Python
    exit /b 1
)

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到 Node.js
    exit /b 1
)

echo ✅ 环境检查通过
echo.

REM 启动后端
echo 📦 启动后端服务...
cd backend

if not exist venv (
    echo 📥 创建 Python 虚拟环境...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1

start "Flask Backend" cmd /c "python app.py"
echo ✅ 后端服务已启动
echo.

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端
echo 🎨 启动前端服务...
cd ..\frontend

if not exist node_modules (
    echo 📥 安装前端依赖...
    call npm install
)

start "Vite Frontend" cmd /c "npm run dev"
echo ✅ 前端服务已启动
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🌐 访问地址：http://localhost:5173
echo 📡 API 地址：http://localhost:5000/api
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 关闭所有窗口以停止服务
