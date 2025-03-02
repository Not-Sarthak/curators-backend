/*
  Warnings:

  - You are about to drop the column `activated_stake` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `commission` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `skip_rate` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `stake_ratio` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `staking_version` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `uptime` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `validator_identity` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `vote_identity` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `vote_success` on the `lst_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `wiz_score` on the `lst_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lst_tokens" DROP COLUMN "activated_stake",
DROP COLUMN "commission",
DROP COLUMN "skip_rate",
DROP COLUMN "stake_ratio",
DROP COLUMN "staking_version",
DROP COLUMN "uptime",
DROP COLUMN "validator_identity",
DROP COLUMN "vote_identity",
DROP COLUMN "vote_success",
DROP COLUMN "wiz_score";
