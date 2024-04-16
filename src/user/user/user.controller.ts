import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import { LoginRequest, RegisterUserRequest, UserResponse } from 'src/model/user.model';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register-user')
  async registerUser(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);

    return {
      data: result,
    };
  }

  @Post('/login')
    async login(@Body() request: LoginRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request);
    
        return {
        data: result,
        message: "Login Berhasil!",
        };
    }
}