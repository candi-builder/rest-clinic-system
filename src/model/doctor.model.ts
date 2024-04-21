import { Status } from "@prisma/client";

export class DoctorRequest {
    pasien_id?: number;
    status?: Status;
}


export class DoctorResponse {
    pasien_id?: number;
    status?: Status;
}
