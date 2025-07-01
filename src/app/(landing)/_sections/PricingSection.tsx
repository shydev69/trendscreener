"use client";

import React from "react";
import localFont from "next/font/local";
import { ArrowRight, BarChart3, TrendingUp, Users, Zap } from "lucide-react";

const myFont = localFont({
  src: "./fonts/font.ttf",
  display: "swap",
});

const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="w-[94vw] h-full md:min-h-[94vh] my-[3vh] lg:pb-10 rounded-4xl overflow-hidden bg-black text-white flex mx-auto flex-col items-center text-center relative sm:px-6 lg:px-8 z-1"
    >
      <div className="relative antialiased w-full justify-center items-center absolute inset -top-[50vh] blur-xl z-1 pointer-events-none">
        <div className="absolute w-[100vh] h-[70vh] bg-radial from-[#60a5fa] to-transparent top-[5vh] left-[-30%] rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute w-[50vh] h-[50vh] bg-radial from-[#60a5fa]/40 to-transparent top-[100vh] left-[40%] rounded-full blur-[200px] pointer-events-none"></div>
        <div className="absolute w-[70vh] h-[100vh] bg-radial from-[#60a5fa] to-transparent top-[140vh] rounded-full blur-3xl left-[85%] pointer-events-none"></div>
      </div>

      <div className="w-full flex flex-col items-center justify-center pt-[14vh] pb-20 z-10 px-5 md:px-10 relative">
        <h2
          className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl text-shine text-[#e5eae6] w-full max-w-4xl mt-0 ${myFont.className}`}
        >
          Plans for Every Content Creator
        </h2>
        <p className="text-sm sm:text-base text-[#e5eae6]/50 mt-6 sm:mt-8 max-w-2xl px-4">
          Choose a plan that fits your social media analytics needs. From
          individual creators to enterprises, we provide{" "}
          <span className="text-[#e5eae6]">
            powerful trend analysis so you can focus on growth.
          </span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-8 xl:grid-cols-8 gap-y-8 mt-14 w-full max-w-6xl relative">
          {/* Starter Plan */}
          <div className="md:col-span-4 flex flex-col items-start justify-start lg:-mr-3 lg:scale-95 shadow-[#ffffff]/10 shadow-xl text-left overflow-hidden bg-[#ffffff11] backdrop-blur-lg rounded-3xl min-h-[500px] p-10 relative">
            <h3
              className={`text-lg md:text-xl lg:text-2xl text-shine text-[#e5eae6] w-full max-w-4xl mt-0 ${myFont.className}`}
            >
              Starter
            </h3>
            <div
              className={`text-4xl md:text-5xl lg:text-6xl text-[#e5eae6] mt-3 ${myFont.className}`}
            >
              <span className="text-shine">$29</span>
              <span className="text-[#e5eae6]/70 text-sm sm:text-base">
                /mo.
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#e5eae6]/50 mt-6 max-w-3xl">
              Get essential trend tracking features including{" "}
              <span className="text-[#e5eae6]">
                basic analytics, trend lists, and engagement monitoring
              </span>{" "}
              to grow your social presence.
            </p>
            <div className="bg-[#e5eae6]/10 h-0.5 rounded-full w-full my-6" />
            <p className="text-sm sm:text-base text-[#e5eae6]/50 max-w-3xl">
              Perfect for individual creators and small accounts.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#e5eae6]/70" />
                <p className="text-sm sm:text-base text-[#e5eae6]/70">
                  Up to 5 trend lists
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#e5eae6]/70" />
                <p className="text-sm sm:text-base text-[#e5eae6]/70">
                  Basic analytics dashboard
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#e5eae6]/70" />
                <p className="text-sm sm:text-base text-[#e5eae6]/70">
                  Track up to 100 posts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#e5eae6]/70" />
                <p className="text-sm sm:text-base text-[#e5eae6]/70">
                  Weekly trend reports
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#e5eae6]/70" />
                <p className="text-sm sm:text-base text-[#e5eae6]/70">
                  Basic engagement metrics
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#e5eae6]/70" />
                <p className="text-sm sm:text-base text-[#e5eae6]/70">
                  Email support
                </p>
              </div>
            </div>
            <button className="mt-8 bg-[#ffffff22] backdrop-blur-xl w-full text-[#e5eae6] px-6 py-3 flex justify-between items-center rounded-full hover:bg-[#ffffff33] transition-colors">
              Get Started
              <ArrowRight className="w-6 h-6 translate-x-0 transition-all duration-200" />
            </button>
          </div>

          {/* Pro Plan */}
          <div className="md:col-span-4 flex flex-col items-start bg-[#2563eb]/50 justify-start text-left lg:-ml-3 shadow-[#ffffff]/10 shadow-xl overflow-hidden lg:scale-105 backdrop-blur-lg rounded-3xl min-h-[500px] p-10 relative">
            <div className="relative antialiased w-full justify-center items-center absolute inset -top-[50vh] blur-xl -z-1">
              <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa] to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px]"></div>
              <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#ffffff]/20 -rotate-45 to-transparent top-[45vh] blur-2xl left-[95%]"></div>
              <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#ffffff]/40 -rotate-45 to-transparent top-[20vh] left-[60%]"></div>
              <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa] to-transparent top-[200vh] rounded-full blur-3xl left-[-20%]"></div>
              <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#ffffff]/60 -rotate-45 to-transparent top-[20vh] blur-xl left-[120%]"></div>
              <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#60a5fa]/50 -rotate-45 to-transparent top-[-20vh] blur-3xl left-[80%]"></div>
            </div>
            <div className="relative antialiased w-full justify-center items-center absolute inset z-1">
              <div className="absolute border border-[#e5eae6]/30 w-[100%] h-[32.5vh] rounded-[70px] -top-[20vh] -left-[50%]"></div>
            </div>
            <h3
              className={`text-lg md:text-xl lg:text-2xl text-shine text-[#93c5fd] w-full max-w-4xl mt-0 ${myFont.className}`}
            >
              Professional
            </h3>
            <div
              className={`text-4xl md:text-5xl lg:text-6xl text-[#93c5fd] mt-3 ${myFont.className}`}
            >
              <span className="text-shine bg-gradient-to-br from-[#93c5fd] via-[#93c5fd] to-[#93c5fd] bg-clip-text text-transparent">
                $89
              </span>
              <span className="opacity-80 text-sm sm:text-base">/mo.</span>
            </div>
            <p className="text-sm sm:text-base text-[#e5eae6]/70 mt-6 max-w-3xl">
              Advanced analytics with{" "}
              <span className="text-[#e5eae6]">
                unlimited trend lists, real-time monitoring, advanced insights,
                and priority support
              </span>{" "}
              for serious content creators.
            </p>
            <div className="bg-[#e5eae6]/10 h-0.5 rounded-full w-full my-6" />
            <p className="text-sm sm:text-base text-[#e5eae6] max-w-3xl">
              Perfect for agencies and growing brands.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#e5eae6]" />
                <p className="text-sm sm:text-base text-[#e5eae6]">
                  Unlimited trend lists
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#e5eae6]" />
                <p className="text-sm sm:text-base text-[#e5eae6]">
                  Advanced analytics dashboard
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#e5eae6]" />
                <p className="text-sm sm:text-base text-[#e5eae6]">
                  Track unlimited posts
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#e5eae6]" />
                <p className="text-sm sm:text-base text-[#e5eae6]">
                  Real-time notifications
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#e5eae6]" />
                <p className="text-sm sm:text-base text-[#e5eae6]">
                  Advanced engagement insights
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#e5eae6]" />
                <p className="text-sm sm:text-base text-[#e5eae6]">
                  Priority support & consultation
                </p>
              </div>
            </div>
            <button className="mt-8 bg-[#93c5fd]/90 w-full text-black px-6 py-3 flex justify-between items-center rounded-full hover:bg-[#93c5fd] transition-colors">
              Get Started
              <ArrowRight className="w-6 h-6 translate-x-0 transition-all duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
