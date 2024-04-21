import { Controller, Get, Param, Query } from '@nestjs/common';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { AntrianResponse } from 'src/model/antrian.model';
import { AntrianService } from './antrian.service';

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
}
