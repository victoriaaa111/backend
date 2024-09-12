import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerDto } from './dto/exclusion.dto';
import { plainToClass } from 'class-transformer';
import mongoose from 'mongoose';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('add/:workerId')
  async addService(
    @Param('workerId') workerId: string,
    @Body()
    serviceData: {
      id: string;
      service: string;
      description: string;
      price: number;
    },
  ) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(workerId);

      return this.workerService.addService(userObjectId, serviceData);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete(':workerId/service/:serviceId')
  async deleteServiceFromWorker(
    @Param('workerId') workerId: string,
    @Param('serviceId') service: string,
  ) {
    await this.workerService.deleteServiceFromWorker(workerId, service);
    return { message: 'Service deleted successfully.' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const worker = await this.workerService.findOne(id);

    // Transform the worker object to WorkerDto
    return plainToClass(WorkerDto, worker, {
      excludeExtraneousValues: true,
    });
  }

  @Put('edit/:workerId')
  async editOne(
    @Param('workerId') workerId: string,
    @Body() updateWorker: UpdateWorkerDto,
  ) {
    const worker = await this.workerService.editOne(workerId, updateWorker);
    return { message: 'Worker updated successfully.', workerId };
  }

  //
  // @Get()
  // findAll() {
  //   return this.workerService.findAll();
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
  //   return this.workerService.update(+id, updateWorkerDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.workerService.remove(+id);
  // }
}
