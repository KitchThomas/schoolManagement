/**
 * 用户控制器
 * School Management Application Backend
 * 
 * @description 处理用户管理相关的 HTTP 请求
 * @author 大河 & Team
 * @version 1.0.0
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AssignRoleDto } from './dto';
import { CurrentUser, UserInfo, Roles, Permissions } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  /**
   * 创建用户（管理员）
   * POST /users
   */
  @Post()
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles('ADMIN')
  @Permissions('user:create')
  @ApiOperation({ summary: '创建用户', description: '管理员创建新用户' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '创建成功' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '邮箱已存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: UserInfo,
  ) {
    this.logger.log(`User creation requested by: ${user.email}`);
    return this.usersService.create(createUserDto, user.id);
  }

  /**
   * 获取用户列表
   * GET /users
   */
  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('user:read')
  @ApiOperation({ summary: '获取用户列表', description: '分页查询用户列表' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(page, limit, status, search);
  }

  /**
   * 获取当前用户信息
   * GET /users/me
   */
  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息', description: '获取已登录用户的详细信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  async getCurrentUser(@CurrentUser() user: UserInfo) {
    return this.usersService.findOne(user.id);
  }

  /**
   * 获取用户详情
   * GET /users/:id
   */
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('user:read')
  @ApiOperation({ summary: '获取用户详情', description: '根据ID获取用户详细信息' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户不存在' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * 更新用户信息
   * PUT /users/:id
   */
  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('user:update')
  @ApiOperation({ summary: '更新用户信息', description: '更新指定用户的信息' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '更新成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户不存在' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '邮箱已被使用' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: UserInfo,
  ) {
    this.logger.log(`User update requested by: ${user.email} for user: ${id}`);
    return this.usersService.update(id, updateUserDto, user.id);
  }

  /**
   * 删除用户
   * DELETE /users/:id
   */
  @Delete(':id')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles('ADMIN')
  @Permissions('user:delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除用户', description: '软删除指定用户（仅管理员）' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '删除成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  async remove(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    this.logger.log(`User deletion requested by: ${user.email} for user: ${id}`);
    return this.usersService.remove(id);
  }

  /**
   * 为用户分配角色
   * POST /users/:id/roles
   */
  @Post(':id/roles')
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles('ADMIN')
  @Permissions('user:assign-role')
  @ApiOperation({ summary: '分配角色', description: '为用户分配角色（仅管理员）' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '分配成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户或角色不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  async assignRoles(
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleDto,
    @CurrentUser() user: UserInfo,
  ) {
    this.logger.log(`Role assignment requested by: ${user.email} for user: ${id}`);
    return this.usersService.assignRoles(id, assignRoleDto, user.id);
  }

  /**
   * 检查用户权限
   * GET /users/:id/permissions/check
   */
  @Get(':id/permissions/check')
  @UseGuards(PermissionsGuard)
  @Permissions('user:read')
  @ApiOperation({ summary: '检查权限', description: '检查用户是否具有特定权限' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiQuery({ name: 'resource', required: true, type: String })
  @ApiQuery({ name: 'action', required: true, type: String })
  @ApiResponse({ status: HttpStatus.OK, description: '检查完成' })
  async checkPermission(
    @Param('id') id: string,
    @Query('resource') resource: string,
    @Query('action') action: string,
  ) {
    return this.usersService.checkPermission(id, resource, action);
  }

  /**
   * 获取用户的所有权限
   * GET /users/:id/permissions
   */
  @Get(':id/permissions')
  @UseGuards(PermissionsGuard)
  @Permissions('user:read')
  @ApiOperation({ summary: '获取用户权限', description: '获取用户的所有权限列表' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  async getUserPermissions(@Param('id') id: string) {
    const permissions = await this.usersService.getUserPermissions(id);
    return { userId: id, permissions };
  }
}
