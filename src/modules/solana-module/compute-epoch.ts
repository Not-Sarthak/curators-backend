import { EpochInfo, InflationRate } from "../../types";

export function computeEpochData(epochInfo: EpochInfo, inflationRate: InflationRate) {
  const slotIndex = epochInfo.slotIndex;
  const slotsInEpoch = epochInfo.slotsInEpoch;
  const epochProgress = ((slotIndex / slotsInEpoch) * 100).toFixed(2);

  const secondsPerSlot = 0.4;
  const remainingSlots = slotsInEpoch - slotIndex;
  const remainingSeconds = remainingSlots * secondsPerSlot;
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const timeRemainingInEpoch = `${days}d ${hours}h ${minutes}m`;

  const totalInflation = inflationRate.total;
  const validatorAllocation = inflationRate.validator;
  const stakeRatio = 0.8;
  const baseSolStakingApy = ((totalInflation * validatorAllocation) / stakeRatio) * 100;

  return {
    epochProgress: parseFloat(epochProgress),
    timeRemainingInEpoch,
    baseSolStakingApy: parseFloat(baseSolStakingApy.toFixed(2)),
  };
}