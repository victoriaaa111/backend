import { IsDate} from 'class-validator';
import { Type } from 'class-transformer';

export class TimeDto {
  @IsDate()
  @Type(() => Date)
  date: Date;
}
