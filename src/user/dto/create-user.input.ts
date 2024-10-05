import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserInput {
  @IsEmail()
    email: string;

  @IsString()
  @Length(4, 100)
    password: string;

}
