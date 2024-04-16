import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation.service';
@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [ new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('MyApp', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
