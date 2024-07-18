import { Module } from "@nestjs/common";
import { PassienController } from "./passien/passien.controller";
import { PassienService } from "./passien/passien.service";

@Module({
	controllers: [PassienController],
	providers: [PassienService],
})
export class PassienModule {}
