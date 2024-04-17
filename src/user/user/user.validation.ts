import { ZodType, z } from "zod";

export class UserValidation{
    static readonly REGISTER : ZodType = 

    z.object({
        username: z.string().min(3, "Username is required").max(100),
        role: z.enum(["SUPERADMIN", "RESEPSIONIS", "DOKTER", "APOTEKER"]),
        full_name: z.string().min(3, "Full Name is Required").max(100)
    })


    static readonly LOGIN : ZodType =
    z.object({
        username: z.string().min(3, "Username or password is invalid!").max(100),
        password: z.string().min(8, "Username or password is invalid!").max(100)
    })
}