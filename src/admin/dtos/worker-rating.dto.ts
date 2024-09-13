import {
    IsNumber,
    Min,
    Max,
} from 'class-validator';

export class UpdateRatingDto {

    @IsNumber()
    @Max(5)
    @Min(1)
    rating: number;

}