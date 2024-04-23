import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { PassienRequest, PassienResponse } from 'src/model/passien.model';
import { PassienValidation } from './passien.validation';
import { ValidationService } from 'src/common/validation.service';
import { BaseResponse, PaginationData } from 'src/model/BaseResponse.model';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class PassienService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async register(
    request: PassienRequest,
  ): Promise<BaseResponse<PassienResponse>> {
    this.logger.debug(`Registering passien ${JSON.stringify(request)}`);
    const registerPassienRequest: PassienRequest =
      this.validationService.validate(
        PassienValidation.REGISTER_PASSIEN,
        request,
      );

    const existingPassien = await this.prismaService.pasien.findFirst({
      where: {
        nomor_bpjs: registerPassienRequest.nomor_bpjs,
      },
    });

    const checkPoli = await this.prismaService.poli.findFirst({
      where: {
        poli_id: registerPassienRequest.poli_id,
      },
    });

    if (existingPassien) {
      throw new HttpException('Nomor BPJS sudah terdaftar', 400);
    }

    if (!checkPoli) {
      throw new HttpException('Poli tidak ditemukan', 400);
    }


    try{
    const passien = await this.prismaService.pasien.create({
      data: {
        ...registerPassienRequest,
        tanggal_lahir: new Date(registerPassienRequest.tanggal_lahir),
      },
    });
    await this.prismaService.antrian.create({
      data: {
        passien_id: passien.pasien_id,
        t_poli_id: passien.poli_id,
        tanggal: new Date(),
        status: 'WAITING',
      },
    });
    return {
      status_code: 200,
      message: 'Passien berhasil didaftarkan',
    };
  }catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new HttpException(validationError, HttpStatus.BAD_REQUEST);
    } else {
      throw error;
    }
  }
}

  async getPassienDetail(id: number): Promise<BaseResponse<PassienResponse>> {

    try{
    const pasien = await this.prismaService.pasien.findUnique({
      where: {
        pasien_id: id,
      },
      include: {
        poli: {
          include: {
            TPoli: {
              include: {
                user: true,
                Antrian: true,
              },
            },
          },
        },
      },
    });

    if (!pasien) {
      throw new HttpException('Pasien tidak ditemukan', 404);
    }

    return {
      data: {
        passien_id: Number(pasien.pasien_id),
        nomor_bpjs: pasien.nomor_bpjs,
        nama_passien: pasien.nama_passien,
        tanggal_lahir: pasien.tanggal_lahir,
        alamat: pasien.alamat,
        faskes_tingkat_satu: pasien.faskes_tingkat_satu,
        poli_id: Number(pasien.poli_id),
        poli: pasien.poli.poli_name,
        dokter: pasien.poli.TPoli[0].user.full_name,
        status: pasien.poli.TPoli[0].Antrian[0]?.status, // Optional chaining untuk menangani Antrian kosong
      },
      status_code: 200,
      message: 'Success get pasien by id',
    };

  }catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new HttpException(validationError, HttpStatus.BAD_REQUEST);
    } else {
      throw error;
    }
  }
  }

  async getListPassienByPoliId(
    page: number,
    size: number,
    poli_id: number,
  ): Promise<BaseResponse<PassienResponse[]>> {
    this.logger.warn(`Getting list pasien by poli id ${poli_id}`);


    try{

    
    const totalCount = await this.prismaService.pasien.count();
    const totalPages = Math.ceil(totalCount / size);
    const pasien = await this.prismaService.pasien.findMany({
      where: {
        poli_id: poli_id,
      },
      select: {
        pasien_id: true,
        nomor_bpjs: true,
        nama_passien: true,
        tanggal_lahir: true,
        alamat: true,
        faskes_tingkat_satu: true,
        poli: {
          include: {
            TPoli: {
              include: {
                user: true,
                Antrian: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * size,
      take: size,
    });

    const PassienResponse: PassienResponse[] = pasien.map((pasien) => {
      const antrianPassien = pasien.poli.TPoli[0].Antrian.find(
        (antrian) => antrian.passien_id === pasien.pasien_id,
      );

      return {
        passien_id: Number(pasien.pasien_id),
        nomor_bpjs: pasien.nomor_bpjs,
        nama_passien: pasien.nama_passien,
        tanggal_lahir: pasien.tanggal_lahir,
        alamat: pasien.alamat,
        faskes_tingkat_satu: pasien.faskes_tingkat_satu,
        poli: pasien.poli.poli_name,
        dokter: pasien.poli.TPoli[0].user.full_name,
        status: antrianPassien ? antrianPassien.status : 'Tidak ada antrian',
      };
    });

    const paginationData: PaginationData = {
      page,
      size,
      total_page: totalPages,
      total_data: totalCount,
    };

    return {
      data: PassienResponse,
      pagination: paginationData,
      status_code: 200,
      message: 'Success get list pasien',
    };
  }catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new HttpException(validationError, HttpStatus.BAD_REQUEST);
    } else {
      throw error;
    }
  }
}
}
