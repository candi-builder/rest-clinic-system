export class PassienRequest {
  passien_id: number;
  nomor_bpjs: string;
  nama_passien: string;
  tanggal_lahir: Date;
  alamat: string;
  faskes_tingkat_satu: string;
  poli_id: number;
}

export class PassienResponse {
  passien_id?: number;
  nomor_bpjs?: string;
  nama_passien?: string;
  tanggal_lahir?: Date;
  alamat?: string;
  faskes_tingkat_satu?: string;
  poli_id?: number | bigint;
  poli?: string;

  poliObject?: {
    poli_id?: number | bigint;
    poli?: string;
    dokter?: string;
  }
  dokter?: any
  status?: string
}