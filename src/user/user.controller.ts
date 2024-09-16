import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { OrderDto } from './dto/order.dto';
import { ObjectId } from "mongoose";

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
}
