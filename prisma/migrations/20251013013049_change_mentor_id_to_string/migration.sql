/*
  Warnings:

  - The primary key for the `Mentor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_mentorId_fkey";

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "mentorId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Mentor_id_seq";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
