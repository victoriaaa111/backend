import { Body, Controller, Get, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import mongoose from 'mongoose';

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
}
