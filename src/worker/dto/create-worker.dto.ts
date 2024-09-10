import { IsNotEmpty, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CreateServiceDto {
  @IsNotEmpty()
  service: string;

  @IsNumber()
  price: number;
}

export class CreateWorkerDto {
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  contact: number;

  @IsNumber()
  rating: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  services: CreateServiceDto[];
}
