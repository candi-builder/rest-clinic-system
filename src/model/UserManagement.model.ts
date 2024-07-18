export class RegisterUserRequest {
	username: string;
	fullname: string;
	password: string;
	role: string;
}

export class UserResponse {
	uuid: string;
	username: string;
	fullname: string;
	role: string;
}
