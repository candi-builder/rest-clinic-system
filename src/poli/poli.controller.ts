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
}
