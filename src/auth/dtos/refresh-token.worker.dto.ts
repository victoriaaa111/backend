import { IsString } from 'class-validator';

export class RefreshTokenWorkerDto {
  @IsString()
  refreshToken: string;
}
