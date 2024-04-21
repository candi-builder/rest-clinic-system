import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BaseResponse, PaginationData } from 'src/model/BaseResponse.model';
import { AntrianResponse } from 'src/model/antrian.model';

@Injectable()
export class AntrianService {
  constructor(private prismaService: PrismaService) {}

  async getAntrianDocter(
    page: number,
    size: number = 10,
    doctor: string
  ): Promise<BaseResponse<AntrianResponse[]>> {
    const totalCount = await this.prismaService.antrian.count();
    const totalPages = Math.ceil(totalCount / size);
    const data = await this.prismaService.antrian.findMany({
      skip: (page - 1) * size,
      take: size,
      where:{
        poli:{
          user_id:doctor
        }
      },
      select: {
        passien: {
          select: {
            nomor_bpjs: true,
            nama_passien: true,
          },
        },
        poli: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
            poli: {
              select: {
                poli_name: true,
              },
            },
          },
        },
        status: true,
        tanggal: true,
      },
    });
    const paginationData: PaginationData = {
      page,
      size,
      total_page: totalPages,
      total_data: totalCount,
    };
    const AntrianResponse: AntrianResponse[] = data.map((antrian) => ({
      nomor_bpjs:antrian.passien.nomor_bpjs,
      nama_passien:antrian.passien.nama_passien,
      dokter: antrian.poli.user.username,
      poli:antrian.poli.poli.poli_name,
      status:antrian.status
    }));

    return {
      data: AntrianResponse,
      pagination: paginationData,
      status_code:200,
      message: 'success',
    };
  }
}
