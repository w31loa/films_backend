import { Injectable, BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Prisma, User } from '@prisma/client';
// import { BannedUserInput } from './dto/banned-user.input';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const {...createUserDto} = createUserInput;
    const hashPassword = await bcrypt.hash(createUserInput.password, 3);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashPassword,

      },
    });
  }



  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(
    user_id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User | null> {
    const receivedUser = await this.findOne(user_id);

    if (!receivedUser) {
      throw new NotFoundException('User not found!');
    }

    let newPasswordHash: string | undefined
    if(updateUserInput.newPassword && updateUserInput.password) {
      const doesPasswordMatches = await bcrypt.compare(
        updateUserInput.password,
        receivedUser.password,
      );
  
      if (!doesPasswordMatches) {
        throw new BadRequestException('Wrong passwords.');
      }
  
      newPasswordHash = await bcrypt.hash(updateUserInput.newPassword, 3);
    }
  
    const { newPassword, password, ...newUpdateUserInput } = updateUserInput;

    await this.prisma.user.update({
      where: { id: user_id },
      data: {
        ...newUpdateUserInput,
        password: newPasswordHash ? newPasswordHash : receivedUser.password,
      },
    });
    
    return this.prisma.user.findUnique({ where: { id: user_id } });
  }


  async getProfile(id: string): Promise<User | null> {
    const user: User | null = await this.findOne(id);

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }
}
