import {
  IsEmail, IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email?: string;
}
