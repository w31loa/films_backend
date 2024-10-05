import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
    email: string;

  @Length(4, 100)
    password: string;
}
