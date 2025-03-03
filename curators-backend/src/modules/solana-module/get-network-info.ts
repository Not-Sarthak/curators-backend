import { Connection } from "@solana/web3.js";
import { NetworkPerformance } from "../../types";

const PERFORMANCE_SAMPLES = 60;

export const getNetworkPerformance = async (connection: Connection): Promise<NetworkPerformance> => {
    const perfSamples = await connection.getRecentPerformanceSamples(PERFORMANCE_SAMPLES);
    
    if (perfSamples.length === 0) {
      return {
        averageSlotTime: 0.4,
        currentTps: 0,
        maxTps: 0,
        averageTps: 0,
      };
    }
  
    const totalTps = perfSamples.reduce((acc, sample) => acc + sample.numTransactions / sample.samplePeriodSecs, 0);
    const averageTps = totalTps / perfSamples.length;
    const maxTps = Math.max(...perfSamples.map(sample => sample.numTransactions / sample.samplePeriodSecs));
    const currentTps = perfSamples[0].numTransactions / perfSamples[0].samplePeriodSecs;
    const averageSlotTime = perfSamples.reduce((acc, sample) => acc + sample.samplePeriodSecs, 0) / perfSamples.length;
  
    return {
      averageSlotTime,
      currentTps: Number(currentTps.toFixed(2)),
      maxTps: Number(maxTps.toFixed(2)),
      averageTps: Number(averageTps.toFixed(2)),
    };
  }
  