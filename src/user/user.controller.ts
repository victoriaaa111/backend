import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { OrderDto } from './dto/order.dto';
import { ObjectId } from 'mongoose';
import { TimeDto } from './dto/time.dto';
import { IdDto } from './dto/userId.dto';
import { ReviewDto } from './dto/review.dto';
import { plainToClass } from 'class-transformer';
import { WorkerDto } from '../worker/dto/exclusion.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post('/create-order')
  async createOrder(@Body() orderInfo: OrderDto) {
    return this.userService.createOrder(orderInfo);
  }

  @Get('/orders/:id')
  async findOrders(@Param('id') id: ObjectId) {
    return this.userService.findOrders(id);
  }

  @Put('/cancel-order/:id')
  async cancelOrder(@Param('id') id: ObjectId, @Body() userId: IdDto) {
    return this.userService.cancelOrder(id, userId);
  }

  @Get('worker/availability/:id')
  async findWorkerAvailability(
    @Param('id') id: ObjectId,
    @Body() date: TimeDto,
  ) {
    return this.userService.findWorkerAvailability(id, date);
  }

  @Post('add-review')
  async addReview(@Body() reviewInfo: ReviewDto) {
    return this.userService.addReview(reviewInfo);
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
}
