import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MovieStatusService } from './movie-status.service';
import { CreateMovieStatusDto } from './dto/create-movie-status.dto';
import { UpdateMovieStatusDto } from './dto/update-movie-status.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator.restapi';
import { ValidatedUser } from 'src/common/interfaces/validatedUser.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('movie-status')
export class MovieStatusController {
  constructor(private readonly movieStatusService: MovieStatusService) {}

  @Post()
  create(
    @Body() createMovieStatusDto: CreateMovieStatusDto,
    @CurrentUser() user: ValidatedUser,
  ) {
    return this.movieStatusService.create(createMovieStatusDto, user.id);
  }

  @Get()
  findAll(
    @Query('id') id?: string,
    @Query('skip') skip?: string|undefined,
    @Query('take') take?: string|undefined,
  ) {
    console.log(skip, take, id)
    return this.movieStatusService.findAll(+skip, +take, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieStatusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovieStatusDto: UpdateMovieStatusDto,
  ) {
    return this.movieStatusService.update(id, updateMovieStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieStatusService.remove(id);
  }
}
