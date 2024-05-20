/*
  Warnings:

  - You are about to drop the column `t_poli_id` on the `pasien` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pasien` DROP FOREIGN KEY `pasien_t_poli_id_fkey`;

-- DropIndex
DROP INDEX `pasien_poli_id_fkey` ON `pasien`;

-- AlterTable
ALTER TABLE `pasien` DROP COLUMN `t_poli_id`;

-- AddForeignKey
ALTER TABLE `pasien` ADD CONSTRAINT `pasien_poli_id_fkey` FOREIGN KEY (`poli_id`) REFERENCES `t_poli`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
