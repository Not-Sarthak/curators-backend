import { Rubik_Puddles } from "next/font/google";

const rubikPuddles = Rubik_Puddles({
  weight: "400",
  subsets: ["latin"],
});

interface LoadingProps {
  loadingProgress: number;
}

export const Loading = ({ loadingProgress }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[92vh] rounded-[36px] bg-gradient-to-br from-[#0A342A] to-[#041215] p-4">
      
      <div className="w-full max-w-md">
        <div className="text-center text-white text-3xl mb-8 font-normal [text-shadow:_-4px_8px_8px_rgb(4_18_21_/_0.50)]">
          Curate the{" "}
          <span
            className={`${rubikPuddles.className} relative inline-block`}
            style={{
              color: "white",
              WebkitTextStroke: "1px white",
              padding: "0 4px",
            }}
          >
            Best
          </span>{" "}
          APYs
        </div>
        
        <div className="relative h-8 bg-[#041215]/50 rounded-full overflow-hidden border border-[#0A342A]/30 backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-[#0A342A] to-[#0A342A]/70 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {Math.round(loadingProgress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
