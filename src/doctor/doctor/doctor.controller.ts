import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DiagnosaRequest, DoctorRequest } from 'src/model/doctor.model';

@Controller('doctor')
export class DoctorController {
    constructor(private doctorService: DoctorService) {
    }

    @Post('/update-pasien')
    @HttpCode(200)
    async updateStatusPasien(@Body() request: DoctorRequest) {
        return await this.doctorService.updatePasienStatus(request);
    }

    
    @Post('/diagnosa')
    @HttpCode(200)
    async diagnosaPasien(@Body() request: DiagnosaRequest) {
        return await this.doctorService.createDiagnosa(request);
    }


}
