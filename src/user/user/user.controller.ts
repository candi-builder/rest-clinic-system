import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import {
  LoginRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { BaseResponse } from 'src/model/BaseResponse.model';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register-user')
  async registerUser(
    @Body() request: RegisterUserRequest,
  ): Promise<BaseResponse<UserResponse>> {
    try {
      const result = await this.userService.register(request);

      return result;
    } catch (error) {
      return error;
    }
  }

  @Post('/login')
  async login(
    @Body() request: LoginRequest,
  ): Promise<WebResponse<UserResponse>> {
    try {
      const result = await this.userService.login(request);
      return result
    } catch(error) {
     return error
    }
  }
}
