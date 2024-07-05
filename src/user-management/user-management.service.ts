import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { BaseResponse, PaginationData } from 'src/model/BaseResponse.model';
import { UserResponse } from 'src/model/UserManagement.model';
import { ZodError, any } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { UserManagementRequest, UserManagementResponse } from './user-management.model';
import * as bcrypt from 'bcrypt';
import { ValidationService } from 'src/common/validation.service';
import { UserManagementValidation } from './user-management.validation';

@Injectable()
export class UserManagementService {
  constructor(private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

  async getAllUsers(
    page: number,
    size: number,
  ): Promise<BaseResponse<UserResponse[]>> {
    
    const totalCount = await this.prismaService.user.count();
    const totalPages = Math.ceil(totalCount / size);

    try{
    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * size,
      take: size,
      select: {
        uuid: true,
        username: true,
        full_name: true,
        roles: true,
      },
      where: {
        roles:{
          not: "SUPERADMIN"
        }
      }
    });

    const userResponses: UserResponse[] = users.map((user) => ({
      uuid: user.uuid,
      username: user.username,
      fullname: user.full_name,
      role: user.roles,
    }));

    const paginationData: PaginationData = {
      page,
      size,
      total_page: totalPages,
      total_data: totalCount,
    };

    return {
      data: userResponses,
      pagination: paginationData,
      status_code: 200,
      message: 'success',
    };
  }catch (error) {
    this.logger.debug(`get all users  ${JSON.stringify(error)}`);

    if (error instanceof ZodError) {
      const validationError = fromZodError(error);

      return {
        message: validationError.message,
        status_code: HttpStatus.BAD_REQUEST,
      };
    } else {

      throw error;
      }
  }
  }

  async getDetailUser(uuid: string): Promise<BaseResponse<UserResponse>> {

    try{
    const user = await this.prismaService.user.findUnique({
      where: {
        uuid: uuid,
      },
    });
    if (!user) {
      return {
        data: null,
        status_code: 404,
        message: 'user tidak ditemukan',
      };
    }
    const userResponses: UserResponse = {
      uuid: user.uuid,
      username: user.username,
      role: user.roles,
      fullname: user.full_name,
    };

    return {
      data: userResponses,
      status_code: 200,
      message: 'success',
    };
  }catch (error) {
    this.logger.debug(`get detail user ${JSON.stringify(error)}`);

    if (error instanceof ZodError) {
      const validationError = fromZodError(error);

      return {
        message: validationError.message,
        status_code: HttpStatus.BAD_REQUEST,
      };
    } else {

      throw error;
      }
  }
  }

  async deleteUser(uuid: string): Promise<BaseResponse<string>> {
    try {
      const deleteUser = await this.prismaService.user.delete({
        where: {
          uuid: uuid,
        },
      });

      if (!deleteUser) {
        return {
          data: null,
          status_code: 400,
          message: 'Gagal menghapus user',
        };
      }

      return {
        data: null,
        status_code: 200,
        message: `Berhasil menghapus ${deleteUser.full_name}`,
      };
    } catch (error) {
      return {
        data: null,
        status_code: 500,
        message: `Gagal menghapus user: ${error.message}`,
      };
    }
  }

  async changePassword(uuid: string, request: UserManagementRequest): Promise<BaseResponse<UserManagementResponse>> {
    console.log(uuid);
    try {
      const changePasswordRequest = this.validationService.validate(UserManagementValidation.CHANGE_PASSWORD, request);
      console.log(changePasswordRequest.password);

      const checkPasien = await this.prismaService.user.findUnique({
        where: {
          uuid: uuid,
        },
      });

      if (!checkPasien) {
        return {
          status_code: HttpStatus.NOT_FOUND,
          message: 'User Tidak Ditemukan',
        };
      }

      


      await this.prismaService.user.update({
        where: {
          uuid: uuid,
        },
        data: {
          password: await bcrypt.hash(changePasswordRequest.password, 10),
        },
      });

      return{
        data: {
          username: checkPasien.username,
          role: checkPasien.roles,
        },
        status_code: 200,
        message: 'Password Berhasil Diubah',
      };

      
    } catch (error) {
      this.logger.debug(`Registering passien ${JSON.stringify(error)}`);

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
