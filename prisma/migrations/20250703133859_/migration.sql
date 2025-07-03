/*
  Warnings:

  - You are about to alter the column `iniVector` on the `PasswordEntry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(32)` to `VarChar(16)`.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PasswordEntry" ALTER COLUMN "iniVector" SET DATA TYPE VARCHAR(16);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "first_name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;
