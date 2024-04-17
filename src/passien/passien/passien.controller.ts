import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { PassienService } from './passien.service';
import { PassienRequest, PassienResponse } from 'src/model/passien.model';
import { WebResponse } from 'src/model/web.model';
import { StatusPassien } from 'src/utils/utils';

@Controller('passien')
export class PassienController {
    constructor(private passienService: PassienService){}

    @Post('/register-passien')
    async registerPassien(
        @Body() request: PassienRequest,
    ): Promise<WebResponse<PassienResponse>> {

        try{
            await this.passienService.register(request);
            return {
                status_code: HttpStatus.OK,
                message: StatusPassien.SUCCESS_REGISTER_PASSIEN,
            };

        }catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

       
    }


}