import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  tenantCode!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
