/*
  Warnings:

  - Added the required column `userId` to the `PG` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PG" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PG" ADD CONSTRAINT "PG_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
