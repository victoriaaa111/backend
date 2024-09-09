import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './schemas/admin.schema';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async getAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }
}
