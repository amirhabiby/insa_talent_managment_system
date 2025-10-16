/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Mentor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Mentor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Mentor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Mentor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Mentor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "surname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_email_key" ON "Mentor"("email");
