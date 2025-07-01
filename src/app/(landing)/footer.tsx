"use client";

import React from "react";
import localFont from "next/font/local";
import { ArrowRight } from "lucide-react";

const myFont = localFont({
  src: "./fonts/font.ttf",
  display: "swap",
});

const FooterSection = () => {
  return (
    <footer className="w-[94vw] mx-auto my-[3vh] rounded-4xl overflow-hidden bg-black text-[#e5eae6] flex flex-col items-center relative sm:px-6 lg:px-8 z-1">
      <div className="relative antialiased w-full justify-center items-center absolute inset -top-[50vh] blur-xl z-1 pointer-events-none">
        <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa]/50 to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[45vh] left-[95%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[25vh] left-[70%] pointer-events-none"></div>
        <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa] to-transparent top-[100vh] rounded-full blur-3xl left-[-20%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[10vh] left-[40%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-2xl h-[100vh] bg-radial from-[#60a5fa] -rotate-45 to-transparent top-[20vh] blur-[80px] left-[35%] pointer-events-none"></div>
      </div>
      <div className="w-full flex flex-col items-center justify-center pt-[8vh] pb-12 z-10 px-5 md:px-10 relative">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-start px-5">
            <h3
              className={`text-2xl text-shine text-[#e5eae6] ${myFont.className}`}
            >
              Trendscreener
            </h3>
            <p className="text-base text-[#e5eae6]/50 mt-4 max-w-xs">
              Powerful social media analytics and trend monitoring platform.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-start px-5">
            <h4 className={`text-lg text-[#e5eae6]`}>Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/"
                  className="text-base text-[#e5eae6]/70 hover:text-[#e5eae6] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/app"
                  className="text-base text-[#e5eae6]/70 hover:text-[#e5eae6] transition-colors"
                >
                  Dashboard
                </a>
              </li>

              <li>
                <a
                  href="/app/faq"
                  className="text-base text-[#e5eae6]/70 hover:text-[#e5eae6] transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="flex flex-col items-start px-5">
            <h4 className={`text-lg text-[#e5eae6]`}>Features</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/app/trendscreen"
                  className="text-base text-[#e5eae6]/70 hover:text-[#e5eae6] transition-colors"
                >
                  Create Trendscreen
                </a>
              </li>

              <li>
                <a
                  href="/sign-in"
                  className="text-base text-[#e5eae6]/70 hover:text-[#e5eae6] transition-colors"
                >
                  Sign In
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col items-start px-5">
            <h4 className={`text-lg text-[#e5eae6]`}>Stay Updated</h4>
            <p className="text-base text-[#e5eae6]/50 mt-4 max-w-xs">
              Subscribe to our newsletter for the latest social media trends and
              platform updates.
            </p>
            <div className="mt-4 w-full">
              <div className="flex items-center bg-[#ffffff11] backdrop-blur-lg rounded-full p-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent text-[#e5eae6]/70 text-base outline-none px-4 w-full placeholder:text-[#e5eae6]/40"
                />
                <button className="bg-[#2563eb] text-[#e5eae6] p-2 rounded-full hover:bg-[#2563eb]/80 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mt-12 pt-6 border-t border-[#e5eae6]/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-[#e5eae6]/50">
            &copy; {new Date().getFullYear()} Trendscreener. All rights
            reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0"></div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
