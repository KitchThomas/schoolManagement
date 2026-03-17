#!/bin/bash
# 验证 Prisma Schema

echo "🔍 验证 Prisma Schema..."

cd /home/tdong/thomas/project/SchoolManagementApplicaiton/backend

# 格式化 schema
npx prisma format

# 验证 schema
npx prisma validate

echo "✅ Schema 验证完成！"
