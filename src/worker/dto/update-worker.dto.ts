import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateWorkerDto {
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsPhoneNumber('MD')
  contact?: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(24)
  @Min(0)
  startWork?: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(24)
  @Min(0)
  endWork?: number;
}
