import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { BaseResponse, PaginationData } from 'src/model/BaseResponse.model';
import { PoliResponse } from 'src/model/Poli.model';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class PoliService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async addPoli(name: string): Promise<BaseResponse<string>> {
    this.logger.debug(`add poli ${name}`);

    const existingPoli = await this.prismaService.poli.findFirst({
      where: {
        poli_name: name,
      },
    });
    if (!name) {
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

    try {
      const existingPoli = await this.prismaService.poli.findFirst({
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

      if (!existingUser) {
        throw new HttpException('User Tidak Ditemukan', 404);
      }

      if (!existingPoli) {
        throw new HttpException('Poli Tidak Ditemukan', 404);
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
    } catch (error) {
      this.logger.debug(`Add Poli Member ${JSON.stringify(error)}`);

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

  async getListPoli(
    page: number,
    size: number,
  ): Promise<BaseResponse<PoliResponse[]>> {
    try {
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

      const nullPolis = await this.prismaService.poli.findMany();

      if (nullPolis.length === 0) {
        return {
          status_code: 404,
          message: 'Data tidak ditemukan',
        };
      }
      

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
    } catch (error) {
      this.logger.debug(`get list poli ${JSON.stringify(error)}`);

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

  async getListTpoli(): Promise<BaseResponse<PoliResponse[]>> {
    try {
      const polis = await this.prismaService.tPoli.findMany({
        select: {
          poli_id: true,
          id:true,
          user: {
            select: {
              full_name: true,
            },
          },
          poli: {
            select: {
              poli_name: true,
            },
          },
        },
      });

      const PoliResponse: PoliResponse[] = polis.map((user) => ({
        id: user.id.toString(),
        poliId: user.poli_id.toString(),
        poli_name: user.poli.poli_name,
        doctor: user.user.full_name,
      }));

      return {
        data: PoliResponse,
        status_code: 200,
        message: 'success',
      };
    } catch (error) {
      this.logger.debug(`get list poli ${JSON.stringify(error)}`);

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


  

 async getListMember(
    page: number,
    size: number,
    poli_id: bigint,
  ): Promise<BaseResponse<PoliResponse[]>> {
    try {
      const totalCount = await this.prismaService.tPoli.count({
        where: {
          poli: {
            poli_id: poli_id,
          },
        },
      });
      const totalPages = Math.ceil(totalCount / size);

      const nullData = await this.prismaService.tPoli.findMany({
        where: {
          poli: {
            poli_id: poli_id,
          },
        },
      });

      if (nullData.length === 0) {
        return {
          status_code: 404,
          message: 'Data tidak ditemukan',
        };
      }

      const result = await this.prismaService.tPoli.findMany({
        skip: (page - 1) * size,
        take: size,
        where: {
          poli: {
            poli_id: poli_id,
          },
        },
        select: {
          id: true,
          user: {
            select: {
              username: true,
            },
          },
          poli: {
            select: {
              poli_name: true,
            },
          },
        },
      });
      const PoliResponse: PoliResponse[] = result.map((poli) => ({
        id: poli.id.toString(),
        poli_name: poli.poli.poli_name,
        doctor: poli.user.username,
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
    } catch (error) {
      this.logger.debug(`get list member ${JSON.stringify(error)}`);

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
