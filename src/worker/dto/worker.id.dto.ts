import { IsString } from 'class-validator';

export class WorkerIdDto {
  @IsString()
  userId: string;
}
