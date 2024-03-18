/*
  Warnings:

  - You are about to drop the column `tweet_text` on the `tweet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tweet` table. All the data in the column will be lost.
  - Added the required column `content` to the `tweet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tweet" DROP CONSTRAINT "tweet_userId_fkey";

-- AlterTable
ALTER TABLE "tweet" DROP COLUMN "tweet_text",
DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "imagesUrl" TEXT;

-- AddForeignKey
ALTER TABLE "tweet" ADD CONSTRAINT "tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
