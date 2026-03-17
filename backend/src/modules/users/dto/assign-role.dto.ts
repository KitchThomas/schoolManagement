/**
 * 分配角色 DTO
 * School Management Application Backend
 * 
 * @description 为用户分配角色的请求验证
 * @author 大河 & Team
 * @version 1.0.0
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    description: '要分配的角色ID列表',
    type: [String],
    example: ['role-id-1', 'role-id-2'],
  })
  @IsArray()
  @IsString({ each: true })
  roleIds: string[];
}
