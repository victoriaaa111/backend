import { IsEnum } from 'class-validator';

export class OrderStatusDto {
  @IsEnum(['Pending', 'Declined', 'In Progress', 'Done', 'Canceled'], {
    message:
      'status must be one of the following values: [Pending, Declined, In Progress, Done]',
  })
  status: string;
}
