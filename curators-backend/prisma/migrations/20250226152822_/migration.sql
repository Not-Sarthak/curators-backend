/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wallet_address]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wallet_address` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LstStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "WithdrawalType" AS ENUM ('SOL', 'LST');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'SWAP');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "SwapStatus" AS ENUM ('PENDING', 'SIMULATING', 'EXECUTING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SwapRouteSource" AS ENUM ('JUPITER', 'SANCTUM');

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "current_deposit_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
ADD COLUMN     "profit_percentage" DECIMAL(6,2) NOT NULL DEFAULT 0,
ADD COLUMN     "realized_profit_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
ADD COLUMN     "status" "LstStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "total_deposits_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
ADD COLUMN     "total_profit_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
ADD COLUMN     "total_value_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
ADD COLUMN     "total_withdrawals_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
ADD COLUMN     "unrealized_profit_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
ADD COLUMN     "wallet_address" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "lst_tokens" (
    "mint_address" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "protocol_name" TEXT NOT NULL,
    "protocol_website" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "current_apy" DECIMAL(6,2),
    "current_price_sol" DECIMAL(18,9),
    "total_liquidity_sol" DECIMAL(18,9),
    "market_cap_sol" DECIMAL(18,9),
    "avg_apy_over_history" JSONB,
    "validator_identity" TEXT,
    "vote_identity" TEXT,
    "activated_stake" DECIMAL(18,6),
    "commission" DECIMAL(4,2),
    "vote_success" DECIMAL(5,2),
    "skip_rate" DECIMAL(5,2),
    "uptime" DECIMAL(5,2),
    "wiz_score" DECIMAL(5,2),
    "stake_ratio" DECIMAL(5,2),
    "staking_version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lst_tokens_pkey" PRIMARY KEY ("mint_address")
);

-- CreateTable
CREATE TABLE "user_holdings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lst_mint_address" TEXT NOT NULL,
    "amount" DECIMAL(18,9) NOT NULL,
    "value_in_sol" DECIMAL(18,9) NOT NULL,
    "entry_price_sol" DECIMAL(18,9) NOT NULL,
    "unrealized_profit_sol" DECIMAL(18,9) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_hash" TEXT,
    "wallet_address" TEXT NOT NULL,
    "amount_sol" DECIMAL(18,9) NOT NULL,
    "network_fee_sol" DECIMAL(18,9),
    "status" "DepositStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "confirmation_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_hash" TEXT,
    "wallet_address" TEXT NOT NULL,
    "requested_amount_sol" DECIMAL(18,9) NOT NULL,
    "actual_amount_sol" DECIMAL(18,9),
    "network_fee_sol" DECIMAL(18,9),
    "conversion_fee_sol" DECIMAL(18,9),
    "withdrawalType" "WithdrawalType" NOT NULL,
    "lst_mint_address" TEXT,
    "lst_amount" DECIMAL(18,9),
    "conversion_price_sol" DECIMAL(18,9),
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "explorer" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "transaction_hash" TEXT,
    "reference_id" TEXT NOT NULL,
    "amount_sol" DECIMAL(18,9) NOT NULL,
    "fee_sol" DECIMAL(18,9) NOT NULL,
    "lst_mint_address" TEXT,
    "lst_amount" DECIMAL(18,9),
    "lst_price_sol" DECIMAL(18,9),
    "portfolio_value_before_sol" DECIMAL(18,9) NOT NULL,
    "portfolio_value_after_sol" DECIMAL(18,9) NOT NULL,
    "profit_impact_sol" DECIMAL(18,9),
    "status" "TransactionStatus" NOT NULL,
    "error_message" TEXT,
    "confirmation_count" INTEGER NOT NULL DEFAULT 0,
    "block_number" BIGINT,
    "block_time" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "explorer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "epoch_profits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "start_value_sol" DECIMAL(18,9) NOT NULL,
    "end_value_sol" DECIMAL(18,9) NOT NULL,
    "epoch_number" INTEGER NOT NULL,
    "total_profit_sol" DECIMAL(18,9) NOT NULL,
    "profit_percentage" DECIMAL(6,2) NOT NULL,
    "best_performing_lst" TEXT,
    "best_lst_apy" DECIMAL(6,2),
    "worst_performing_lst" TEXT,
    "worst_lst_apy" DECIMAL(6,2),
    "epoch_start_time" TIMESTAMP(3) NOT NULL,
    "epoch_end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "epoch_profits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swaps" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_hash" TEXT,
    "source_lst_mint" TEXT NOT NULL,
    "source_amount" DECIMAL(18,9) NOT NULL,
    "source_price_sol" DECIMAL(18,9) NOT NULL,
    "source_apy" DECIMAL(6,2) NOT NULL,
    "destination_lst_mint" TEXT NOT NULL,
    "destination_amount" DECIMAL(18,9),
    "destination_price_sol" DECIMAL(18,9) NOT NULL,
    "destination_apy" DECIMAL(6,2) NOT NULL,
    "routeSource" "SwapRouteSource" NOT NULL,
    "route_details" JSONB NOT NULL,
    "quoted_output_amount" DECIMAL(18,9) NOT NULL,
    "actual_output_amount" DECIMAL(18,9),
    "network_fee_sol" DECIMAL(18,9) NOT NULL,
    "protocol_fee_sol" DECIMAL(18,9) NOT NULL,
    "slippage_bps" INTEGER NOT NULL,
    "price_impact_percent" DECIMAL(6,2) NOT NULL,
    "expected_profit_sol" DECIMAL(18,9) NOT NULL,
    "actual_profit_sol" DECIMAL(18,9),
    "status" "SwapStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "simulation_successful" BOOLEAN,
    "confirmation_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "swaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lst_tokens_symbol_key" ON "lst_tokens"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "user_holdings_user_id_lst_mint_address_key" ON "user_holdings"("user_id", "lst_mint_address");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_transaction_hash_key" ON "deposits"("transaction_hash");

-- CreateIndex
CREATE UNIQUE INDEX "withdrawals_transaction_hash_key" ON "withdrawals"("transaction_hash");

-- CreateIndex
CREATE INDEX "idx_withdrawals_user_status" ON "withdrawals"("user_id", "status");

-- CreateIndex
CREATE INDEX "idx_withdrawals_hash" ON "withdrawals"("transaction_hash");

-- CreateIndex
CREATE INDEX "idx_withdrawals_created" ON "withdrawals"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "explorer_transaction_hash_key" ON "explorer"("transaction_hash");

-- CreateIndex
CREATE UNIQUE INDEX "swaps_transaction_hash_key" ON "swaps"("transaction_hash");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_address_key" ON "users"("wallet_address");

-- AddForeignKey
ALTER TABLE "user_holdings" ADD CONSTRAINT "user_holdings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_holdings" ADD CONSTRAINT "user_holdings_lst_mint_address_fkey" FOREIGN KEY ("lst_mint_address") REFERENCES "lst_tokens"("mint_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_lst_mint_address_fkey" FOREIGN KEY ("lst_mint_address") REFERENCES "lst_tokens"("mint_address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_lst_mint_address_fkey" FOREIGN KEY ("lst_mint_address") REFERENCES "lst_tokens"("mint_address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_deposit_fkey" FOREIGN KEY ("reference_id") REFERENCES "deposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_withdrawal_fkey" FOREIGN KEY ("reference_id") REFERENCES "withdrawals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explorer" ADD CONSTRAINT "explorer_swap_fkey" FOREIGN KEY ("reference_id") REFERENCES "swaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "epoch_profits" ADD CONSTRAINT "epoch_profits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "epoch_profits" ADD CONSTRAINT "epoch_profits_best_performing_lst_fkey" FOREIGN KEY ("best_performing_lst") REFERENCES "lst_tokens"("mint_address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "epoch_profits" ADD CONSTRAINT "epoch_profits_worst_performing_lst_fkey" FOREIGN KEY ("worst_performing_lst") REFERENCES "lst_tokens"("mint_address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_source_lst_mint_fkey" FOREIGN KEY ("source_lst_mint") REFERENCES "lst_tokens"("mint_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swaps" ADD CONSTRAINT "swaps_destination_lst_mint_fkey" FOREIGN KEY ("destination_lst_mint") REFERENCES "lst_tokens"("mint_address") ON DELETE RESTRICT ON UPDATE CASCADE;
