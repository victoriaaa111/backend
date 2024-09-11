import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from '../auth/dtos/admin.login.dto';
import { AdminRefreshTokenDto } from '../auth/dtos/admin.refresh-token.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //todo: activate user
  // @Put('/user/activate')
  // async activateUser(@Body() id:string) {
  //   return this.adminService.activateUser(id);
  // }

  //todo: deactivate user
  // @Put('/user/deactivate')
  // async deactivateUser(@Body() id:string) {
  //   return this.adminService.deactivateUser(id);
  // }

  //todo: activate worker
  // @Put('/worker/activate')
  // async activateWorker(@Body() id: string) {
  //   return this.adminService.activateWorker(id);
  //}

  //todo: deactivate worker
  // @Put('/worker/deactivate')
  // async deactivateWorker(@Body() id: string) {
  //   return this.adminService.deactivateWorker(id);
  // }
}
