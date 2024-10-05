import { Length } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegistrationDto extends LoginDto {
  @Length(2, 50)
    name: string;
}
