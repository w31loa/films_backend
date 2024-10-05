import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import PrismaModule from 'src/common/prisma/prisma.module';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../common/strategies/jwt-refresh.strategy';
// import { MailModule } from 'src/common/services/mail';
import { JwtResetPasswordStrategy } from 'src/common/strategies/jwt-reset-password.strategy';

@Module({ 
  imports: [
    UserModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({}),

  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, JwtResetPasswordStrategy],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule {}
