-- CreateTable
CREATE TABLE `user` (
    `uuid` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `roles` ENUM('SUPERADMIN', 'RESEPSIONIS', 'DOKTER', 'APOTEKER') NOT NULL DEFAULT 'SUPERADMIN',
    `full_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poli` (
    `poli_id` BIGINT NOT NULL AUTO_INCREMENT,
    `poli_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `poli_poli_name_key`(`poli_name`),
    PRIMARY KEY (`poli_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pasien` (
    `pasien_id` BIGINT NOT NULL AUTO_INCREMENT,
    `nomor_bpjs` VARCHAR(191) NOT NULL,
    `nama_passien` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `faskes_tingkat_satu` VARCHAR(191) NOT NULL,
    `poli_id` BIGINT NOT NULL,

    PRIMARY KEY (`pasien_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resep` (
    `resep_id` BIGINT NOT NULL AUTO_INCREMENT,
    `pasien_id` BIGINT NOT NULL,
    `tanggal_resep` DATE NOT NULL,
    `keterangan_resep` VARCHAR(191) NOT NULL,
    `hasil_diagnosa` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`resep_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengambilan_obat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resep_id` BIGINT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `antrian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `t_poli_id` BIGINT NOT NULL,
    `passien_id` BIGINT NOT NULL,
    `status` ENUM('WAITING', 'CHECKING', 'PICKUP', 'DONE') NOT NULL,
    `tanggal` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_poli` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `poli_id` BIGINT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pasien` ADD CONSTRAINT `pasien_poli_id_fkey` FOREIGN KEY (`poli_id`) REFERENCES `poli`(`poli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resep` ADD CONSTRAINT `resep_pasien_id_fkey` FOREIGN KEY (`pasien_id`) REFERENCES `pasien`(`pasien_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengambilan_obat` ADD CONSTRAINT `pengambilan_obat_resep_id_fkey` FOREIGN KEY (`resep_id`) REFERENCES `resep`(`resep_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengambilan_obat` ADD CONSTRAINT `pengambilan_obat_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `antrian` ADD CONSTRAINT `antrian_t_poli_id_fkey` FOREIGN KEY (`t_poli_id`) REFERENCES `t_poli`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `antrian` ADD CONSTRAINT `antrian_passien_id_fkey` FOREIGN KEY (`passien_id`) REFERENCES `pasien`(`pasien_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_poli` ADD CONSTRAINT `t_poli_poli_id_fkey` FOREIGN KEY (`poli_id`) REFERENCES `poli`(`poli_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_poli` ADD CONSTRAINT `t_poli_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
