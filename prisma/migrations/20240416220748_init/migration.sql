/*
  Warnings:

  - You are about to drop the column `statu` on the `antrian` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `antrian` table. All the data in the column will be lost.
  - You are about to drop the column `statu` on the `t_poli` table. All the data in the column will be lost.
  - Added the required column `status` to the `antrian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `t_poli` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `antrian` DROP FOREIGN KEY `antrian_poli_id_fkey`;

-- DropForeignKey
ALTER TABLE `antrian` DROP FOREIGN KEY `antrian_user_id_fkey`;

-- AlterTable
ALTER TABLE `antrian` DROP COLUMN `statu`,
    DROP COLUMN `user_id`,
    ADD COLUMN `status` ENUM('MENUNGGU', 'PEMERIKSAAN', 'SELESAI') NOT NULL;

-- AlterTable
ALTER TABLE `t_poli` DROP COLUMN `statu`,
    ADD COLUMN `status` ENUM('MENUNGGU', 'PEMERIKSAAN', 'SELESAI') NOT NULL;

-- AddForeignKey
ALTER TABLE `antrian` ADD CONSTRAINT `antrian_poli_id_fkey` FOREIGN KEY (`poli_id`) REFERENCES `t_poli`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
