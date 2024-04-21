import { Status } from "@prisma/client";

export class DoctorRequest {
    pasien_id?: number;
    status?: Status;
}


export class DoctorResponse {
    pasien_id?: number;
    status?: Status;
}

export class DiagnosaRequest{
    pasien_id: number;
    keterangan_resep: string;
    hasil_diagnosa: string;
    status: Status;
    doctor?: string;
    
    
}

export class DiagnosaResponse{
    pasien_id: number;
    keterangan_resep: string;
    hasil_diagnosa: string;
    doctor : string;
    status: Status;
    
    
}
