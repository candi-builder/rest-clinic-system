import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    ) {
    }


    async register(request: RegisterUserRequest) : Promise<UserResponse>{
        this.logger.debug(`Registering user ${request.username}`)
        const registerUserRequest : RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER,request)

        
        
        const existingUser = await this.prismaService.user.findUnique({
            where:{
                username: request.username
            }
        })

        if(existingUser){
            throw new HttpException("Username already exists",400)
        }

        registerUserRequest.password = await bcrypt.hash(registerUserRequest.password, 10)

        const user = await this.prismaService.user.create
        ({
            data:{
                
                uuid: uuid(),
                username: registerUserRequest.username,
                password: registerUserRequest.password,
                roles: registerUserRequest.role,
                full_name: registerUserRequest.full_name
            }
        })
          



         return {
            uuid: user.uuid,
            username: user.username,
            password: user.password,
            role: user.roles,
            full_name: user.full_name
        };
        
    }

}

