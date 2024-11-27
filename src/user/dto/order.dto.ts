import { IsDate, IsPhoneNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDto {
  @IsString()
  serviceId: string;

  @IsPhoneNumber('MD')
  userContact: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  description: string;
}
