import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class SearchWorkerDto {
    @IsOptional()
    @IsString()
    service?: string;

    // @IsOptional()
    // @IsString()
    // location?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    rating?: number;

    @IsOptional()
    @IsNumber()
    page: number = 1;

    @IsOptional()
    @IsNumber()
    limit: number = 10;

    @IsOptional()
    @IsString()
    sortOrder?: 'exact' | 'highToLow' | 'lowToHigh';
}
