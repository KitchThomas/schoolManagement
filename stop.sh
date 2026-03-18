#!/bin/bash
# 停止前后端服务

echo "🛑 停止学校管理系统..."

# 读取 PID
if [ -f /tmp/school-backend.pid ]; then
    BACKEND_PID=$(cat /tmp/school-backend.pid)
    kill $BACKEND_PID 2>/dev/null || echo "后端进程已停止"
    rm /tmp/school-backend.pid
fi

if [ -f /tmp/school-frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/school-frontend.pid)
    kill $FRONTEND_PID 2>/dev/null || echo "前端进程已停止"
    rm /tmp/school-frontend.pid
fi

echo "✅ 服务已停止"
