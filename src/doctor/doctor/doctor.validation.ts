import { Status } from "@prisma/client"
import { ZodType , z} from "zod"

export class DoctorValidation{
    static readonly UPDATE_PASIEN : ZodType = 

    z.object({
        pasien_id: z.number(),
        status: z.enum(['WAITING', 'CHECKING', 'PICKUP', 'DONE']),
    })


    static readonly DIAGNOSA : ZodType =
    z.object({
        pasien_id: z.number(),
        keterangan_resep: z.string(),
        hasil_diagnosa: z.string(),
        status: z.enum(['WAITING', 'CHECKING', 'PICKUP', 'DONE']),
    })


}