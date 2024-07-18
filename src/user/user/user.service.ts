import {
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	Logger,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import {
	LoginRequest,
	RegisterUserRequest,
	UserResponse,
} from "src/model/user.model";
import { UserValidation } from "./user.validation";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { BaseResponse } from "src/model/BaseResponse.model";

@Injectable()
export class UserService {
	constructor(
		private validationService: ValidationService,
		private prismaService: PrismaService,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
	) {}

	async register(
		request: RegisterUserRequest,
	): Promise<BaseResponse<UserResponse>> {
		this.logger.debug(`Registering user ${request.username}`);

		try {
			const registerUserRequest: RegisterUserRequest =
				this.validationService.validate(UserValidation.REGISTER, request);

			const existingUser = await this.prismaService.user.findUnique({
				where: {
					username: request.username,
				},
			});

			if (existingUser) {
				throw new HttpException("Username already exists", 400);
			}

			const defaultPassword = "isvill15001";
			registerUserRequest.password = await bcrypt.hash(defaultPassword, 10);

			const user = await this.prismaService.user.create({
				data: {
					uuid: uuid(),
					username: registerUserRequest.username,
					password: registerUserRequest.password,
					roles: registerUserRequest.role,
					full_name: registerUserRequest.full_name,
				},
			});

			return {
				data: {
					uuid: user.uuid,
					username: user.username,
					password: user.password,
					role: user.roles,
					full_name: user.full_name,
				},
				status_code: HttpStatus.OK,
				message: "User berhasil ditambahkan",
			};
		} catch (error) {
			this.logger.debug(`Registering user ${JSON.stringify(error)}`);

			if (error instanceof ZodError) {
				const validationError = fromZodError(error);

				return {
					message: validationError.message,
					status_code: HttpStatus.BAD_REQUEST,
				};
			} else {
				throw error;
			}
		}
	}

	async login(request: LoginRequest): Promise<BaseResponse<UserResponse>> {
		this.logger.debug(`Logging in user ${JSON.stringify(request)}`);

		try {
			const loginRequest: LoginRequest = this.validationService.validate(
				UserValidation.LOGIN,
				request,
			);

			const user = await this.prismaService.user.findUnique({
				where: {
					username: loginRequest.username,
				},
			});

			if (!user) {
				throw new HttpException("User not register", 401);
			}

			/* Login Validation */
			const isPasswordValid = await bcrypt.compare(
				loginRequest.password,
				user.password,
			);

			this.logger.warn(
				`Requestnya hashed: ${loginRequest.password} dan password di db: ${user.password}`,
			);

			if (!isPasswordValid) {
				throw new HttpException(" password invalid", 401);
				// this.logger.error(`Password for user ${loginRequest.username} is invalid`)
			}

			return {
				data: {
					uuid: user.uuid,
					role: user.roles,
					full_name: user.full_name,
				},
				status_code: HttpStatus.OK,
				message: "User berhasil login",
			};
		} catch (error) {
			this.logger.debug(`Diagnosa create ${JSON.stringify(error)}`);

			if (error instanceof ZodError) {
				const validationError = fromZodError(error);

				return {
					message: validationError.message,
					status_code: HttpStatus.BAD_REQUEST,
				};
			} else {
				throw error;
			}
		}
	}
}
