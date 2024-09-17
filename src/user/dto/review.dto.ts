import { IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString()
  userId: string;

  @IsString()
  orderId: string;

  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsString()
  comment: string;
}