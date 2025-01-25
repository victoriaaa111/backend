import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerDto } from './dto/exclusion.dto';
import { plainToClass } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { OrderStatusDto } from './dto/order.status.dto';
import { ServiceDto } from './dto/service.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('service')
  async addService(
    @Req() request: Request,
    @Body()
    serviceData: ServiceDto,
  ) {
    const id = (request as any).userId; // Now TypeScript recognizes `userId`
    if (!id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    try {
      const userObjectId = new mongoose.Types.ObjectId(id);

      return this.workerService.addService(userObjectId, serviceData);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete('/service')
  async deleteServiceFromWorker(
    @Req() request: Request,
    @Body('serviceId') service: string,
  ) {
    const id = (request as any).userId; // Now TypeScript recognizes `userId`
    if (!id) {
      throw new UnauthorizedException('User ID not found in request');
    }

    await this.workerService.deleteServiceFromWorker(id, service);
    return { message: 'Service deleted successfully.' };
  }

  @Get()
  async findOne(@Req() request: Request) {
    const id = (request as any).userId; // Now TypeScript recognizes `userId`
    if (!id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    const worker = await this.workerService.findOne(id);

    // Transform the worker object to WorkerDto
    // return worker;
    return plainToClass(WorkerDto, worker, {
      excludeExtraneousValues: true,
    });
  }

  @Put()
  async editOne(
    @Req() request: Request,
    @Body() updateWorker: UpdateWorkerDto,
  ) {
    const id = (request as any).userId; // Now TypeScript recognizes `userId`
    if (!id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    await this.workerService.editOne(id, updateWorker);
    return { message: 'Worker updated successfully.', id };
  }

  @Get('/orders')
  async findOrders(@Req() request: Request) {
    const id = (request as any).userId; // Now TypeScript recognizes `userId`
    if (!id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    return this.workerService.findOrders(id);
  }

  @Put('/orders')
  async executedStatusChange(
    @Body('OrderId') id: ObjectId,
    @Body() orderStatus: OrderStatusDto,
  ) {
    return this.workerService.executedStatusChange(id, orderStatus);
  }

  @Get('/reviews/:id')
  async getReviews(@Param('id') id: ObjectId) {
    return this.workerService.getReviews(id);
  }
}
