/*
  Warnings:

  - You are about to drop the column `apy_volatility` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `lst_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lst_tokens" DROP COLUMN "apy_volatility",
DROP COLUMN "is_verified";
