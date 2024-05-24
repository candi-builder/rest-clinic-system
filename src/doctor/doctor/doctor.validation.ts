import { Status } from "@prisma/client"
import { ZodType , z} from "zod"

export class DoctorValidation{
    


    static readonly DIAGNOSA : ZodType =
    z.object({
        keterangan_resep: z.string(),
        hasil_diagnosa: z.string(),
    })


}