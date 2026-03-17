#!/bin/bash
# 编译后端代码

echo "🔨 编译 NestJS 后端..."

cd /home/tdong/thomas/project/SchoolManagementApplicaiton/backend

# 清理之前的编译结果
rm -rf dist/

# 编译 TypeScript
npm run build

# 检查编译结果
if [ $? -eq 0 ]; then
  echo "✅ 编译成功！"
  echo "📁 输出目录: dist/"
else
  echo "❌ 编译失败！"
  echo "请检查上面的错误信息"
  exit 1
fi
