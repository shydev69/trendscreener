"use client";

import React from "react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow z-50 flex flex-col">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b font-bold text-2xl text-blue-600">
        trendscreener
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-2 mt-6 px-4">
        <a
          href="/trendslist"
          className="flex items-center px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
        >
          Make a TrendsList
        </a>
        <a
          href="/faq"
          className="flex items-center px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
        >
          FAQ
        </a>
      </nav>

      {/* Auth/Profile Section */}
      <div className="px-4 py-6 border-t flex flex-col space-y-3">
        <SignedOut>
          <SignInButton>
            <button className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="w-full px-4 py-2 rounded bg-gray-200 text-blue-600 hover:bg-gray-300 transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </aside>
  );
};

export default Sidebar;
