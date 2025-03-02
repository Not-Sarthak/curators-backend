"use client";

import Image from "next/image";
import { STYLES } from "../styles/styles";
import { Rubik_Puddles } from "next/font/google";
import { useEffect, useState } from "react";
import { animationKeyframes, cloudAnimations } from "@/styles/animations";
import { InvestButton } from "@/components/buttons/buttons";

const rubikPuddles = Rubik_Puddles({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    setMounted(true);
      
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      <style jsx global>
        {animationKeyframes}
      </style>

      <div
        className={`${STYLES.mainContainer} -z-2 flex-col gap-y-0 md:gap-y-2 relative overflow-hidden`}
      >
        <div className="text-center text-[#0A342A] md:text-white text-4xl md:text-5xl font-normal leading-[57.60px] [text-shadow:_-6px_11px_11px_rgb(4_18_21_/_0.50)]">
          Curate the{" "}
          <span
            className={`${rubikPuddles.className} relative inline-block`}
            style={{
              color: isLargeScreen ? "white" : "#0A342A",
              WebkitTextStroke: isLargeScreen ? "1px white" : "1px #0A342A",
              padding: "0 4px",
            }}
          >
            Best
          </span>{" "}
          APYs
        </div>
        <div className="text-center text-[#0A342A] md:text-white text-[20px] md:text-[28px] font-normal leading-[29.40px] [text-shadow:_-6px_11px_11px_rgb(4_18_21_/_0.50)]">
          <span className="md:hidden">
            your SOL money&apos;s<br />Lifelong Secret Teammate
          </span>
          <span className="hidden md:inline">
            your SOL money&apos;s Lifelong Secret Teammate
          </span>
        </div>
        <div className="pt-4">
          <InvestButton />
        </div>

        <div className="absolute hidden md:block top-0 right-0 transition-transform ease-out">
          <Image
            src="/above-cloud.svg"
            alt="above-cloud"
            width={400}
            height={400}
            style={mounted ? cloudAnimations.topCloud : {}}
            className="will-change-transform"
          />
        </div>

        <div className="absolute hidden md:block bottom-0 left-0 -z-1 transition-transform ease-out">
          <Image
            src="/bottom-cloud.svg"
            alt="bottom-cloud"
            width={400}
            height={400}
            style={mounted ? cloudAnimations.bottomCloud : {}}
            className="will-change-transform"
          />
        </div>
      </div>
    </>
  );
}
