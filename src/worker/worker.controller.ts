import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import mongoose from 'mongoose';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  // @Post('create-worker')
  // create(@Body() createWorker: CreateWorkerDto) {
  //   return this.workerService.create(createWorker);
  // }
  @Post()
  async create(@Body() workerDetails: CreateWorkerDto) {
    return this.workerService.create(workerDetails);
  }

  @Post('add/:userId')
  async addService(
    @Param('userId') userId: string,
    @Body() serviceData: { service: string; price: number },
  ) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      return this.workerService.addService(userObjectId, serviceData);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete(':userId/service/:service')
  async deleteServiceFromWorker(
    @Param('userId') userId: string,
    @Param('service') service: string,
  ) {
    return this.workerService.deleteServiceFromWorker(userId, service);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workerService.findOne(id);
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
