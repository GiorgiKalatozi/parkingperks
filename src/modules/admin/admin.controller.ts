import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard())
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('assign/:userId')
  async assignAdminRole(@Param('userId') userId: string): Promise<void> {
    await this.adminService.assignAdminRole(userId);
  }

  @Delete('revoke/:userId')
  async revokeAdminRole(@Param('userId') userId: string): Promise<void> {
    await this.adminService.revokeAdminRole(userId);
  }
}
