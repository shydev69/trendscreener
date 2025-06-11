"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
//import Image from "next/font";
import { useState } from "react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="h-content w-[94vw] mx-auto py-2 md:py-10 z-10000"
      style={{ zIndex: 10000 }}
    >
      <div className="flex flex-col items-center backdrop-blur-3xl rounded-[28px] w-full h-full relative">
        <div className="flex items-center justify-between w-full h-16">
          {/* Logo and mobile menu button */}
          <div className="pl-4 hover:scale-105 transition-transform duration-300">
            <img
              src="https://www.trendscreener.ai/logo.png"
              alt="trendscreener.ai logo"
              className="h-12 md:h-16 w-auto animate-soft-pulse"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center p-4 bg-white/5 rounded-full px-6">
            <nav>
              <ul className="flex space-x-4">
                {[
                  { name: "Trends", href: "/app" },
                  { name: "FAQ", href: "#faq" },
                  { name: "X", href: "https://x.com/trendscreener" },
                  {
                    name: "Instagram",
                    href: "https://www.instagram.com/trendscreenerai/",
                  },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="relative text-neutral-300 hover:text-white px-0 mx-2 py-1 transition-all duration-300 group overflow-hidden"
                    >
                      {item.name}
                      <span
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-white rounded-full via-neutral-200 to-transparent 
                                opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500 
                                transform translate-x-1/2 group-hover:translate-x-0 
                                animate-shine bg-[length:200%_auto]"
                      />
                      <span
                        className="absolute bottom-0 left-[50%] translate-x-[-50%] w-full h-px bg-white/20 scale-x-0 group-hover:scale-x-100 
                                transition-transform duration-300 origin-center"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden pr-4 z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block w-5 h-[2px] rounded-full bg-neutral-200 transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-[8px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-[2px] rounded-full bg-neutral-200 transition-all duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-5 h-[2px] rounded-full bg-neutral-200 transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[8px]" : ""
                }`}
              />
            </div>
          </button>

          {/* Desktop Download Button */}
             <SignedOut>
                {" "}   <div className="hidden md:flex items-center justify-end px-1 hover:p-0">
            <div className="rounded-full bg-gradient-to-br from-neutral-800 via-black to-neutral-800 !p-0.5 transition-transform duration-300">
        
                <button
                  onClick={() => (window.location.href = "/sign-in")}
                  className="px-6 hover:px-7 sm:hover:px-7 py-2 sm:py-2 group flex justify-center backdrop-blur-md items-center gap-0 shadow shadow-inner shadow-neutral-800/30 hover:shadow-neutral-700/50 drop-shadow drop-shadow-neutral-800/20 drop-shadow-xl hover:drop-shadow-neutral-700/30 bg-black hover:bg-neutral-900 rounded-full font-medium text-sm sm:text-base transition-all text-white duration-200"
                >
                  Sign In
                </button>
            </div>
          </div>
              </SignedOut>
              <SignedIn>
                <div className="px-0 pt-2">
                  <UserButton />
                </div>
              </SignedIn>
        </div>

        {/* Mobile Menu Content */}
        <div
          className={`md:hidden w-full overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/20 py-6 w-full">
            <nav>
              <ul className="flex flex-col space-y-3 items-center">
                {[
                  { name: "Trends", url: "/app" },
                  { name: "FAQ", url: "#faq" },
                  { name: "X", url: "https://x.com/trendscreener" },
                  {
                    name: "Instagram",
                    url: "https://www.instagram.com/trendscreenerai/",
                  },
                ].map((item) => (
                  <li key={item.name} className="w-full text-center">
                    <a
                      href={item.url}
                      className="text-neutral-300 hover:text-white text-lg py-2 block w-full transition-all duration-300"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
                <li className="w-full max-w-[300px]">
                    <SignedOut>
                      <div className="rounded-full w-full bg-gradient-to-br from-neutral-800 via-black to-neutral-800 !p-0.5 transition-transform duration-300">
                  <button
                        onClick={() => (window.location.href = "/sign-in")}
                        className="px-6 hover:px-7 w-full sm:hover:px-7 py-3 sm:py-2 group flex justify-center backdrop-blur-md items-center gap-0 hover:gap-2 shadow shadow-inner shadow-neutral-800/30 hover:shadow-neutral-700/50 drop-shadow drop-shadow-neutral-800/20 drop-shadow-xl hover:drop-shadow-neutral-700/30 bg-black hover:bg-neutral-900 rounded-full font-medium text-sm sm:text-base transition-all text-white duration-200"
                      >
                        Sign In
                      </button>
                  </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="px-0 pt-2">
                        <UserButton />
                      </div>
                    </SignedIn>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
