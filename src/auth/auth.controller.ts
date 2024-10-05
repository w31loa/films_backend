import {
  Controller, UseGuards, Post, Req, Body,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { TokensInterface } from '../common/interfaces/tokens.interface';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/interfaces/jwtPayload.interface';
import { RegistrationDto } from './dto/registration.dto';
import { JwtResetPasswordGuard } from 'src/common/guards/jwt-reset-password.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ValidatedUser } from 'src/common/interfaces/validatedUser.interface';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  async registration(
    @Body() registrationDto: RegistrationDto,
  ): Promise<TokensInterface> {
    return this.authService.registration(registrationDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request): Promise<TokensInterface> {
    console.log(req)
    return this.authService.login(req.user as User);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request): Promise<TokensInterface> {
    const { id } = req.user as JwtPayload;
    return this.authService.refresh(id);
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @UseGuards(JwtResetPasswordGuard)
  @Post('reset-password')
  resetPassword(
    @Req() req: Request,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<TokensInterface> {
    const { email, id } = req.user as ValidatedUser;

    return this.authService.resetPassword(email, id, resetPasswordDto.password);
  }

}
