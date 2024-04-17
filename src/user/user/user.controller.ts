import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from 'src/model/web.model';
import {
  LoginRequest,
  RegisterUserRequest,
  UserResponse,
} from 'src/model/user.model';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('api/register-user')
  async registerUser(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {

    try{
      const result = await this.userService.register(request);

      return {
        message: `User registered as ${result.role}`
      };
    }
    catch(error){
      return {
        
        message: error.issues[0]
      };
    }
  }
    
   

  @Post('api/login')
  async login(
    @Body() request: LoginRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
      message: 'Login Berhasil!',
    };
  }
}
