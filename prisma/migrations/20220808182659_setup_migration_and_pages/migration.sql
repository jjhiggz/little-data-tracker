/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "Migration" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,

    CONSTRAINT "Migration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "responseContent" TEXT NOT NULL,
    "migrationId" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_migrationId_fkey" FOREIGN KEY ("migrationId") REFERENCES "Migration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
