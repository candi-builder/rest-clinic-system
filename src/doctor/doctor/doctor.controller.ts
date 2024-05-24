import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DiagnosaRequest } from 'src/model/doctor.model';

@Controller('doctor')
export class DoctorController {
    constructor(private doctorService: DoctorService) {
    }

    @Post('/update-pasien/:id')
    @HttpCode(200)
    async updatePatientStatus(@Param('id') passienId: number) {
        return await this.doctorService.updatePasienStatus(passienId);
    }

    
    @Post('/diagnosa/:id')
    @HttpCode(200)
    async diagnosaPasien(
        @Param('id') passienId: number,
        @Body() request: DiagnosaRequest
        ) {
        return await this.doctorService.createDiagnosa(passienId,request);
    }


}
