import { ZodType , z} from "zod"

export class PassienValidation{
    static readonly REGISTER_PASSIEN : ZodType = 

    z.object({
        passien_id: z.number().optional(),
        nomor_bpjs: z.string().min(13, 'Nomor bpjs minimal adalah 13 karakter').max(13,'Nomor bpjs maksimal adalah 13 karakter' ),
        nik: z.string().min(16).max(16).optional(),
        nama_passien: z.string().min(3).max(255),
        tanggal_lahir: z.string(),
        alamat: z.string().optional(),
        kelas_rawat: z.string().optional(),
        faskes_tingkat_satu: z.string().min(3).max(255),
        poli_id: z.number(),
    })


}