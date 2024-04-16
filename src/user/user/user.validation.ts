import { ZodType, z } from "zod";

export class UserValidation{
    static readonly REGISTER : ZodType = 

    z.object({
        username: z.string().min(3).max(100),
        role: z.enum(["SUPERADMIN", "RESEPSIONIS", "DOKTER", "APOTEKER"]),
        full_name: z.string().min(3).max(100)
    })


    static readonly LOGIN : ZodType =
    z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(8).max(100)
    })
}