import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { DiagnosaRequest, DoctorResponse } from 'src/model/doctor.model';
import { DoctorValidation } from './doctor.validation';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { Status } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
  }

  async updatePasienStatus(passienId: number ): Promise<BaseResponse<DoctorResponse>> {
    let toNumberPassienId = Number(passienId);
    try {

      const antrianToUpdate = await this.prismaService.antrian.findUnique({
        where: {
          id: toNumberPassienId,
        },
      });

      if (!antrianToUpdate) {
        throw new HttpException('Pasien tidak ditemukan', HttpStatus.BAD_REQUEST);
      }

      await this.prismaService.antrian.update({
        where: {
          id: antrianToUpdate.id,
        },
        data: {
          status: Status.CHECKING,
        },
      });

      const checkStatusPasien = await this.prismaService.antrian.findUnique({
        where: {
          id: antrianToUpdate.id,
        },
        select: {
          status: true,
        },
      });

      return {
        data: {
          pasien_id: passienId,
          status: checkStatusPasien.status,
        },
        status_code: 200,
        message: 'Status pasien berhasil diupdate',
      };
    } catch (error) {
      this.logger.debug(`Update pasien ${JSON.stringify(error)}`);

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


  async createDiagnosa(pasienId: number, request: DiagnosaRequest): Promise<BaseResponse<DiagnosaRequest>> {
    try {
      const validateRequest = this.validationService.validate(DoctorValidation.DIAGNOSA, request);
      const checkPasien = await this.prismaService.antrian.findFirst({
        where: { passien_id: Number(pasienId) },
        select: { status: true },
      });
  
      const doctorName = await this.prismaService.pasien.findUnique({
        where: { pasien_id : Number(pasienId )},
        include: {
          poli: {
            include: {
              user: true,
              Antrian: true,
            },
          },
        },
      });
  
      if (!checkPasien) {
        throw new HttpException('Pasien tidak ditemukan', HttpStatus.BAD_REQUEST);
      }
  
      const existingDiagnosa = await this.prismaService.resep.findFirst({
        where: { pasien_id: Number(pasienId) },
      });
  
      if (existingDiagnosa) {
        throw new HttpException('Diagnosa untuk pasien ini sudah ada', HttpStatus.BAD_REQUEST);
      }
  
      const result = await this.prismaService.$transaction(async (prisma) => {
        
        const diagnosa = await prisma.resep.create({
          data: {
            tanggal_resep: new Date(),
            pasien_id: Number(pasienId),
            keterangan_resep: validateRequest.keterangan_resep,
            hasil_diagnosa: validateRequest.hasil_diagnosa,
          },
        });
        
  

        
        const updatePasien = await prisma.antrian.update({
          where: { id:Number(pasienId)  },
          data: { status: Status.PICKUP },
        });
        


 
        const pengambilanObat = await prisma.pengambilanObat.create({
          data: {
            resep_id: diagnosa.resep_id,
            user_id: doctorName.poli.user.uuid
          },
        });
    
  
        return {
          pasien_id: Number(diagnosa.pasien_id),
          keterangan_resep: diagnosa.keterangan_resep,
          hasil_diagnosa: diagnosa.hasil_diagnosa,
          status: updatePasien.status,
          doctor: doctorName.poli.user.full_name,
          pengambilan_obat_id: pengambilanObat.id,
        };
      });
  
      return {
        data: result,
        status_code: HttpStatus.OK,
        message: 'Diagnosa berhasil dibuat',
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

        throw error;
      }
    }
  }

}



