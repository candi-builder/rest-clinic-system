import { ZodType, z } from "zod";

export class UserManagementValidation {
    

    static readonly CHANGE_PASSWORD : ZodType =
    z.object({
        password: z.string().min(8).max(255),
    })
}