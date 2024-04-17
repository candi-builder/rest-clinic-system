import { Module } from '@nestjs/common';
import { PoliService } from './poli.service';
import { PoliController } from './poli.controller';

@Module({
  providers: [PoliService],
  controllers: [PoliController],
})
export class PoliModule {}
