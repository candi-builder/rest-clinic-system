import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { BaseResponse, PaginationData } from 'src/model/BaseResponse.model';
import { PoliResponse } from 'src/model/Poli.model';

@Injectable()
export class PoliService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async addPoli(name: string): Promise<BaseResponse<string>> {
    this.logger.debug(`add poli ${name}`);

    const existingPoli = await this.prismaService.poli.findUnique({
      where: {
        poli_name: name,
      },
    });
    if (name.length < 1) {
      throw new HttpException('nama poli tidak boleh kosong ', 400);
    }

    if (existingPoli) {
      throw new HttpException('poli already exists', 400);
    }

    const addPoli = await this.prismaService.poli.create({
      data: {
        poli_name: name,
      },
    });

    if (!addPoli) {
      return {
        status_code: 400,
        message: 'gagal menambah poli',
      };
    }

    return {
      status_code: 200,
      message: `berhasil menambah poli ${name}`,
    };
  }

  async addPoliMember(
    poli_id: bigint,
    user_id: string,
  ): Promise<BaseResponse<string>> {
    this.logger.debug(`add poli member`);

    const existingPoli = await this.prismaService.poli.findUnique({
      where: {
        poli_id: poli_id,
      },
    });

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        uuid: user_id,
      },
    });

    const existingData = await this.prismaService.tPoli.findMany({
      where: {
        user_id: user_id,
        poli_id: poli_id,
      },
    });

    if (!existingUser && !existingPoli) {
      throw new HttpException('user dan poli tidak ditemukan ', 404);
    }

    if (existingData.length > 0) {
      throw new HttpException(
        `${existingUser.username} sudah terdaftar di  poli ${existingPoli.poli_name} `,
        400,
      );
    }
    const addTPoli = await this.prismaService.tPoli.create({
      data: {
        poli_id: poli_id,
        user_id: user_id,
      },
    });

    if (!addTPoli) {
      throw new HttpException('internal server error ', 500);
    }
    return {
      status_code: 200,
      message: 'Berhasil menambah member',
    };
  }

  async getListPoli(
    page: number,
    size: number,
  ): Promise<BaseResponse<PoliResponse[]>> {
    const totalCount = await this.prismaService.poli.count();
    const totalPages = Math.ceil(totalCount / size);
    const polis = await this.prismaService.poli.findMany({
      skip: (page - 1) * size,
      take: size,
      select: {
        poli_id: true,
        poli_name: true,
      },
    });

    const PoliResponse: PoliResponse[] = polis.map((user) => ({
      id: user.poli_id.toString(),
      poli_name: user.poli_name,
    }));

    const paginationData: PaginationData = {
      page,
      size,
      total_page: totalPages,
      total_data: totalCount,
    };

    return {
      data: PoliResponse,
      pagination: paginationData,
      status_code: 200,
      message: 'success',
    };
  }
}
