import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dtos/admin.login.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //TODO: POST Login
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.adminService.login(credentials);
  }
}
