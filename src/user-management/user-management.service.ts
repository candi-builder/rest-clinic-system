import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { BaseResponse, PaginationData } from 'src/model/BaseResponse.model';
import { UserResponse } from 'src/model/UserManagement.model';

@Injectable()
export class UserManagementService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

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
}
