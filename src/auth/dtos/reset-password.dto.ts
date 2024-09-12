import { IsString } from 'class-validator';
import { Matches, MinLength } from 'class-validator';
export class ResetPasswordDto {
  @IsString()
  resetToken: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/, {
    message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character',
  })
  newPassword: string;
}