/*
  Warnings:

  - A unique constraint covering the columns `[swap_transaction_hash]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "swap_transaction_hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_swap_transaction_hash_key" ON "transactions"("swap_transaction_hash");
