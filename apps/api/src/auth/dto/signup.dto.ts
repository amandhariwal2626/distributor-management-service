import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  tenantCode!: string;

  @IsEmail()
  email!: string;

  @IsString()
  fullName!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
