import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DiagnosaRequest, DoctorRequest } from 'src/model/doctor.model';

@Controller('doctor')
export class DoctorController {
    constructor(private doctorService: DoctorService) {
    }

    @Post('/update-pasien/:id')
    @HttpCode(200)
    async updateStatusPasien(@Param() params: {passienId:number}, @Body() request: DoctorRequest) {
        return await this.doctorService.updatePasienStatus(params.passienId,request);
    }

    
    @Post('/diagnosa')
    @HttpCode(200)
    async diagnosaPasien(@Body() request: DiagnosaRequest) {
        return await this.doctorService.createDiagnosa(request);
    }


}
