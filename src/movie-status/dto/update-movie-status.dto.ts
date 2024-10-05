import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieStatusDto } from './create-movie-status.dto';

export class UpdateMovieStatusDto extends PartialType(CreateMovieStatusDto) {}
