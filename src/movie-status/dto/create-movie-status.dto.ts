import { MovieStatusEnum } from "@prisma/client"
import { IsEnum, IsNumber, IsString } from "class-validator"

export class CreateMovieStatusDto {
    @IsNumber()
    movie_id: number

    @IsEnum(MovieStatusEnum)
    status: MovieStatusEnum
}
