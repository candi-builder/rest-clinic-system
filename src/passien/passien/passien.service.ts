import { HttpException, Inject, Injectable, Logger, ValidationError } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { PassienRequest, PassienResponse } from 'src/model/passien.model';
import { PassienValidation } from './passien.validation';
import { ValidationService } from 'src/common/validation.service';
import { WebResponse } from 'src/model/web.model';
import { BaseResponse } from 'src/model/BaseResponse.model';

@Injectable()
export class PassienService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
      ) {}

      async register(request: PassienRequest): Promise<BaseResponse<PassienResponse>> {
        this.logger.debug(`Registering passien ${JSON.stringify(request)}`);
        const registerPassienRequest: PassienRequest =
          this.validationService.validate(PassienValidation.REGISTER_PASSIEN, request);
      
        try {
            
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

          if (!checkPoli) {
            
            throw new HttpException('Poli tidak ditemukan', 400);
          }

          if (existingPassien) {
           
            throw new HttpException('Nomor BPJS sudah terdaftar', 400);
          }
      
          const passien = await this.prismaService.pasien.create({
            data: {
              ...registerPassienRequest,
              tanggal_lahir: new Date(registerPassienRequest.tanggal_lahir),
            },
          });
      
          return {
            
            status_code: 200,
            message: 'Passien berhasil didaftarkan',
          };

          
        } catch (error) {
          this.logger.warn(error);
          throw Error(error);
         
        }
      }


      async getPassienDetail(id: number): Promise<BaseResponse<PassienResponse>> {
        const pasien = await this.prismaService.pasien.findUnique({
          where: {
            pasien_id: id, // Pastikan tipe data id sesuai
          },
          include:{
            poli:{
              include:{
                TPoli:{
                  include:{
                    user: true
                  }
                }
              }
            },
            Antrian: true
            
            
          }
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
            status: pasien.Antrian[0].status
            
          },
          status_code: 200,
          message: 'Success get pasien by id',
        };
      }



        

      
    



    }
