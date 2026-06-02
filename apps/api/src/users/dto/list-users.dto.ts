import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'SUSPENDED';

  @IsOptional()
  @IsIn([
    'fullName',
    'email',
    'createdAt',
    'firstName',
    'lastName',
    'userCode',
    'status',
    'lastLoginAt',
  ])
  sortBy:
    | 'fullName'
    | 'email'
    | 'createdAt'
    | 'firstName'
    | 'lastName'
    | 'userCode'
    | 'status'
    | 'lastLoginAt' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}
