import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class ServiceDto {
  @IsString()
  @IsOptional()
  id: null | string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  service: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
