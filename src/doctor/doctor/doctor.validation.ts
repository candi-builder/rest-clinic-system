import { Status } from "@prisma/client"
import { ZodType , z} from "zod"

export class DoctorValidation{
    static readonly UPDATE_PASIEN : ZodType = 

    


    z.object({
        pasien_id: z.number(),
        status: z.enum(['WAITING', 'CHECKING', 'PICKUP', 'DONE']),
    })


}