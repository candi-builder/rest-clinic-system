import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { DiagnosaRequest, DoctorRequest, DoctorResponse } from 'src/model/doctor.model';
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

  async updatePasienStatus(request: DoctorRequest): Promise<BaseResponse<DoctorResponse>> {
    try {


      const validateRequest = this.validationService.validate(DoctorValidation.UPDATE_PASIEN, request);

      const antrianToUpdate = await this.prismaService.antrian.findFirst({
        where: {
          passien_id: validateRequest.pasien_id,
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
          status: validateRequest.status,
        },
      });

      return {
        data: {
          pasien_id: request.pasien_id,
          status: request.status,
        },
        status_code: 200,
        message: 'Status pasien berhasil diupdate',
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        throw new HttpException(validationError, HttpStatus.BAD_REQUEST);
      } else {
        throw error;
      }
    }

  }


  async createDiagnosa(request: DiagnosaRequest): Promise<BaseResponse<DiagnosaRequest>> {
    try {
      const validateRequest = this.validationService.validate(DoctorValidation.DIAGNOSA, request);
      const checkPasien = await this.prismaService.antrian.findFirst({
        where: { passien_id: validateRequest.pasien_id },
        select: { status: true },
      });
  
      const doctorName = await this.prismaService.pasien.findFirst({
        where: { pasien_id: request.pasien_id },
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
  
      if (!checkPasien) {
        throw new HttpException('Pasien tidak ditemukan', HttpStatus.BAD_REQUEST);
      }
  
      const existingDiagnosa = await this.prismaService.resep.findFirst({
        where: { pasien_id: validateRequest.pasien_id },
      });
  
      if (existingDiagnosa) {
        throw new HttpException('Diagnosa untuk pasien ini sudah ada', HttpStatus.BAD_REQUEST);
      }
  
      const result = await this.prismaService.$transaction(async (prisma) => {
        
        const diagnosa = await prisma.resep.create({
          data: {
            tanggal_resep: new Date(),
            pasien_id: validateRequest.pasien_id,
            keterangan_resep: validateRequest.keterangan_resep,
            hasil_diagnosa: validateRequest.hasil_diagnosa,
          },
        });
        
  

        
        const updatePasien = await prisma.antrian.update({
          where: { id: validateRequest.pasien_id },
          data: { status: validateRequest.status },
        });
        


 
        const pengambilanObat = await prisma.pengambilanObat.create({
          data: {
            resep_id: diagnosa.resep_id,
            user_id: doctorName.poli.TPoli[0].user.uuid,
          },
        });
    
  
        return {
          pasien_id: Number(diagnosa.pasien_id),
          keterangan_resep: diagnosa.keterangan_resep,
          hasil_diagnosa: diagnosa.hasil_diagnosa,
          status: updatePasien.status,
          doctor: doctorName.poli.TPoli[0].user.full_name,
          pengambilan_obat_id: pengambilanObat.id,
        };
      });
  
      return {
        data: result,
        status_code: HttpStatus.OK,
        message: 'Diagnosa berhasil dibuat',
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        throw new HttpException(validationError, HttpStatus.BAD_REQUEST);
      } else {
        throw error;
      }
    }
  }

}



