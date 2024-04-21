import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { DoctorRequest, DoctorResponse } from 'src/model/doctor.model';
import { DoctorValidation } from './doctor.validation';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class DoctorService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
    }

    async updatePasienStatus(request: DoctorRequest): Promise<BaseResponse<DoctorResponse>> {
try{


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

      return{
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
    
}

