/*
  Warnings:

  - Added the required column `t_poli_id` to the `pasien` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pasien` DROP FOREIGN KEY `pasien_poli_id_fkey`;

-- AlterTable
ALTER TABLE `pasien` ADD COLUMN `t_poli_id` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `pasien` ADD CONSTRAINT `pasien_t_poli_id_fkey` FOREIGN KEY (`t_poli_id`) REFERENCES `t_poli`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
