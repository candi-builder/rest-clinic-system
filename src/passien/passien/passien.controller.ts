import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PassienService } from './passien.service';
import { PassienRequest, PassienResponse } from 'src/model/passien.model';
import { WebResponse } from 'src/model/web.model';
import { StatusPassien } from 'src/utils/utils';
import { BaseResponse } from 'src/model/BaseResponse.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('passien')
export class PassienController {
  constructor(private passienService: PassienService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    
    
    ) {}

  @Post('/register-passien')
  async registerPassien(
    @Body() request: PassienRequest,
  ): Promise<WebResponse<PassienResponse>> {
      const passien = await this.passienService.register(request);
      return passien;
  }

  @Get(':passienId')
  async getPassienById(
    @Param() params: { passienId: number },
  ): Promise<BaseResponse<PassienResponse>> {
    const passien = await this.passienService.getPassienDetail(
      params.passienId,
    );
    return passien;
  }

  @Get('/get-list-by-poli/:poliId')
  @HttpCode(200)
  async getListPassien(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Param('poliId') poliId: number,
  ): Promise<BaseResponse<PassienResponse[]>> {
    const passien = await this.passienService.getListPassienByPoliId(page, size, poliId);
    return passien;
  }

  
}



