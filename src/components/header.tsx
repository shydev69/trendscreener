"use client";
import React from "react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  GoogleOneTap,
} from "@clerk/clerk-react";
import Sidebar from "./sidebar";
import { Ham, List } from "lucide-react";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <header className="w-screen flex items-center justify-between fixed h-14 md:h-10 py-1 px-4 z-50 top-0 left-0">
      {/* Empty left side for spacing */}

      <div className="w-1/4">
        <List
          onClick={toggleSidebar}
          className="w-6 h-6 text-white cursor-pointer md:hidden"
        />
      </div>
      {/* Centered input */}
      <div className="w-0 md:w-full lg:w-3/4 flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem(
              "search"
            ) as HTMLInputElement;
            if (input.value.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(
                input.value.trim()
              )}`;
            }
          }}
          className="w-full max-w-xl"
        >
          <input
            type="text"
            name="search"
            placeholder="Search trends..."
            className="hidden lg:block w-full rounded-[8px] max-w-xl px-4 py-1.5 bg-white dark:bg-neutral-900 text-black text-center dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
          />
        </form>
      </div>
      {/* User profile on right */}
      <div className="w-full md:w-2/4 lg:w-1/4 flex justify-end items-center p-2">
        <SignedOut>
          <SignInButton>
            <button className="ml-2 px-4 py-1 rounded-[8px] bg-gradient-to-br from-[#34353C] to-black/90 dark:to-white/10 border text-white/80 text-sm hover:text-white transition">
              Continue with Google
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="px-0 pt-2">
            <UserButton />
          </div>
        </SignedIn>
      </div>
      <div
        className={`-z-1 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-all"
            : "opacity-0 pointer-events-none"
        } block md:hidden transition ease-in-out`}
      >
        <Sidebar />
      </div>
    </header>
  );
};

export default Header;
