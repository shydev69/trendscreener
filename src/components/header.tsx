"use client";
import React from "react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

const Header: React.FC = () => {
  return (
    <header className="w-screen flex items-center justify-between fixed h-10 py-1 px-4 z-50 top-0 left-0">
      {/* Empty left side for spacing */}
      <div className="w-1/4" />
      {/* Centered input */}
      <div className="w-3/4 flex justify-center">
        <input
          type="text"
          placeholder="Search trends..."
          className="w-full rounded-[8px] max-w-xl px-4 py-1.5 bg-white dark:bg-neutral-900 text-black text-center dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
        />
      </div>
      {/* User profile on right */}
      <div className="w-1/4 flex justify-end items-center p-2">
        <SignedOut>
          <SignInButton>
            <button className="ml-2 px-4 py-1 rounded-[8px] bg-gradient-to-br from-[#34353C] to-black/90 dark:to-white/10 border text-white/80 text-sm hover:text-white transition">
              Continue with Google
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="px-0 pt-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
