import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { UserResponse } from 'src/model/UserManagement.model';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { UserManagementService } from './user-management.service';

@Controller('/api/users')
export class UserManagementController {
  constructor(private readonly userService: UserManagementService) {}
  @Get('/')
  @HttpCode(200)
  async get(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<BaseResponse<UserResponse[]>> {
    const users = await this.userService.getAllUsers(page, size);
    return users;
  }
}
