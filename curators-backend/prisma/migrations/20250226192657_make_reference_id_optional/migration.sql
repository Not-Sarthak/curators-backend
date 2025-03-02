-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_deposit_fkey";

-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_swap_fkey";

-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_withdrawal_fkey";

-- AlterTable
ALTER TABLE "explorer" ALTER COLUMN "reference_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_deposit_fkey" FOREIGN KEY ("reference_id") REFERENCES "deposits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_withdrawal_fkey" FOREIGN KEY ("reference_id") REFERENCES "withdrawals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_swap_fkey" FOREIGN KEY ("reference_id") REFERENCES "swaps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
