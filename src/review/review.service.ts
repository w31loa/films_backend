import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { isNumber } from 'class-validator';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, user_id: string) {
    const recievedMovieStatus = await this.prisma.review.findFirst({
      where: {
        movie_id: createReviewDto.movie_id,
        user_id: user_id,
      },
    });

    if (recievedMovieStatus) {
      throw new BadRequestException('Already exists!');
    }

    return await this.prisma.review.create({
      data: {
        movie_id: createReviewDto.movie_id,
        user_id: user_id,
        description: createReviewDto.description,
        rating: createReviewDto.rating,
      },
    });
  }

  async findAll(skip?: number, take?: number, user_id?: string) {
    const receivedReviews = await this.prisma.review.findMany({
      where: {
        user_id,
      },
      take: isNumber(take) ? take : undefined,
      skip: isNumber(skip) ? skip : undefined,
    });

    const totalCount = this.prisma.review.count({
      where: {
        user_id,
      },
    });

    return {
      receivedReviews,
      totalCount,
    };
  }

  async findOne(id: string) {
    const receivedReview = await this.prisma.review.findFirst({
      where: {
        id,
      },
    });

    if (!receivedReview) {
      throw new BadRequestException('Does not exists');
    }

    return receivedReview;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const receivedReview = await this.prisma.review.findFirst({
      where: {
        id,
      },
    });

    if (!receivedReview) {
      throw new BadRequestException('Does not exists');
    }

    await this.prisma.review.update({
      where: {
        id,
      },
      data: {
        ...updateReviewDto,
      },
    });

    return await this.prisma.review.findFirst({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
