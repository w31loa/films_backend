import { IsNumber, IsString, Max, Min } from "class-validator"

export class CreateReviewDto {
    @IsNumber()
    movie_id: number

    @IsString()
    description : string

    @IsNumber()
    @Min(0)       
    @Max(10)
    rating : number
}
