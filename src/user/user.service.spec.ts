import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserService } from './user.service';

describe('UsersService', () => {
  let userService: UserService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn().mockReturnValue({
        id: 0,
        name: 'user',
        email: 'user@gmail.com',
        password: 'ajsdfjuas9df8y',
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => expect(userService).toBeDefined());

  it('findOneByEmail: should find one user by email.', async () => {
    await expect(userService.findOneByEmail('user@gmail.com')).resolves.toEqual(
      {
        id: 0,
        name: 'user',
        email: 'user@gmail.com',
        password: expect.any(String),
      },
    );
  });

  it('findOne: should find one user by id.', async () => {
    await expect(userService.findOne(0)).resolves.toEqual({
      id: 0,
      name: 'user',
      email: 'user@gmail.com',
      password: expect.any(String),
    });
  });
});
