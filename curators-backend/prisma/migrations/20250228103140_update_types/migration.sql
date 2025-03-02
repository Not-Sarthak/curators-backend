/*
  Warnings:

  - The `current_apy` column on the `lst_tokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "lst_tokens" DROP COLUMN "current_apy",
ADD COLUMN     "current_apy" DECIMAL(6,2);

-- CreateIndex
CREATE INDEX "idx_lst_tokens_current_apy" ON "lst_tokens"("current_apy");
