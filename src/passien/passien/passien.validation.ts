import { ZodType , z} from "zod"

export class PassienValidation{
    static readonly REGISTER_PASSIEN : ZodType = 

    z.object({
        passien_id: z.number().optional(),
        nomor_bpjs: z.string().min(13).max(13),
        nama_passien: z.string().min(3).max(255),
        tanggal_lahir: z.string(),
        alamat: z.string().min(3).max(255),
        faskes_tingkat_satu: z.string().min(3).max(255),
        poli_id: z.number(),
    })


}