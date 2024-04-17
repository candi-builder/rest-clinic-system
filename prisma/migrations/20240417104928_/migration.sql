/*
  Warnings:

  - The values [MENUNGGU,PEMERIKSAAN,SELESAI] on the enum `t_poli_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [MENUNGGU,PEMERIKSAAN,SELESAI] on the enum `t_poli_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[poli_name]` on the table `poli` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `antrian` MODIFY `status` ENUM('WAITING', 'CHECKING', 'PICKUP', 'DONE') NOT NULL;

-- AlterTable
ALTER TABLE `t_poli` MODIFY `status` ENUM('WAITING', 'CHECKING', 'PICKUP', 'DONE') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `poli_poli_name_key` ON `poli`(`poli_name`);
