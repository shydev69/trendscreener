import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BadgeDollarSign,
  Share,
  TrendingUp,
} from "lucide-react";
import localFont from "next/font/local";
import Link from "next/link";
const myFont = localFont({
  src: "./fonts/font.ttf",
  display: "swap",
});

export const HeroSection = () => {
  return (
    <section className="w-[94vw] md:h-[88vh] rounded-4xl overflow-hidden bg-black text-white flex mx-auto flex-col items-center text-center relative sm:px-6 lg:px-8 z-1">
      <div className="relative antialiased w-full justify-center items-center absolute inset -top-[50vh] blur-xl z-1">
        <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa] to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[45vh] left-[95%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[20vh] left-[60%]"></div>
        <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa] to-transparent top-[100vh] rounded-full blur-3xl left-[-20%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[20vh] left-[40%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[20vh] blur-3xl left-[30%]"></div>
      </div>
      <div className="relative antialiased w-full justify-center items-center absolute inset z-1">
        <div className="absolute border border-[#e5eae6] w-[40vw] h-[40vh] rounded-[70px] -top-[12.5vh] -left-[22vw] opacity-0 md:opacity-30"></div>
        <div className="absolute border border-[#e5eae6] w-[40vw] h-[40vh] rounded-[70px] top-[65vh] -left-[14vw] opacity-0 md:opacity-30"></div>
        <div className="absolute border border-[#e5eae6] w-[40vw] h-[40vh] rounded-[70px] -top-[20vh] -right-[18vw] opacity-0 md:opacity-30"></div>
        <div className="absolute border border-[#e5eae6] w-[40vw] h-[40vh] rounded-[70px] top-[75vh] -right-[20vw] opacity-0 md:opacity-30"></div>
        <Share className="absolute border border-[#e5eae6]/30 p-2.5 w-12 h-12 text-[#e5eae6] rounded-[50px] backdrop-blur-xl top-[25vh] left-[8vw] opacity-0 md:opacity-100" />
        <Atom className="absolute border border-[#e5eae6]/30 p-2.5 w-12 h-12 text-[#e5eae6] rounded-[50px] backdrop-blur-xl top-[17.5vh] right-[8vw] opacity-0 md:opacity-100" />
        <BadgeDollarSign className="absolute border border-[#e5eae6]/30 p-2.5 w-12 h-12 text-[#e5eae6] rounded-[50px] backdrop-blur-xl top-[62.5vh] left-[10vw] opacity-0 md:opacity-100" />
        <TrendingUp className="absolute border border-[#e5eae6]/30 p-2.5 w-12 h-12 text-[#e5eae6] rounded-[50px] backdrop-blur-xl top-[72.5vh] right-[12vw] opacity-0 md:opacity-100" />
        <div className="absolute bg-gradient-to-b from-transparent via-[#e5eae6]/50 w-[3px] h-[50vh] rounded-[70px] top-[65vh] left-[50%]"></div>
        <div className="absolute bg-gradient-to-b from-transparent via-[#e5eae6]/50 w-[3px] h-[50vh] rounded-[70px] top-[60vh] left-[45%]"></div>
        <div className="absolute bg-gradient-to-b from-transparent via-[#e5eae6]/50 w-[3px] h-[50vh] rounded-[70px] top-[70vh] left-[55%]"></div>
        <div className="absolute bg-gradient-to-b from-transparent via-[#e5eae6]/50 w-[3px] h-[50vh] rounded-[70px] top-[62.5vh] left-[47.5%]"></div>
        <div className="absolute bg-gradient-to-b from-transparent via-[#e5eae6]/50 w-[3px] h-[50vh] rounded-[70px] top-[67.5vh] left-[52.5%]"></div>
        <div className="absolute bg-gradient-to-b from-transparent to-[#e5eae6] w-[3px] h-[10vh] rounded-[70px] top-[65vh] left-[50%]"></div>
        <div className="absolute bg-gradient-to-b from-transparent to-[#e5eae6] w-[3px] h-[10vh] rounded-[70px] top-[60vh] left-[45%]"></div>
        <div className="absolute bg-gradient-to-b from-transparent to-[#e5eae6] w-[3px] h-[10vh] rounded-[70px] top-[70vh] left-[55%]"></div>
      </div>
      <div className="w-full flex flex-col items-center justify-center pt-[17vh] pb-20 z-10 px-10 relative">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-shine font-medium text-[#e5eae6] w-full max-w-4xl mt-8 ${myFont.className}`}
        >
          Analyse and Trade Social Trends Like Never Before.
        </h1>
        <h1
          className={`text-xl sm:text-xl md:text-xl lg:text-xl text-shine font-medium text-[#e5eae6] w-full max-w-4xl mt-8 ${myFont.className}`}
        >
          One trend = One CA
        </h1>
        <p className="text-base text-[#e5eae6]/50 mt-8 sm:mt-12 max-w-3xl px-4">
          <span className="text-[#e5eae6]">
            Create and analyze trends with advanced metrics
          </span>{" "}
          that track engagement across platforms. Our tools are built for{" "}
          <span className="text-[#e5eae6]">
            Traders seeking an edge in trading Tokenized Trends.
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 hover:gap-10 mt-8 sm:mt-12">
          <Link
            href="/app"
            className="font-semibold bg-[#ffffff22] px-2 py-2 text-[#e5eae6] flex justify-center items-center gap-4 hover:gap-6 hover:pl-8 hover:pr-4 pl-6 rounded-full"
          >
            Launch App
            <ArrowRight className="w-8 h-8 translate-x-0 transition-all duration-200 p-2 rounded-full text-white bg-[#2563eb] shadow shadow-[#2563eb]/80 shadow-xl" />
          </Link>
        </div>
      </div>{" "}
    </section>
  );
};
