import { IsEmail } from 'class-validator';

export class ForgotPasswordWorkerDto {
    @IsEmail()
    email: string;
}
