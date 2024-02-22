-- CreateTable
CREATE TABLE `Exemple` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `test` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,

    UNIQUE INDEX `Exemple_test_key`(`test`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
