import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    this.setRefreshCookie(res, result.refreshToken, result.sessionId);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() dto: SignupDto) {
    const user = await this.authService.signup(dto);
    return { user };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const sessionId = req.cookies?.sessionId as string | undefined;
    if (!refreshToken || !sessionId) {
      throw new UnauthorizedException('Missing refresh credentials');
    }
    const result = await this.authService.refresh(sessionId, refreshToken);
    this.setRefreshCookie(res, result.refreshToken, sessionId);
    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies?.sessionId as string | undefined;
    if (sessionId) {
      await this.authService.logout(sessionId);
    }
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    return { message: 'Logged out' };
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);
    return {
      message: 'If the account exists, reset instructions were generated.',
    };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: 'Password reset successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user: { sub: string } }) {
    return this.authService.me(req.user.sub);
  }

  private setRefreshCookie(
    res: Response,
    refreshToken: string,
    sessionId: string,
  ): void {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
