# School Management Application

教育培训管理系统（LMS）- 学习管理系统

## 项目简介

这是一个面向教育培训机构的完整学习管理系统，支持多角色用户（学区管理员、系统管理员、教师、学生、家长、招生合作伙伴）的在线教育平台。

### 核心功能

- ✅ 用户认证与授权（RBAC）
- ✅ 课程创建与管理
- ✅ 内容编辑器（拖拽式）
- ✅ 作业与评估系统
- ✅ 学习进度跟踪
- ✅ 标准对齐（州/省教育标准）
- ✅ 通知系统
- ✅ 报表分析

## 技术栈

### 后端
- **Node.js** 20.x LTS
- **NestJS** 10.x - 企业级框架
- **PostgreSQL** 16.x - 关系型数据库
- **Prisma** 5.x - ORM
- **Redis** 7.x - 缓存
- **JWT** - 认证
- **Swagger** - API 文档

### 前端
- **React** 18.x
- **TypeScript** 5.x
- **Ant Design** 5.x
- **Redux Toolkit** 2.x
- **React Query** 5.x

### 基础设施
- **AWS Lightsail** - 应用服务器
- **AWS S3** - 文件存储
- **AWS CloudFront** - CDN
- **AWS SES** - 邮件服务

## 项目结构

```
SchoolManagementApplicaiton/
├── backend/                 # 后端代码
│   ├── src/
│   │   ├── main.ts         # 应用入口
│   │   ├── app.module.ts   # 根模块
│   │   ├── config/         # 配置文件
│   │   ├── common/         # 公共模块
│   │   │   ├── decorators/ # 自定义装饰器
│   │   │   ├── filters/    # 异常过滤器
│   │   │   ├── guards/     # 守卫（认证/授权）
│   │   │   ├── interceptors/ # 拦截器
│   │   │   └── pipes/      # 管道
│   │   └── modules/        # 业务模块
│   │       ├── auth/       # 认证模块
│   │       ├── users/      # 用户管理
│   │       ├── courses/    # 课程管理
│   │       ├── content/    # 内容管理
│   │       ├── assessments/# 评估系统
│   │       ├── notifications/ # 通知
│   │       └── reports/    # 报表
│   ├── prisma/
│   │   └── schema.prisma   # 数据库模型
│   ├── test/               # 测试文件
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── pages/         # 页面
│   │   ├── services/      # API 服务
│   │   ├── store/         # Redux store
│   │   └── utils/         # 工具函数
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── docs/                   # 文档
│   ├── 01-系统设计总览.md
│   ├── 02-部署与费用估算.md
│   └── ...
├── database/               # 数据库相关
│   └── 01-数据库设计.md
├── api/                    # API 文档
│   └── 01-API设计文档.md
└── scripts/                # 脚本工具
    └── deploy.sh
```

## 快速开始

### 前置要求

- Node.js 20.x LTS
- PostgreSQL 16.x
- Redis 7.x（可选）
- npm 或 yarn

### 后端设置

```bash
# 1. 进入后端目录
cd backend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写数据库连接信息

# 4. 生成 Prisma Client
npm run prisma:generate

# 5. 运行数据库迁移
npm run prisma:migrate

# 6. （可选）填充种子数据
npm run prisma:seed

# 7. 启动开发服务器
npm run start:dev
```

### 前端设置

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 访问应用

- **前端**: http://localhost:3001
- **后端 API**: http://localhost:3000/api/v1
- **API 文档**: http://localhost:3000/api/docs

## 开发指南

### 代码规范

- 使用 ESLint + Prettier
- 遵循 TypeScript 严格模式
- 编写单元测试（Jest）
- 遵循 Git Flow 工作流

### 提交规范

使用 Conventional Commits:

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具

### 分支策略

- `main` - 生产分支
- `develop` - 开发分支
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复分支

## API 文档

启动后端后访问：http://localhost:3000/api/docs

## 测试

```bash
# 单元测试
npm run test

# e2e 测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 部署

详见 [部署文档](./docs/02-部署与费用估算.md)

## 费用估算

- **一期（MVP）**: $45-50/月
- **二期（运营）**: $60-70/月
- **三期（扩展）**: $130-150/月

详见 [费用估算](./docs/02-部署与费用估算.md)

## 团队

- **项目经理**: 大河 - 负责协调、规划、代码审查
- **Developer**: Sub-agent - 负责编码实现
- **测试人员**: Sub-agent - 负责功能测试

## 许可证

私有项目 - 未经授权禁止使用

## 联系方式

项目负责人：大河  
Email: your-email@example.com

---

**当前版本**: 1.0.0  
**最后更新**: 2026-03-17
