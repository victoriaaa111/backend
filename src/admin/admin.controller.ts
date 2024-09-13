import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import mongoose from 'mongoose';
import { UpdateWorkerDto } from './dtos/update-worker.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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
}
