import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieStatusDto } from './dto/create-movie-status.dto';
import { UpdateMovieStatusDto } from './dto/update-movie-status.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { isNumber } from 'util';

@Injectable()
export class MovieStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMovieStatusDto: CreateMovieStatusDto, user_id: string) {
    const recievedMovieStatus = await this.prisma.movieStatus.findFirst({
      where: {
        movie_id: createMovieStatusDto.movie_id,
        user_id: user_id,
      },
    });

    if (recievedMovieStatus) {
      throw new BadRequestException('Already exists!');
    }

    return await this.prisma.movieStatus.create({
      data: {
        movie_id: createMovieStatusDto.movie_id,
        user_id: user_id,
        status: createMovieStatusDto.status,
      },
    });
  }

  async findAll(skip?: number, take?: number, user_id?: string) {
    const receivedMovieStatus = await this.prisma.movieStatus.findMany({
      where: {
        user_id,
      },
      take: take ? take : undefined,
      skip: skip ? skip : undefined,
    });

    const totalCount = await this.prisma.movieStatus.count({
      where: {
        user_id,
      },
    });

    return {
      receivedMovieStatus: receivedMovieStatus,
      totalCount,
    };  
  }


  async findOne(id: string) {
    const receivedMovieStatus = await this.prisma.movieStatus.findUnique({
      where: {
        id: id,
      },
    });

    if (!receivedMovieStatus) {
      throw new BadRequestException('Does not exists');
    }
    return receivedMovieStatus;
  }

  async update(id: string, updateMovieStatusDto: UpdateMovieStatusDto) {
    const receivedMovieStatus = await this.prisma.movieStatus.findUnique({
      where: {
        id: id,
      },
    });

    if (!receivedMovieStatus) {
      throw new BadRequestException('Does not exists');
    }

    await this.prisma.movieStatus.update({
      where: {
        id,
      },
      data: {
        status: updateMovieStatusDto.status,
      },
    });
    return await this.prisma.movieStatus.findUnique({
      where: {
        id: id,
      },
    });;
  }

  async remove(id: string) {
    return await this.prisma.movieStatus.delete({
      where: {
        id,
      },
    });
  }
}
