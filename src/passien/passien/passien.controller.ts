import {
  Body,
  Controller,
  Get,

  HttpCode,

  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PassienService } from './passien.service';
import { PassienRequest, PassienResponse } from 'src/model/passien.model';
import { WebResponse } from 'src/model/web.model';
import { StatusPassien } from 'src/utils/utils';
import { BaseResponse } from 'src/model/BaseResponse.model';

@Controller('passien')
export class PassienController {
  constructor(private passienService: PassienService) {}

  @Post('/register-passien')
  async registerPassien(
    @Body() request: PassienRequest,
  ): Promise<WebResponse<PassienResponse>> {
    try {
      await this.passienService.register(request);
      return {
        status_code: HttpStatus.OK,
        message: StatusPassien.SUCCESS_REGISTER_PASSIEN,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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



