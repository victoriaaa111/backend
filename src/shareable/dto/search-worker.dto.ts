import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class SearchWorkerDto {
  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @IsOptional()
  @IsString()
  sortOrder?: 'exact' | 'highToLow' | 'lowToHigh';
}
