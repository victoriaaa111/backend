import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateWorkerDto } from './dtos/update-worker.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateRatingDto } from './dtos/worker-rating.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ObjectId } from 'mongoose';
import { OrderStatusDto } from "../worker/dto/order.status.dto";
import { UpdatedHoursDto } from "./dtos/updated-hours.dto";

@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //change status user
  @Put('/user/change-status')
  async changeStatusUser(@Body('id') id: string) {
    return this.adminService.changeStatusUser(id);
  }

  //change status worker
  @Put('/worker/change-status')
  async changeStatusWorker(@Body('id') id: string) {
    return this.adminService.changeStatusWorker(id);
  }

  //get all users from database
  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  //get all workers from database
  @Get('workers')
  async getWorkers() {
    return this.adminService.getWorkers();
  }

  @Put('/worker/update/:id')
  async updateWorker(
    @Param('id') id: string,
    @Body() updatedWorker: UpdateWorkerDto,
  ) {
    return this.adminService.updateWorker(id, updatedWorker);
  }

  @Put('/user/update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updatedUser: UpdateUserDto,
  ) {
    return this.adminService.updateUser(id, updatedUser);
  }

  @Put('/worker/update-rating/:id')
  async updateRating(
    @Param('id') id: string,
    @Body() updateRating: UpdateRatingDto,
  ) {
    return this.adminService.updateRating(id, updateRating);
  }

  @Get('/reviews/:id')
  async getReviews(@Param('id') id: ObjectId) {
    return this.adminService.getReviews(id);
  }

  @Get('/workers-with-no-rating')
  async getWorkersWith0Rating() {
    return this.adminService.getWorkersWith0Rating();
  }

  @Put('/edit/review/:id')
  async editReview(
    @Param('id') id: ObjectId,
    @Body() updatedRating: UpdateRatingDto,
  ) {
    return this.adminService.editReview(id, updatedRating);
  }

  @Delete('/delete/review/:id')
  async deleteReview(@Param('id') id: ObjectId) {
    return this.adminService.deleteReview(id);
  }

  @Get('/orders')
  async getOrders() {
    return this.adminService.getOrders();
  }

  @Put('/order/change-status/:id')
  async changeStatusOrder(
    @Param('id') id: string,
    @Body() updatedStatus: OrderStatusDto,
  ) {
    return this.adminService.changeStatusOrder(id, updatedStatus);
  }

  @Put('/order/reschedule/:id')
  async rescheduleOrder(
    @Param('id') id: ObjectId,
    @Body() updatedHours: UpdatedHoursDto,
  ) {
    return this.adminService.rescheduleOrder(id, updatedHours);
  }
}
