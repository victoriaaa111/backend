import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupWorkerDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  contact: number;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character',
  })
  password: string;
}
