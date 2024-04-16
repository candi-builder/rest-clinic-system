export class RegisterUserRequest {
  username: string;
  fullname: string;
  password: string;
  role: string;
}

export class PaginationData<T> {
  data: T[];
  page: number;
  size: number;
  total_page: number;
  total_data: number;
}

export class UserResponse {
  uuid: string;
  username: string;
  fullname: string;
  role: string;
}

export class BaseResponse<T> {
  data?: T;
  pagination?: PaginationData<T>;
  status_code: number;
  message: string;
}
