import { Role } from '@prisma/client';

export class RegisterUserRequest {
  uuid: string;
  username: string;
  password: string;
  role: Role;
  full_name: string;
}

export class UserResponse {
  uuid: string;
  username?: string;
  password?: string;
  role: Role;
  full_name?: string;
}

export class LoginRequest {
  username: string;
  password: string;
}
