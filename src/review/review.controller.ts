import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator.restapi';
import { ValidatedUser } from 'src/common/interfaces/validatedUser.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: ValidatedUser

  ) {
    return this.reviewService.create(createReviewDto, user.id);
  }

  @Get()
  findAll(
    @Param('id') id: string,
    @Param('skip') skip: string,
    @Param('take') take: string
  ) {
    return this.reviewService.findAll(+skip, +take, id);
  }

  @Get(':id') 
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
