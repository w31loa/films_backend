import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TokensInterface } from '../common/interfaces/tokens.interface';
import { RegistrationDto } from './dto/registration.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
// import { UserRoleModel } from 'src/user/roles/models/user-role';
// import { MailService } from 'src/common/services/mail';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    // private readonly mailService: MailService,
  ) {}

  async registration(
    registrationDto: RegistrationDto,
  ): Promise<TokensInterface> {
    const doesEmailExist = await this.prismaService.user.findFirst({ where: { email: registrationDto.email } });

    if (doesEmailExist) {
      throw new BadRequestException(`Email:${registrationDto.email} already exists.`);
    }

    const newUser = await this.userService.create({
      ...registrationDto
    });

    const payload = {
      email: newUser?.email,
      id: newUser?.id,
      name: newUser?.name,
    };

    return this.generateTokens(payload);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    const passwordMatches = user
      ? await bcrypt.compare(pass, user.password)
      : false;

    if (user && passwordMatches) {
      const { password, ...result } = user;

      return {
        ...result
      };
    }

    return null;
  }

  async login(
    user: Omit<User, 'password'> | undefined,
  ): Promise<TokensInterface> {
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const payload = {
      email: user?.email,
      id: user?.id,
      name: user?.name
    };

    return this.generateTokens(payload);
  }

  async refresh(user_id: string): Promise<TokensInterface> {
    const receivedUser: User | null = await this.userService.findOne(user_id);
    if (!receivedUser) {
      throw new ForbiddenException('User not found');
    }

    return this.generateTokens({
      email: receivedUser.email,
      id: receivedUser.id,
      name: receivedUser?.name,
    });
  }

  async forgotPassword(findEmail: string): Promise<void> {
    const receivedUser = await this.prismaService.user.findFirst({ 
      where: { email: findEmail}, 
    })

    if (!receivedUser) {
      throw new ForbiddenException('User not found');
    }

    const resetPasswordToken = await this.generateResetPasswordToken({
      email: receivedUser.email,
      id: receivedUser.id,
    });

    try {
      // await this.mailService.resetPassswordEmail(receivedUser, resetPasswordToken);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(`Forgot password error`);
    }
  }

  private async generateResetPasswordToken(payload: {
    id: string;
    email: string | null;
  }): Promise<string> {
    const resetPasswordToken: string = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('RESET_PASSWORD_JWT_SECRET'),
      expiresIn: '30m',
    });

    return resetPasswordToken;
  }

  async resetPassword(
    email: string,
    id: string,
    password: string,
  ): Promise<TokensInterface> {
    try {
      const receivedUser = await this.prismaService.user.findFirst({ 
        where: { email: email}, 
      })
  
      if (!receivedUser) {
        throw new ForbiddenException('Access denied!');
      }

      const hashPassword = await bcrypt.hash(password, 3);

      await this.prismaService.user.update({
        where: { id: receivedUser.id },
        data: {
          password:  hashPassword,
        },
      })

      return this.generateTokens({
        email,
        id: id,
        name: receivedUser.name
      });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(`Error reset password`);
    }
  }


  private async generateTokens(payload: {
    email: string;
    id: string;
    name: string | null;
  }): Promise<TokensInterface> {
    const [accessToken, refreshToken]: [string, string] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '60m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
