import { IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsPhoneNumber()
  contact?: number;
}
