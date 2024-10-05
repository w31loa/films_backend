import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import config from '../common/config';
import { User } from '../user/models/user.model';
import { TokensInterface } from '../common/interfaces/tokens.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let user: User;

  beforeEach(async () => {
    user = {
      id: 1,
      email: 'john@john.ru',
      password: (await bcrypt.hash('1234', 10)) as string,
      name: 'john',
    };
    const mockPrisma = {
      user: {
        findFirst: jest.fn().mockReturnValue(user),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(config),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_ACCESS_SECRET'),
            signOptions: { expiresIn: '60m' },
          }),
          inject: [ConfigService],
        }),
        PassportModule,
      ],
      providers: [
        JwtStrategy,
        AuthService,
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        ConfigService,
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => expect(authService).toBeDefined());

  it('login: should give access and refresh token.', async () => {
    expect(
      await authService.login({
        id: 1,
        name: 'john',
        email: 'john@john.ru',
      }),
    ).toEqual<TokensInterface>({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });

  it('validateUser: should validate user.', async () => {
    expect(await authService.validateUser('john@john.ru', '1234')).toEqual({
      id: 1,
      name: 'john',
      email: 'john@john.ru',
    });
  });

  it('refresh: should give access and refresh tokens.', async () => {
    expect(await authService.refresh(1)).toEqual<TokensInterface>({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });
});
