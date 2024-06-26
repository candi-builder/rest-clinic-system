import {
  Controller,
  Get,
  HttpCode,
  Query,
  Param,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { UserResponse } from 'src/model/UserManagement.model';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { UserManagementService } from './user-management.service';
import { UserManagementRequest, UserManagementResponse } from './user-management.model';

@Controller('users')
export class UserManagementController {
  constructor(private readonly userService: UserManagementService) {}
  @Get()
  @HttpCode(200)
  async get(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<BaseResponse<UserResponse[]>> {
    const users = await this.userService.getAllUsers(page, size);
    return users;
  }

  @Get(':uuid')
  @HttpCode(200)
  async getDetail(
    @Param() params: { uuid: string },
  ): Promise<BaseResponse<UserResponse>> {
    const user = await this.userService.getDetailUser(params.uuid);
    return user;
  }

  @Delete(':uuid')
  @HttpCode(200)
  async delete(
    @Param() params: { uuid: string },
  ): Promise<BaseResponse<string>> {
    const user = await this.userService.deleteUser(params.uuid);
    return user;
  }

  @Put(':uuid')
  @HttpCode(200)
 async changePassword(
  @Param() params: { uuid: string },
  @Body() request: UserManagementRequest
 ) : Promise<BaseResponse<UserManagementResponse>> {
  const user = await this.userService.changePassword(params.uuid, request);
  return user;
 }
}
