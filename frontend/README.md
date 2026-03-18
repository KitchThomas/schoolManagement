# 学校管理系统 - 前端

React + TypeScript + Ant Design 前端应用

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3001 启动

### 3. 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/        # 通用组件
│   │   └── Layout.tsx     # 主布局
│   ├── pages/             # 页面组件
│   │   ├── Login.tsx      # 登录页
│   │   ├── Register.tsx   # 注册页
│   │   ├── Dashboard.tsx  # 仪表板
│   │   ├── Users.tsx      # 用户管理
│   │   ├── Courses.tsx    # 课程管理
│   │   ├── Assignments.tsx# 作业管理
│   │   └── Profile.tsx    # 个人信息
│   ├── services/          # API 服务
│   │   ├── api.ts         # Axios 配置
│   │   ├── authService.ts # 认证服务
│   │   └── user.service.ts# 用户服务
│   ├── store/             # 状态管理
│   │   └── authStore.ts   # 认证状态
│   ├── App.tsx            # 主应用
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── index.html             # HTML 模板
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 依赖配置
```

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ant Design 5** - UI 组件库
- **React Router 6** - 路由管理
- **Axios** - HTTP 客户端
- **Zustand** - 状态管理

## 📝 功能特性

### ✅ 已实现

- 用户登录/注册
- JWT 认证
- 用户管理（CRUD）
- 响应式布局
- 权限控制

### 🚧 开发中

- 课程管理
- 作业管理
- 学习进度
- 报表统计

## 🔧 环境配置

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## 📡 API 集成

前端通过 Axios 与后端 API 通信：

- **开发环境**: `http://localhost:3000/api/v1`
- **生产环境**: 通过环境变量配置

## 🎨 UI 设计

使用 Ant Design 组件库，提供：
- 响应式设计
- 暗色主题支持
- 丰富的组件
- 国际化支持

## 🔐 认证流程

1. 用户登录 → 获取 JWT Token
2. Token 存储在 localStorage
3. 每次请求自动添加 Authorization header
4. Token 过期自动刷新

## 📱 响应式支持

- 桌面端：完整功能
- 平板端：自适应布局
- 手机端：移动端优化

## 🚀 部署

### 构建

```bash
npm run build
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 调试

### 开发工具

- React DevTools
- Redux DevTools（如果使用 Redux）
- Browser Network Tab

### 常见问题

**Q: 登录后跳转失败？**
A: 检查 token 是否正确保存在 localStorage

**Q: API 请求跨域？**
A: 确保后端配置了 CORS，或使用 Vite proxy

**Q: 样式不生效？**
A: 检查 CSS 导入顺序，确保 Ant Design 样式正确加载

## 📞 支持

如有问题，请联系开发团队。

---

**创建时间**: 2026-03-17  
**版本**: 1.0.0  
**作者**: 大河 🌊
