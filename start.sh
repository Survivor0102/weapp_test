#!/bin/bash

# 待办事项 + 番茄钟 启动脚本

echo "🚀 启动待办事项 + 番茄钟应用"
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到 Python3"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 启动后端
echo "📦 启动后端服务..."
cd backend

if [ ! -d "venv" ]; then
    echo "📥 创建 Python 虚拟环境..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

# 后台启动 Flask
python app.py &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo ""

# 等待后端启动
sleep 2

# 启动前端
echo "🎨 启动前端服务..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "📥 安装前端依赖..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 访问地址：http://localhost:5173"
echo "📡 API 地址：http://localhost:5000/api"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待中断信号
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
