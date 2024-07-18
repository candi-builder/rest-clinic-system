import { Module } from "@nestjs/common";
import { AntrianController } from "./antrian.controller";
import { AntrianService } from "./antrian.service";

@Module({
	controllers: [AntrianController],
	providers: [AntrianService],
})
export class AntrianModule {}
