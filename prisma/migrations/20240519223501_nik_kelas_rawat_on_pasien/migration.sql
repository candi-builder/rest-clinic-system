/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `pasien` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pasien` ADD COLUMN `kelas_rawat` VARCHAR(191) NULL,
    ADD COLUMN `nik` VARCHAR(191) NULL,
    MODIFY `alamat` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `pasien_nik_key` ON `pasien`(`nik`);
