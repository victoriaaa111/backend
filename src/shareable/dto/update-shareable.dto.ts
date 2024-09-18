import { PartialType } from '@nestjs/mapped-types';
import { CreateShareableDto } from './create-shareable.dto';

export class UpdateShareableDto extends PartialType(CreateShareableDto) {}
