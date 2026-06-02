import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  organizationCode!: string;

  @IsEmail()
  email!: string;
}
