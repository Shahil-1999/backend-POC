/*
  Warnings:

  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `userId`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;
