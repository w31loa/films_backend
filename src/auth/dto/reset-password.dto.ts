import { Length } from "class-validator";

export class ResetPasswordDto {
    @Length(4, 100)
    password: string;
  
    token: string;
  }
  