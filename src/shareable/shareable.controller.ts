import {
  Controller,
  Get,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ShareableService } from './shareable.service';
import { SearchWorkerDto } from './dto/search-worker.dto';
import { plainToClass } from 'class-transformer';
import { WorkerDto } from '../worker/dto/exclusion.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('shareable')
export class ShareableController {
  constructor(private readonly shareableService: ShareableService) {}

  @Get('search')
  async searchWorkers(@Body() searchWorkerDto: SearchWorkerDto) {
    try {
      const workers =
        await this.shareableService.searchWorkers(searchWorkerDto);

      // Transform the array of workers to an array of WorkerDto
      return workers.map((worker) =>
        plainToClass(WorkerDto, worker, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
