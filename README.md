# 学校管理系统

一个完整的教育培训管理系统（LMS），支持多角色用户、课程管理、作业评估等功能。

---

## 🎯 项目概述

### 技术栈

**后端**
- Node.js 20 + NestJS 10
- PostgreSQL 16 + Prisma 5
- Redis 7 + JWT 认证
- Swagger API 文档

**前端**
- React 18 + TypeScript
- Vite 5 构建工具
- Ant Design 5 UI 组件
- Zustand 状态管理

**基础设施**
- AWS Lightsail（应用服务器）
- AWS S3（文件存储）
- AWS CloudFront（CDN）

---

## 🚀 快速开始

### 方式1：一键启动（推荐）

```bash
cd /home/tdong/thomas/project/SchoolManagementApplicaiton
chmod +x start.sh
./start.sh
```

启动后访问：
- **前端**: http://localhost:3001
- **后端**: http://localhost:3000
- **API 文档**: http://localhost:3000/api/docs

---

### 方式2：手动启动

#### 1. 启动后端

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
nano .env  # 修改数据库连接等

# 初始化数据库
npm run prisma:generate
npm run prisma:migrate

# 启动服务
npm run start:dev
```

#### 2. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动服务
npm run dev
```

---

## 📁 项目结构

```
SchoolManagementApplicaiton/
├── backend/                  # 后端代码
│   ├── src/
│   │   ├── modules/         # 业务模块
│   │   │   ├── auth/        # 认证模块
│   │   │   ├── users/       # 用户管理
│   │   │   ├── courses/     # 课程管理
│   │   │   └── ...
│   │   ├── common/          # 公共模块
│   │   ├── config/          # 配置文件
│   │   └── main.ts          # 应用入口
│   ├── prisma/
│   │   └── schema.prisma    # 数据库模型
│   └── package.json
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面
│   │   ├── services/        # API 服务
│   │   ├── store/           # 状态管理
│   │   └── main.tsx         # 应用入口
│   └── package.json
├── docs/                     # 文档
│   ├── 01-系统设计总览.md
│   ├── 02-部署与费用估算.md
│   └── ...
├── database/                 # 数据库文档
│   └── 01-数据库设计.md
├── api/                      # API 文档
│   └── 01-API设计文档.md
├── start.sh                  # 一键启动脚本
└── README.md                 # 本文件
```

---

## 🎨 功能特性

### ✅ 已实现（一期 MVP）

#### 用户管理
- 用户注册/登录
- JWT 认证
- RBAC 权限控制
- 用户 CRUD

#### 课程管理
- 课程创建/编辑
- 内容管理
- 标准对齐

#### 作业评估
- 作业发布
- 学生提交
- 教师评分

#### 其他
- Swagger API 文档
- 响应式前端界面
- 完整的错误处理

---

## 🔐 测试账号

### 管理员
- 邮箱: `admin@school.com`
- 密码: `Admin123!`
- 权限: 所有功能

### 教师
- 邮箱: `teacher@school.com`
- 密码: `Teacher123!`
- 权限: 课程管理、学生评估

### 学生
- 邮箱: `student@school.com`
- 密码: `Student123!`
- 权限: 学习、提交作业

---

## 📡 API 端点

### 认证相关

```
POST /api/v1/auth/register    # 用户注册
POST /api/v1/auth/login       # 用户登录
POST /api/v1/auth/refresh     # 刷新令牌
POST /api/v1/auth/logout      # 登出
```

### 用户管理

```
GET    /api/v1/users          # 用户列表
GET    /api/v1/users/:id      # 用户详情
POST   /api/v1/users          # 创建用户
PATCH  /api/v1/users/:id      # 更新用户
DELETE /api/v1/users/:id      # 删除用户
```

### 课程管理

```
GET    /api/v1/courses        # 课程列表
GET    /api/v1/courses/:id    # 课程详情
POST   /api/v1/courses        # 创建课程
PATCH  /api/v1/courses/:id    # 更新课程
DELETE /api/v1/courses/:id    # 删除课程
```

完整 API 文档: http://localhost:3000/api/docs

---

## 🗄️ 数据库模型

### 核心表

- `users` - 用户表
- `roles` - 角色表
- `permissions` - 权限表
- `courses` - 课程表
- `assignments` - 作业表
- `submissions` - 提交表

详见: `database/01-数据库设计.md`

---

## 🚀 部署

### AWS Lightsail 部署

详见: `docs/02-部署与费用估算.md`

**月度费用估算：**
- 一期（MVP）: $45-50/月
- 二期（运营）: $60-70/月

---

## 🛠️ 开发工具

### Dev Tools Skill

大河已创建 `dev-tools` 技能，提供自动化脚本：

```bash
# 编译后端
./scripts/build-backend.sh

# 一键部署
./scripts/deploy.sh "commit message"

# 数据库迁移
./scripts/prisma-migrate.sh
```

详见: `/home/tdong/OpenClaw/skills/dev-tools/`

---

## 📝 开发进度

### 一期（MVP）- 6-8周

- ✅ Week 1-2: 项目搭建、用户认证
- ✅ Week 3-4: 权限系统、基础 UI
- ✅ Week 5-6: 课程管理、内容编辑器
- ⏳ Week 7-8: 作业评估、基础报表

### 二期（运营）- 4-6周

- ⏳ 测验考试系统
- ⏳ 评分标准
- ⏳ 运营报表

---

## 🐛 故障排除

### 后端无法启动

```bash
# 检查数据库连接
npm run prisma:generate

# 检查环境变量
cat .env

# 查看日志
npm run start:dev
```

### 前端无法启动

```bash
# 清理依赖
rm -rf node_modules package-lock.json
npm install

# 检查端口占用
lsof -i :3001
```

### API 请求失败

1. 检查后端是否启动: http://localhost:3000/api/docs
2. 检查 CORS 配置
3. 检查网络请求（浏览器开发者工具）

---

## 📞 支持

### 文档

- 系统设计: `docs/01-系统设计总览.md`
- API 文档: `api/01-API设计文档.md`
- 数据库设计: `database/01-数据库设计.md`
- 部署指南: `docs/02-部署与费用估算.md`

### 联系方式

项目负责人：大河 🌊

---

## 📄 许可证

私有项目 - 未经授权禁止使用

---

**当前版本**: 1.0.0  
**最后更新**: 2026-03-17  
**创建者**: 大河 & Team
