-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `planName` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `userDetailsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userDetailsId_fkey` FOREIGN KEY (`userDetailsId`) REFERENCES `userdetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
