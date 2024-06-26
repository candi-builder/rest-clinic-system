import {
  Body,
  Controller,
  Post,
  HttpCode,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { PoliService } from './poli.service';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { PoliResponse } from 'src/model/Poli.model';

@Controller('poli')
export class PoliController {
  constructor(private readonly poliService: PoliService) {}

  @Post()
  @HttpCode(200)
  async addPoli(
    @Body() request: { name: string },
  ): Promise<BaseResponse<string>> {
    const poli = await this.poliService.addPoli(request.name);
    return poli;
  }

  @Post('/add-member/:poliId')
  @HttpCode(200)
  async addPoliMember(
    @Param('poliId') poli_id: string,
    @Body('user_id') user_id: string, 
  ): Promise<BaseResponse<string>> {
    const poli = await this.poliService.addPoliMember(
      BigInt(poli_id),
      user_id,
    );
    return poli;
  }

  @Get()
  @HttpCode(200)
  async getListPoli(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<BaseResponse<PoliResponse[]>> {
    const poli = await this.poliService.getListPoli(page, size);
    return poli;
  }
  @Get("/member")
  @HttpCode(200)
  async getListMember(
  ): Promise<BaseResponse<PoliResponse[]>> {
    const poli = await this.poliService.getListTpoli();
    return poli;
  }
  @Get(':id')
  @HttpCode(200)
  async getListPoliMember(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Param() params: { id: bigint },
  ): Promise<BaseResponse<PoliResponse[]>> {
    const poli = await this.poliService.getListMember(page, size, params.id);
    return poli;
  }
}
