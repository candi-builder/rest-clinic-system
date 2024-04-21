import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { AntrianResponse } from 'src/model/antrian.model';
import { AntrianService } from './antrian.service';
import { Status } from '@prisma/client';

@Controller('antrian')
export class AntrianController {
  constructor(private antrianService: AntrianService) {}

  @Get('/pemeriksaan/:dokterId')
  async getAntrianPemeriksaan(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Param('poliId') dokterId: string,
  ): Promise<BaseResponse<AntrianResponse[]>> {
    const antrian = await this.antrianService.getAntrianDocter(
      page,
      size,
      dokterId,
    );
    return antrian;
  }
  @Get('/pickup')
  async getAntrianPickup(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<BaseResponse<AntrianResponse[]>> {
    const antrian = await this.antrianService.getAntrianPickup(page, size);
    return antrian;
  }

  @Post(':antrianId')
  async post(
    @Param('antrianId') antrianId: number,
    @Body('status') status: Status
  ): Promise<BaseResponse<string>> {
    const antrian = await this.antrianService.updateStatus(antrianId,status);
    return antrian;
  }
}
