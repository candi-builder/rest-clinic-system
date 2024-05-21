import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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

    const registerPassienRequest = this.validationService.validate(
      PassienValidation.REGISTER_PASSIEN,
      request,
    );

    const existingPassien = await this.prismaService.pasien.findFirst({
      where: { nomor_bpjs: registerPassienRequest.nomor_bpjs },
    });

    if (existingPassien) {
      throw new HttpException(
        'Nomor BPJS sudah terdaftar',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkPoli = await this.prismaService.tPoli.findFirst({
      where: { id: registerPassienRequest.poli_id },
    });

    if (!checkPoli) {
      throw new HttpException('Poli tidak ditemukan', HttpStatus.BAD_REQUEST);
    }

    try {
      const passien = await this.prismaService.pasien.create({
        data: {
          ...registerPassienRequest,

          tanggal_lahir: new Date(registerPassienRequest.tanggal_lahir),
        },
      });

      await this.prismaService.antrian.create({
        data: {
          passien_id: passien.pasien_id,
          t_poli_id: registerPassienRequest.poli_id,
          tanggal: new Date(),
          status: 'WAITING',
        },
      });

      return {
        status_code: HttpStatus.OK,
        message: 'Passien berhasil didaftarkan',
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

  async getPassienDetail(id: number): Promise<BaseResponse<PassienResponse>> {
    try {
      const pasien = await this.prismaService.pasien.findUnique({
        where: { pasien_id: id },
        include: {
          poli: {
            include: {
              poli: true,
            },
          },
        },
      });

      if (!pasien) {
        throw new HttpException('Pasien tidak ditemukan', HttpStatus.NOT_FOUND);
      }

      return {
        data: this.mapToPassienResponse(pasien),
        status_code: HttpStatus.OK,
        message: 'Success get pasien by id',
      };
    } catch (error) {
      this.logger.debug(`Get passien by id ${JSON.stringify(error)}`);

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

  async getListPassienByPoliId(
    page: number,
    size: number,
    poli_id: number,
  ): Promise<BaseResponse<PassienResponse[]>> {
    this.logger.warn(`Getting list pasien by poli id ${poli_id}`);

    try {
      const totalCount = await this.prismaService.pasien.count({
        where: { poli_id },
      });
      const totalPages = Math.ceil(totalCount / size);

      const pasienList = await this.prismaService.pasien.findMany({
        where: { poli_id },
        select: {
          pasien_id: true,
          nik: true,
          kelas_rawat: true,
          nomor_bpjs: true,
          nama_passien: true,
          tanggal_lahir: true,
          alamat: true,
          faskes_tingkat_satu: true,
          poli: {
            include: {
              user: true,
              Antrian: true,
            },
          },
        },
        skip: (page - 1) * size,
        take: size,
      });

      const passienResponses = pasienList.map(this.mapToPassienResponse);
      const paginationData: PaginationData = {
        page,
        size,
        total_page: totalPages,
        total_data: totalCount,
      };

      return {
        data: passienResponses,
        pagination: paginationData,
        status_code: HttpStatus.OK,
        message: 'Success get list pasien',
      };
    } catch (error) {
      this.logger.debug(`Get List Pasien ${JSON.stringify(error)}`);

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

  private mapToPassienResponse(pasien): PassienResponse {
    const antrianPassien = pasien.poli.TPoli[0]?.Antrian.find(
      (antrian) => antrian.passien_id === pasien.pasien_id,
    );

    return {
      passien_id: Number(pasien.pasien_id),
      nik: pasien.nik,
      nomor_bpjs: pasien.nomor_bpjs,
      nama_passien: pasien.nama_passien,
      tanggal_lahir: pasien.tanggal_lahir,
      alamat: pasien.alamat,
      kelas_rawat: pasien.kelas_rawat,
      faskes_tingkat_satu: pasien.faskes_tingkat_satu,
      poli: pasien.poli.poli_name,
      dokter: pasien.poli.TPoli[0]?.user.full_name,
      status: antrianPassien ? antrianPassien.status : 'Tidak ada antrian',
    };
  }
}
