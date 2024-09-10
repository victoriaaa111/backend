import { IsEmail, IsNumber, IsPhoneNumber, IsString } from "class-validator";

export class WorkerProfileDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsPhoneNumber()
  contact: number;
  @IsNumber()
  rating: number;
}
