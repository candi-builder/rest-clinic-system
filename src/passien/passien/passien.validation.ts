import { ZodType , z} from "zod"

export class PassienValidation{
    static readonly REGISTER_PASSIEN : ZodType = 

    z.object({
        passien_id: z.number().optional(),
        nomor_bpjs: z.string().min(13).max(13),
        nik: z.string().min(16).max(16).optional(),
        nama_passien: z.string().min(3).max(255),
        tanggal_lahir: z.string(),
        alamat: z.string().min(3).max(255),
        kelas_rawat: z.string().min(3).max(255).optional(),
        faskes_tingkat_satu: z.string().min(3).max(255),
        poli_id: z.number(),
    })


}