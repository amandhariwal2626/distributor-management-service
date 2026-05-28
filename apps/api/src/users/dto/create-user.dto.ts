import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  roleIds!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionOverrides?: string[];
}

export class AcceptInviteDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
