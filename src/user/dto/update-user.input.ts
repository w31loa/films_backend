import {
  IsBoolean,
  IsEmail, IsNumber, IsOptional, IsString, Length,
} from 'class-validator';

export class UpdateUserInput {
  @IsOptional()
  
    name?: string;

  @IsOptional()
  @IsEmail()
  
    email?: string;

  @IsOptional()
  @IsString()
  @Length(4, 100)
  
    newPassword?: string;

  @IsOptional()
  @IsString()
  @Length(4, 100)
  
    password?: string;

  @IsOptional()
  @IsNumber()
  
    currency_id: number | null;

  @IsOptional()
  @IsNumber()
  
    document_id?: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  
  array_of_delivery_ids: number[];

  @IsOptional()
  @IsString()
  
    user_name?: string;
}
