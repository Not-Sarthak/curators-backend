/*
  Warnings:

  - You are about to drop the column `reference_id` on the `explorer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_deposit_fkey";

-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_swap_fkey";

-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_withdrawal_fkey";

-- AlterTable
ALTER TABLE "explorer" DROP COLUMN "reference_id",
ADD COLUMN     "deposit_id" TEXT,
ADD COLUMN     "swap_id" TEXT,
ADD COLUMN     "withdrawal_id" TEXT;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_deposit_id_fkey" FOREIGN KEY ("deposit_id") REFERENCES "deposits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_withdrawal_id_fkey" FOREIGN KEY ("withdrawal_id") REFERENCES "withdrawals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_swap_id_fkey" FOREIGN KEY ("swap_id") REFERENCES "swaps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
