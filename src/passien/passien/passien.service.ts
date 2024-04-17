import { Inject, Injectable, Logger, ValidationError } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { PassienRequest, PassienResponse } from 'src/model/passien.model';
import { PassienValidation } from './passien.validation';
import { ValidationService } from 'src/common/validation.service';
import { Utils } from 'src/utils/utils';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class PassienService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
      ) {}

      async register(request: PassienRequest): Promise<WebResponse<PassienResponse>> {
        this.logger.debug(`Registering passien ${JSON.stringify(request)}`);
        const registerPassienRequest: PassienRequest =
          this.validationService.validate(PassienValidation.REGISTER_PASSIEN, request);
      
        try {
            
          const existingPassien = await this.prismaService.pasien.findFirst({
            where: {
              nomor_bpjs: registerPassienRequest.nomor_bpjs,
            },
          });
      
          if (existingPassien) {
            // Pasien dengan nomor BPJS yang sama sudah ada, lakukan tindakan yang sesuai
            throw new Error(`Pasien dengan nomor BPJS ${registerPassienRequest.nomor_bpjs} sudah terdaftar.`);
          }
      
          const passien = await this.prismaService.pasien.create({
            data: {
              nomor_bpjs: registerPassienRequest.nomor_bpjs,
              nama_passien: registerPassienRequest.nama_passien,
              tanggal_lahir: new Date(registerPassienRequest.tanggal_lahir),
              alamat: registerPassienRequest.alamat,
              faskes_tingkat_satu: registerPassienRequest.faskes_tingkat_satu,
              poli_id: registerPassienRequest.poli_id,
            },
          });
      
          return {
           
          };
        } catch (error) {
          this.logger.warn(`Error registering passien ${JSON.stringify(error)}`);
          throw error;
        }
      }




}
