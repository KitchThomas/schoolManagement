# Prisma Schema 修复说明

## 问题
Prisma schema 中存在以下问题：
1. User 模型中 Enrollment 关系歧义
2. User 模型中 Submission 关系歧义
3. CourseContent 模型中 course 字段类型错误（应该是单个 Course，不是数组）
4. LearningProgress 模型引用了不存在的 enrollmentId

## 修复方法

### 在服务器上运行：
```bash
cd ~/schoolManagement/backend

# 备份原文件
cp prisma/schema.prisma prisma/schema.prisma.backup

# 从 GitHub 拉取最新代码
git pull origin main

# 验证 schema
npx prisma format

# 如果验证通过，继续部署
npm run prisma:generate
npm run prisma:migrate
```

## 修复内容

### 1. User 模型
**修复前：**
```prisma
  enrollments        Enrollment[]
  submissions        Submission[]
```

**修复后：**
```prisma
  enrollments         Enrollment[]         @relation("UserEnrollments")
  enrolledByEnrollments Enrollment[]       @relation("EnrollmentAssigner")
  submissions         Submission[]         @relation("UserSubmissions")
```

### 2. Enrollment 模型
**修复前：**
```prisma
  student          User              @relation(fields: [studentId], references: [id], onDelete: Cascade)
```

**修复后：**
```prisma
  student          User              @relation("UserEnrollments", fields: [studentId], references: [id], onDelete: Cascade)
```

### 3. Submission 模型
**修复前：**
```prisma
  student    User       @relation(fields: [studentId], references: [id])
```

**修复后：**
```prisma
  student    User       @relation("UserSubmissions", fields: [studentId], references: [id])
```

### 4. CourseContent 模型
**修复前：**
```prisma
  course           Course[]         @relation(...)
```

**修复后：**
```prisma
  course           Course            @relation(...)
```

### 5. LearningProgress 模型
**删除了：**
```prisma
  enrollment Enrollment?   @relation(fields: [enrollmentId], references: [id])
```

## 下一步

修复完成后，推送代码到 GitHub：

```bash
cd /home/tdong/thomas/project/SchoolManagementApplicaiton
git add .
git commit -m "fix: resolve Prisma schema relation conflicts"
git push
```

然后在服务器上拉取更新：

```bash
cd ~/schoolManagement/backend
git pull
npx prisma format
npm run prisma:generate
npm run prisma:migrate
```
