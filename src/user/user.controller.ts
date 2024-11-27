import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { OrderDto } from './dto/order.dto';
import { ObjectId } from 'mongoose';
import { TimeDto } from './dto/time.dto';
import { ReviewDto } from './dto/review.dto';
import { plainToClass } from 'class-transformer';
import { WorkerDto } from '../worker/dto/exclusion.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('workers')
  async getWorkers() {
    return this.userService.getWorkers();
  }

  @Get()
  async findOne(@Req() request: Request) {
    const id = (request as any).userId; // Now TypeScript recognizes `userId`
    if (!id) {
      throw new UnauthorizedException('User ID not found in request');
    }
    return this.userService.findOne(id);
  }

  @Post('/orders')
  async createOrder(@Body() orderInfo: OrderDto, @Req() request: Request) {
    const id = (request as any).userId;
    return this.userService.createOrder(orderInfo, id);
  }

  @Get('/orders')
  async findOrders(@Req() request: Request) {
    const id = (request as any).userId;
    return this.userService.findOrders(id);
  }

  @Put('/orders')
  async cancelOrder(@Body('orderId') orderId: string, @Req() request: Request) {
    const id = (request as any).userId;
    return this.userService.cancelOrder(orderId, id);
  }

  @Get('worker/availability/:id')
  async findWorkerAvailability(
    @Param('id') id: ObjectId,
    @Body() date: TimeDto,
  ) {
    return this.userService.findWorkerAvailability(id, date);
  }

  @Post('add-review')
  async addReview(@Body() reviewInfo: ReviewDto, @Req() request: Request) {
    const id = (request as any).userId;
    return this.userService.addReview(reviewInfo, id);
  }

  @Get('/worker/:id')
  async findWorker(@Param('id') id: string) {
    const worker = await this.userService.findWorker(id);

    // Transform the worker object to WorkerDto
    // return worker;
    return plainToClass(WorkerDto, worker, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/favorites')
  async addFavorite(
    @Req() request: Request,
    @Body('workerId') workerId: string,
  ) {
    const id = (request as any).userId;
    return this.userService.addFavorite(id, workerId);
  }

  @Delete('/favorites')
  async deleteFavorite(
    @Req() request: Request,
    @Body('workerId') workerId: string,
  ) {
    const id = (request as any).userId;
    return this.userService.deleteFavorite(id, workerId);
  }
}
