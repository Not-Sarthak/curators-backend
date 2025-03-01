/*
  Warnings:

  - You are about to drop the column `deposit_id` on the `explorer` table. All the data in the column will be lost.
  - You are about to drop the column `withdrawal_id` on the `explorer` table. All the data in the column will be lost.
  - You are about to drop the `deposits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `withdrawals` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "TransactionStatus" ADD VALUE 'COMPLETED';

-- DropForeignKey
ALTER TABLE "deposits" DROP CONSTRAINT "deposits_user_id_fkey";

-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_deposit_id_fkey";

-- DropForeignKey
ALTER TABLE "explorer" DROP CONSTRAINT "explorer_withdrawal_id_fkey";

-- DropForeignKey
ALTER TABLE "withdrawals" DROP CONSTRAINT "withdrawals_lst_mint_address_fkey";

-- DropForeignKey
ALTER TABLE "withdrawals" DROP CONSTRAINT "withdrawals_user_id_fkey";

-- AlterTable
ALTER TABLE "explorer" DROP COLUMN "deposit_id",
DROP COLUMN "withdrawal_id",
ADD COLUMN     "transaction_id" TEXT;

-- DropTable
DROP TABLE "deposits";

-- DropTable
DROP TABLE "withdrawals";

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "transaction_hash" TEXT,
    "wallet_address" TEXT NOT NULL,
    "amount_sol" DECIMAL(18,9) NOT NULL,
    "network_fee_sol" DECIMAL(18,9),
    "actual_amount_sol" DECIMAL(18,9),
    "conversion_fee_sol" DECIMAL(18,9),
    "withdrawalType" "WithdrawalType",
    "lst_mint_address" TEXT,
    "lst_amount" DECIMAL(18,9),
    "conversion_price_sol" DECIMAL(18,9),
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "confirmation_count" INTEGER NOT NULL DEFAULT 0,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_hash_key" ON "transactions"("transaction_hash");

-- CreateIndex
CREATE INDEX "idx_transactions_user_status" ON "transactions"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_transactions_hash" ON "transactions"("transaction_hash");

-- CreateIndex
CREATE INDEX "idx_transactions_created" ON "transactions"("created_at");

-- CreateIndex
CREATE INDEX "idx_transactions_type" ON "transactions"("transactionType");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_lst_mint_address_fkey" FOREIGN KEY ("lst_mint_address") REFERENCES "lst_tokens"("mint_address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
