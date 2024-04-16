import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BaseResponse, PaginationData } from 'src/model/BaseResponse.model';
import { UserResponse } from 'src/model/UserManagement.model';

@Injectable()
export class UserManagementService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers(
    page: number,
    size: number,
  ): Promise<BaseResponse<UserResponse[]>> {
    const totalCount = await this.prismaService.user.count();
    const totalPages = Math.ceil(totalCount / size);

    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * size,
      take: size,
      select: {
        uuid: true,
        username: true,
        full_name: true,
        roles: true,
      },
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
  }

  async getDetailUser(uuid: string): Promise<BaseResponse<UserResponse>> {
    const users = await this.prismaService.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    const userResponses: UserResponse = {
      uuid: users.uuid,
      username: users.username,
      role: users.roles,
      fullname: users.full_name,
    };

    return {
      data: userResponses,
      status_code: 200,
      message: 'success',
    };
  }
}
