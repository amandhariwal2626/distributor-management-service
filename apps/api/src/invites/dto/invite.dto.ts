import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResendInviteDto {
  @IsString()
  userId!: string;
}

export class AcceptInviteDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class CreateInviteDto {
  @IsEmail()
  email!: string;
}
