import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { BaseResponse } from 'src/model/BaseResponse.model';

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
    console.log(name.length);

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
      message: 'berhasil menambah poli',
    };
  }
}
