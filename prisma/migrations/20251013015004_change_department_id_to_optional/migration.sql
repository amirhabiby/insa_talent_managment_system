-- DropForeignKey
ALTER TABLE "public"."Mentor" DROP CONSTRAINT "Mentor_departmentId_fkey";

-- AlterTable
ALTER TABLE "Mentor" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
