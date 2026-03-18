#!/bin/bash
# 一键启动前后端服务

set -e

PROJECT_ROOT="/home/tdong/thomas/project/SchoolManagementApplicaiton"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "🚀 启动学校管理系统..."
echo ""

# 检查后端
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "📦 后端依赖未安装，正在安装..."
    cd "$BACKEND_DIR"
    npm install
fi

# 检查前端
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📦 前端依赖未安装，正在安装..."
    cd "$FRONTEND_DIR"
    npm install
fi

# 启动后端（后台运行）
echo "🔧 启动后端服务..."
cd "$BACKEND_DIR"
npm run start:dev > /tmp/school-backend.log 2>&1 &
BACKEND_PID=$!
echo "   后端 PID: $BACKEND_PID"
echo "   日志: /tmp/school-backend.log"
echo "   地址: http://localhost:3000"
echo ""

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 5

# 启动前端（后台运行）
echo "🎨 启动前端服务..."
cd "$FRONTEND_DIR"
npm run dev > /tmp/school-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   前端 PID: $FRONTEND_PID"
echo "   日志: /tmp/school-frontend.log"
echo "   地址: http://localhost:3001"
echo ""

# 完成
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 启动完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 访问地址："
echo "   前端: http://localhost:3001"
echo "   后端: http://localhost:3000"
echo "   API文档: http://localhost:3000/api/docs"
echo ""
echo "📝 日志文件："
echo "   后端: /tmp/school-backend.log"
echo "   前端: /tmp/school-frontend.log"
echo ""
echo "🛑 停止服务："
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "💡 测试账号："
echo "   邮箱: admin@school.com"
echo "   密码: Admin123!"
echo ""

# 保存 PID
echo "$BACKEND_PID" > /tmp/school-backend.pid
echo "$FRONTEND_PID" > /tmp/school-frontend.pid

# 等待用户中断
echo "按 Ctrl+C 停止服务..."
wait
