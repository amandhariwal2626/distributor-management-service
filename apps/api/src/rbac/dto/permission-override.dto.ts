import { IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionOverrideDto {
  @ApiProperty({ description: 'Permission ID to override' })
  @IsUUID()
  permissionId!: string;

  @ApiProperty({ description: 'Whether to grant or revoke the permission' })
  @IsBoolean()
  granted!: boolean;
}
