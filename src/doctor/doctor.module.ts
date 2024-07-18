import { Module } from "@nestjs/common";
import { DoctorController } from "./doctor/doctor.controller";
import { DoctorService } from "./doctor/doctor.service";

@Module({
	controllers: [DoctorController],
	providers: [DoctorService],
})
export class DoctorModule {}
