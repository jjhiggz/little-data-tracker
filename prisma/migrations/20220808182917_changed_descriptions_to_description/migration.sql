/*
  Warnings:

  - You are about to drop the column `descriptions` on the `Migration` table. All the data in the column will be lost.
  - Added the required column `description` to the `Migration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Migration" DROP COLUMN "descriptions",
ADD COLUMN     "description" TEXT NOT NULL;
