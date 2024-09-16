import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString, Max, Min
} from "class-validator";

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  contact?: number;

  @IsOptional()
  @IsNumber()
  @Max(24)
  @Min(0)
  startWork?: number;

  @IsOptional()
  @IsNumber()
  @Max(24)
  @Min(0)
  endWork?: number;
}
