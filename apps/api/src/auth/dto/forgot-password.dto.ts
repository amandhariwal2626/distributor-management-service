import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  tenantCode!: string;

  @IsEmail()
  email!: string;
}
