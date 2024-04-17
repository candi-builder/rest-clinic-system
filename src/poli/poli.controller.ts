import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { PoliService } from './poli.service';
import { BaseResponse } from 'src/model/BaseResponse.model';

@Controller('api/poli')
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

  @Post('/add-member')
  @HttpCode(200)
  async addPoliMember(
    @Body() request: { poli_id: bigint; user_id: string },
  ): Promise<BaseResponse<string>> {
    const poli = await this.poliService.addPoliMember(
      request.poli_id,
      request.user_id,
    );
    return poli;
  }
}
