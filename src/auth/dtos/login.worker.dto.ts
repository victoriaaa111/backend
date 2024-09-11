import { IsEmail, IsString } from 'class-validator';

export class LoginWorkerDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
