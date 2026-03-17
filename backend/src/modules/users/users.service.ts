/**
 * 用户服务
 * School Management Application Backend
 * 
 * @description 处理用户 CRUD、角色管理、权限检查等业务逻辑
 * @author 大河 & Team
 * @version 1.0.0
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateUserDto,
  UpdateUserDto,
  AssignRoleDto,
  UserDto,
  UserDetailDto,
  UserListItemDto,
  UserListResponseDto,
} from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建用户（管理员使用）
   */
  async create(createUserDto: CreateUserDto, createdBy: string): Promise<UserDetailDto> {
    const { email, password, firstName, lastName, status, roleIds } = createUserDto;

    this.logger.log(`Creating user with email: ${email}`);

    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户并分配角色
    const user = await this.prisma.$transaction(async (tx) => {
      // 创建用户
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          status: (status || 'ACTIVE') as any,
        },
      });

      // 分配角色
      if (roleIds && roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId: newUser.id,
            roleId,
            assignedBy: createdBy,
          })),
        });
      }

      return newUser;
    });

    this.logger.log(`User created successfully: ${user.id}`);

    return this.findOne(user.id);
  }

  /**
   * 获取用户列表（分页）
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
  ): Promise<UserListResponseDto> {
    this.logger.log(`Fetching users - Page: ${page}, Limit: ${limit}`);

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 查询用户列表和总数
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // 转换为响应格式
    const items: UserListItemDto[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleNames: user.roles.map((ur) => ur.role.name),
    }));

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取用户详情
   */
  async findOne(id: string): Promise<UserDetailDto> {
    this.logger.log(`Fetching user: ${id}`);

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 提取角色信息
    const roles = user.roles.map((ur) => ({
      id: ur.role.id,
      name: ur.role.name,
      displayName: ur.role.displayName,
      description: ur.role.description,
    }));

    // 提取权限（去重）
    const permissions = [
      ...new Set(
        user.roles.flatMap((ur) =>
          ur.role.permissions.map((rp) =>
            `${rp.permission.resource}:${rp.permission.action}`,
          ),
        ),
      ),
    ];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles,
      permissions,
    };
  }

  /**
   * 更新用户信息
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedBy: string,
  ): Promise<UserDetailDto> {
    this.logger.log(`Updating user: ${id}`);

    // 检查用户是否存在
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // 如果要更新邮箱，检查是否已被使用
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }

    // 更新用户
    await this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        avatarUrl: updateUserDto.avatarUrl,
        status: updateUserDto.status as any,
      },
    });

    this.logger.log(`User updated successfully: ${id}`);

    return this.findOne(id);
  }

  /**
   * 删除用户（软删除）
   */
  async remove(id: string): Promise<{ message: string }> {
    this.logger.log(`Deleting user: ${id}`);

    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 软删除
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`User deleted successfully: ${id}`);

    return { message: 'User deleted successfully' };
  }

  /**
   * 为用户分配角色
   */
  async assignRoles(
    userId: string,
    assignRoleDto: AssignRoleDto,
    assignedBy: string,
  ): Promise<UserDetailDto> {
    const { roleIds } = assignRoleDto;

    this.logger.log(`Assigning roles to user: ${userId}`);

    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 验证所有角色是否存在
    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    // 删除现有角色并分配新角色
    await this.prisma.$transaction(async (tx) => {
      // 删除现有角色
      await tx.userRole.deleteMany({
        where: { userId },
      });

      // 分配新角色
      await tx.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId,
          roleId,
          assignedBy,
        })),
      });
    });

    this.logger.log(`Roles assigned successfully to user: ${userId}`);

    return this.findOne(userId);
  }

  /**
   * 检查用户是否具有特定权限
   */
  async checkPermission(
    userId: string,
    resource: string,
    action: string,
  ): Promise<{ hasPermission: boolean }> {
    this.logger.debug(
      `Checking permission for user: ${userId}, ${resource}:${action}`,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { hasPermission: false };
    }

    // 检查是否有匹配的权限
    const hasPermission = user.roles.some((userRole) =>
      userRole.role.permissions.some(
        (rp) =>
          rp.permission.resource === resource && rp.permission.action === action,
      ),
    );

    return { hasPermission };
  }

  /**
   * 获取用户的所有权限
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    // 提取并去重权限
    const permissions = [
      ...new Set(
        user.roles.flatMap((userRole) =>
          userRole.role.permissions.map(
            (rp) => `${rp.permission.resource}:${rp.permission.action}`,
          ),
        ),
      ),
    ];

    return permissions;
  }
}
