import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InvestButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const InvestButton: React.FC<InvestButtonProps> = ({
  label = "Start investing",
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "h-[54px] px-5 py-[15px] bg-[#f8e0d5]/0 rounded-xl shadow-[-18px_33px_16px_0px_rgba(6,14,11,0.36)] border border-white/25 backdrop-blur-sm flex items-center gap-1.5 text-[#0a342a] text-xl font-normal font-['Special Elite'] leading-[21px] transition-all hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {label}
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.5 18C11.6808 16.423 13.6364 14.5771 15.3172 12.5101C15.5609 12.2103 15.5609 11.7897 15.3172 11.4899C13.6364 9.42294 11.6808 7.57701 9.5 6"
          stroke="#0A342A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  );
};
