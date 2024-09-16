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
import mongoose, { ObjectId } from 'mongoose';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { OrderStatusDto } from "./dto/order.status.dto";

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
    await this.workerService.editOne(workerId, updateWorker);
    return { message: 'Worker updated successfully.', workerId };
  }

  @Get('/orders/:id')
  async findOrders(@Param('id') id: ObjectId) {
    return this.workerService.findOrders(id);
  }

  @Put('/executed-status-change/:id')
  async executedStatusChange(
    @Param('id') id: ObjectId,
    @Body() orderStatus: OrderStatusDto,
  ) {
    return this.workerService.executedStatusChange(id, orderStatus);
  }
}
