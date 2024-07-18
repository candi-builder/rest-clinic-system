import { Status } from "@prisma/client";

export class DoctorResponse {
	pasien_id?: number;
	status?: Status;
}

export class DiagnosaRequest {
	keterangan_resep: string;
	hasil_diagnosa: string;

	doctor?: string;
}

export class DiagnosaResponse {
	pasien_id: number;
	keterangan_resep: string;
	hasil_diagnosa: string;
	doctor: string;
	status: Status;
}
