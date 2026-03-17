# API设计文档

**版本：** 1.0  
**日期：** 2026-03-17  
**基础URL：** `https://api.schoolmanagement.com/v1`

---

## 一、API设计原则

### 1.1 RESTful规范

- 使用HTTP标准方法（GET, POST, PUT, PATCH, DELETE）
- 资源命名使用复数形式
- 使用HTTP状态码表示结果
- 支持过滤、排序、分页

### 1.2 版本控制

- URL路径版本：`/v1/`, `/v2/`
- 向后兼容原则

### 1.3 响应格式

#### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

#### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  }
}
```

#### 分页响应

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 1.4 认证方式

- **Bearer Token**（JWT）
- Header: `Authorization: Bearer <token>`

---

## 二、认证API（/auth）

### 2.1 用户注册

```http
POST /auth/register
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student" // 可选，默认student
}
```

**响应：** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.2 用户登录

```http
POST /auth/login
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["student"],
      "permissions": ["courses:read", "assignments:submit"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

### 2.3 刷新Token

```http
POST /auth/refresh
```

**请求体：**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 2.4 登出

```http
POST /auth/logout
```

**请求头：** `Authorization: Bearer <token>`

**响应：** `200 OK`
```json
{
  "success": true,
  "message": "登出成功"
}
```

### 2.5 修改密码

```http
POST /auth/change-password
```

**请求头：** `Authorization: Bearer <token>`

**请求体：**
```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewSecure456!"
}
```

**响应：** `200 OK`

### 2.6 忘记密码

```http
POST /auth/forgot-password
```

**请求体：**
```json
{
  "email": "user@example.com"
}
```

**响应：** `200 OK`
```json
{
  "success": true,
  "message": "密码重置邮件已发送"
}
```

### 2.7 重置密码

```http
POST /auth/reset-password
```

**请求体：**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecure456!"
}
```

**响应：** `200 OK`

---

## 三、用户管理API（/users）

### 3.1 获取当前用户信息

```http
GET /users/me
```

**请求头：** `Authorization: Bearer <token>`

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://...",
    "roles": ["student"],
    "permissions": ["courses:read", "assignments:submit"],
    "createdAt": "2026-03-17T00:00:00Z"
  }
}
```

### 3.2 更新用户信息

```http
PATCH /users/me
```

**请求头：** `Authorization: Bearer <token>`

**请求体：**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "avatarUrl": "https://..."
}
```

**响应：** `200 OK`

### 3.3 获取用户列表（管理员）

```http
GET /users
```

**请求头：** `Authorization: Bearer <token>`  
**权限：** `users:read`

**查询参数：**
- `page` (int): 页码，默认1
- `pageSize` (int): 每页数量，默认20
- `role` (string): 按角色筛选
- `status` (string): 按状态筛选
- `search` (string): 搜索（邮箱、姓名）

**响应：** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["student"],
      "status": "active",
      "createdAt": "2026-03-17T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 3.4 获取单个用户（管理员）

```http
GET /users/:id
```

**权限：** `users:read`

**响应：** `200 OK`

### 3.5 创建用户（管理员）

```http
POST /users
```

**权限：** `users:create`

**请求体：**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "roles": ["teacher"]
}
```

**响应：** `201 Created`

### 3.6 更新用户（管理员）

```http
PATCH /users/:id
```

**权限：** `users:update`

**请求体：**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "roles": ["teacher", "district_admin"],
  "status": "active"
}
```

**响应：** `200 OK`

### 3.7 删除用户（管理员）

```http
DELETE /users/:id
```

**权限：** `users:delete`

**响应：** `204 No Content`

### 3.8 分配角色

```http
POST /users/:id/roles
```

**权限：** `users:update`

**请求体：**
```json
{
  "roleIds": ["role_uuid_1", "role_uuid_2"]
}
```

**响应：** `200 OK`

---

## 四、课程管理API（/courses）

### 4.1 获取课程列表

```http
GET /courses
```

**请求头：** `Authorization: Bearer <token>`  
**权限：** `courses:read`

**查询参数：**
- `page`, `pageSize`: 分页
- `status`: 按状态筛选（draft, published, archived）
- `teacherId`: 按教师筛选
- `search`: 搜索标题、描述
- `sortBy`: 排序字段（createdAt, title, publishedAt）
- `sortOrder`: 排序方向（asc, desc）

**响应：** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "数学基础课程",
      "description": "课程描述",
      "teacher": {
        "id": "uuid",
        "name": "张老师"
      },
      "status": "published",
      "coverImageUrl": "https://...",
      "enrollmentCount": 30,
      "startDate": "2026-04-01",
      "endDate": "2026-06-30",
      "publishedAt": "2026-03-15T00:00:00Z",
      "createdAt": "2026-03-10T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 4.2 获取课程详情

```http
GET /courses/:id
```

**权限：** `courses:read`

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "数学基础课程",
    "description": "课程描述",
    "teacher": {
      "id": "uuid",
      "name": "张老师"
    },
    "status": "published",
    "coverImageUrl": "https://...",
    "content": [
      {
        "id": "uuid",
        "type": "module",
        "title": "第一章",
        "order": 1,
        "children": [
          {
            "id": "uuid",
            "type": "lesson",
            "title": "1.1 基础概念",
            "order": 1,
            "duration": 30
          }
        ]
      }
    ],
    "enrollmentCount": 30,
    "settings": {...},
    "createdAt": "2026-03-10T00:00:00Z"
  }
}
```

### 4.3 创建课程

```http
POST /courses
```

**权限：** `courses:create`

**请求体：**
```json
{
  "title": "数学基础课程",
  "description": "课程描述",
  "templateId": "template_uuid", // 可选
  "coverImageUrl": "https://...", // 可选
  "startDate": "2026-04-01",
  "endDate": "2026-06-30",
  "settings": {
    "allowLateEnrollment": true,
    "maxEnrollments": 50
  }
}
```

**响应：** `201 Created`

### 4.4 更新课程

```http
PATCH /courses/:id
```

**权限：** `courses:update`

**请求体：**
```json
{
  "title": "更新后的标题",
  "description": "更新后的描述",
  "coverImageUrl": "https://...",
  "settings": {...}
}
```

**响应：** `200 OK`

### 4.5 删除课程

```http
DELETE /courses/:id
```

**权限：** `courses:delete`

**响应：** `204 No Content`

### 4.6 发布课程

```http
POST /courses/:id/publish
```

**权限：** `courses:publish`

**请求体：**
```json
{
  "publishAt": "2026-03-20T00:00:00Z" // 可选，立即发布则不传
}
```

**响应：** `200 OK`

### 4.7 归档课程

```http
POST /courses/:id/archive
```

**权限：** `courses:update`

**响应：** `200 OK`

### 4.8 复制课程

```http
POST /courses/:id/copy
```

**权限：** `courses:create`

**请求体：**
```json
{
  "title": "复制的课程标题", // 可选
  "deepCopy": true // 是否深度复制（包括内容）
}
```

**响应：** `201 Created`

---

## 五、课程内容API（/courses/:courseId/content）

### 5.1 获取课程内容树

```http
GET /courses/:courseId/content
```

**权限：** `courses:read`

**响应：** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "module",
      "title": "第一章",
      "order": 1,
      "children": [
        {
          "id": "uuid",
          "type": "lesson",
          "title": "1.1 基础概念",
          "order": 1,
          "duration": 30,
          "status": "published"
        }
      ]
    }
  ]
}
```

### 5.2 创建内容模块

```http
POST /courses/:courseId/content
```

**权限：** `courses:update`

**请求体：**
```json
{
  "type": "lesson",
  "title": "新课时",
  "description": "课时描述",
  "parentId": "module_uuid", // 可选，创建子内容时需要
  "content": {
    "type": "video",
    "videoUrl": "https://...",
    "transcript": "文字稿"
  },
  "durationMinutes": 30,
  "order": 1,
  "settings": {
    "publishAt": "2026-03-20T00:00:00Z",
    "visibleRoles": ["student", "teacher"]
  }
}
```

**响应：** `201 Created`

### 5.3 更新内容

```http
PATCH /courses/:courseId/content/:contentId
```

**权限：** `courses:update`

**请求体：**
```json
{
  "title": "更新后的标题",
  "content": {...},
  "settings": {...}
}
```

**响应：** `200 OK`

### 5.4 删除内容

```http
DELETE /courses/:courseId/content/:contentId
```

**权限：** `courses:update`

**响应：** `204 No Content`

### 5.5 调整内容顺序

```http
POST /courses/:courseId/content/reorder
```

**权限：** `courses:update`

**请求体：**
```json
{
  "orders": [
    {"id": "content_uuid_1", "order": 2},
    {"id": "content_uuid_2", "order": 1}
  ]
}
```

**响应：** `200 OK`

### 5.6 关联教育标准

```http
POST /courses/:courseId/content/:contentId/standards
```

**权限：** `courses:update`

**请求体：**
```json
{
  "standardIds": ["standard_uuid_1", "standard_uuid_2"],
  "alignmentLevel": "strong"
}
```

**响应：** `200 OK`

---

## 六、作业管理API（/assignments）

### 6.1 获取作业列表

```http
GET /courses/:courseId/assignments
```

**权限：** `assignments:read`

**查询参数：**
- `page`, `pageSize`: 分页
- `status`: 状态筛选
- `assignmentType`: 类型筛选

**响应：** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "第一章作业",
      "description": "作业描述",
      "assignmentType": "homework",
      "maxScore": 100,
      "dueDate": "2026-03-25T23:59:59Z",
      "status": "published",
      "submissionCount": 25,
      "averageScore": 85.5,
      "createdAt": "2026-03-17T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### 6.2 创建作业

```http
POST /courses/:courseId/assignments
```

**权限：** `assignments:create`

**请求体：**
```json
{
  "title": "第一章作业",
  "description": "作业描述",
  "instructions": "详细说明",
  "assignmentType": "homework",
  "maxScore": 100,
  "passingScore": 60,
  "dueDate": "2026-03-25T23:59:59Z",
  "lateSubmissionAllowed": true,
  "latePenalty": 10,
  "maxAttempts": 1,
  "submissionTypes": ["file", "text"],
  "fileTypes": ["pdf", "doc", "docx"],
  "maxFileSize": 10485760,
  "rubricId": "rubric_uuid", // 可选
  "settings": {}
}
```

**响应：** `201 Created`

### 6.3 获取作业详情

```http
GET /assignments/:id
```

**权限：** `assignments:read`

**响应：** `200 OK`

### 6.4 更新作业

```http
PATCH /assignments/:id
```

**权限：** `assignments:create`（创建者）

**请求体：**
```json
{
  "title": "更新后的标题",
  "dueDate": "2026-03-30T23:59:59Z",
  ...
}
```

**响应：** `200 OK`

### 6.5 删除作业

```http
DELETE /assignments/:id
```

**权限：** `assignments:create`（创建者）

**响应：** `204 No Content`

---

## 七、作业提交API（/submissions）

### 7.1 提交作业

```http
POST /assignments/:assignmentId/submissions
```

**权限：** `assignments:submit`

**请求体：**
```json
{
  "content": "文本内容", // 可选
  "fileUrls": ["https://s3.../file1.pdf"], // 可选
  "attemptNumber": 1
}
```

**响应：** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "assignmentId": "uuid",
    "studentId": "uuid",
    "attemptNumber": 1,
    "submittedAt": "2026-03-20T10:00:00Z",
    "status": "submitted"
  }
}
```

### 7.2 获取我的提交

```http
GET /assignments/:assignmentId/submissions/my
```

**权限：** `assignments:submit`

**响应：** `200 OK`

### 7.3 获取所有提交（教师）

```http
GET /assignments/:assignmentId/submissions
```

**权限：** `assignments:grade`

**查询参数：**
- `page`, `pageSize`: 分页
- `status`: 状态筛选
- `studentId`: 学生筛选

**响应：** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student": {
        "id": "uuid",
        "name": "张三",
        "email": "student@example.com"
      },
      "attemptNumber": 1,
      "submittedAt": "2026-03-20T10:00:00Z",
      "status": "submitted",
      "score": null,
      "late": false
    }
  ],
  "pagination": {...}
}
```

### 7.4 评分作业

```http
POST /submissions/:submissionId/grade
```

**权限：** `assignments:grade`

**请求体：**
```json
{
  "score": 85,
  "feedback": "做得很好！继续保持。",
  "feedbackFileUrl": "https://s3.../feedback.mp4", // 可选
  "rubricScores": { // 可选
    "c1": 20,
    "c2": 25,
    "c3": 40
  }
}
```

**响应：** `200 OK`

### 7.5 返回作业

```http
POST /submissions/:submissionId/return
```

**权限：** `assignments:grade`

**请求体：**
```json
{
  "message": "请修改后重新提交"
}
```

**响应：** `200 OK`

---

## 八、学习进度API（/progress）

### 8.1 获取我的学习进度

```http
GET /courses/:courseId/progress/my
```

**权限：** `students:track`（自己）

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "courseId": "uuid",
    "enrollmentId": "uuid",
    "overallProgress": 45.5,
    "completedContent": 10,
    "totalContent": 22,
    "contentProgress": [
      {
        "contentId": "uuid",
        "title": "1.1 基础概念",
        "status": "completed",
        "progress": 100,
        "timeSpent": 1800,
        "completedAt": "2026-03-18T10:00:00Z"
      },
      {
        "contentId": "uuid",
        "title": "1.2 进阶概念",
        "status": "in_progress",
        "progress": 50,
        "timeSpent": 900
      }
    ]
  }
}
```

### 8.2 更新学习进度

```http
POST /content/:contentId/progress
```

**权限：** `students:track`（自己）

**请求体：**
```json
{
  "status": "in_progress",
  "progress": 50,
  "timeSpent": 900 // 本次学习时长（秒）
}
```

**响应：** `200 OK`

### 8.3 获取学生进度列表（教师）

```http
GET /courses/:courseId/progress
```

**权限：** `students:track`

**查询参数：**
- `page`, `pageSize`: 分页
- `status`: 状态筛选

**响应：** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "student": {
        "id": "uuid",
        "name": "张三"
      },
      "overallProgress": 65.5,
      "lastAccessedAt": "2026-03-20T10:00:00Z",
      "completedContent": 15,
      "totalContent": 22
    }
  ],
  "pagination": {...}
}
```

---

## 九、文件上传API（/files）

### 9.1 获取上传凭证

```http
POST /files/presign
```

**权限：** 认证用户

**请求体：**
```json
{
  "filename": "assignment.pdf",
  "fileSize": 5242880,
  "mimeType": "application/pdf"
}
```

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.../presigned-url",
    "fileUrl": "https://s3.../file-path",
    "expiresIn": 3600
  }
}
```

### 9.2 确认上传完成

```http
POST /files/confirm
```

**请求体：**
```json
{
  "fileUrl": "https://s3.../file-path",
  "originalFilename": "assignment.pdf"
}
```

**响应：** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fileUrl": "https://s3.../file-path",
    "filename": "assignment.pdf"
  }
}
```

---

## 十、通知API（/notifications）

### 10.1 获取通知列表

```http
GET /notifications
```

**权限：** 认证用户

**查询参数：**
- `page`, `pageSize`: 分页
- `unreadOnly`: 只看未读

**响应：** `200 OK`

### 10.2 标记为已读

```http
POST /notifications/:id/read
```

**响应：** `200 OK`

### 10.3 全部标记已读

```http
POST /notifications/read-all
```

**响应：** `200 OK`

---

## 十一、报表API（/reports）

### 11.1 课程完成率报表

```http
GET /reports/courses/:courseId/completion
```

**权限：** `reports:view`

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "courseId": "uuid",
    "courseTitle": "数学基础课程",
    "totalEnrollments": 30,
    "completed": 10,
    "inProgress": 15,
    "notStarted": 5,
    "averageProgress": 55.5,
    "completionRate": 33.3
  }
}
```

### 11.2 学生成绩报表

```http
GET /reports/courses/:courseId/grades
```

**权限：** `reports:view`

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "courseId": "uuid",
    "assignments": [
      {
        "id": "uuid",
        "title": "第一章作业",
        "averageScore": 85.5,
        "submissionRate": 90,
        "gradeDistribution": {
          "A": 10,
          "B": 15,
          "C": 3,
          "D": 1,
          "F": 1
        }
      }
    ]
  }
}
```

### 11.3 标准覆盖范围报表

```http
GET /reports/courses/:courseId/standards-coverage
```

**权限：** `reports:view`

**响应：** `200 OK`
```json
{
  "success": true,
  "data": {
    "courseId": "uuid",
    "totalStandards": 20,
    "coveredStandards": 15,
    "coverageRate": 75,
    "standards": [
      {
        "code": "CCSS.MATH.CONTENT.6.RP.A.1",
        "description": "...",
        "contentCount": 3,
        "contents": ["content_uuid_1", "content_uuid_2"]
      }
    ]
  }
}
```

---

## 十二、错误码定义

| HTTP状态码 | 错误码 | 说明 |
|-----------|--------|------|
| 400 | VALIDATION_ERROR | 请求参数验证失败 |
| 401 | UNAUTHORIZED | 未认证 |
| 403 | FORBIDDEN | 无权限 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如邮箱已存在） |
| 422 | UNPROCESSABLE_ENTITY | 业务逻辑错误 |
| 429 | RATE_LIMIT_EXCEEDED | 请求频率超限 |
| 500 | INTERNAL_ERROR | 服务器内部错误 |

---

## 十三、API文档工具

### 13.1 Swagger/OpenAPI

- 开发环境：`http://localhost:3000/api/docs`
- 生产环境：`https://api.schoolmanagement.com/docs`

### 13.2 Postman Collection

- 提供Postman Collection文件
- 包含所有API示例

---

**下一步：部署与费用估算**
