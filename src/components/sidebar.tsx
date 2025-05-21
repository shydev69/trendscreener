"use client";

import React from "react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import {
  ArrowRight,
  ArrowRightCircle,
  HelpCircle,
  Plus,
  TriangleRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  {
    icon: Plus,
    label: "Make a Trendscreen",
    href: "/trendscreen",
  },
  {
    icon: HelpCircle,
    label: "FAQ",
    href: "/faq",
  },
];

interface userTrend {
  id: string;
  name: string;
  urls: string[];
  analysis: string;
  creatorId: string;
  isPublic: boolean;
  updatedAt: string;
  createdAt: string;
}

const Sidebar: React.FC = () => {
  const [activeLink, setActiveLink] = React.useState<string | null>(
    usePathname() ? "/" + usePathname().split("/")[1] : null
  );
  const [userTrends, setUserTrends] = React.useState<userTrend[]>([]);
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };
  function getUserTrends() {
    fetch(`/api/getUserTrends`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserTrends(data.trends);
        } else {
          console.error("Error fetching user trends:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching user trends:", error);
      });
  }
  React.useEffect(() => {
    getUserTrends();
  }, []);
  return (
    <aside className="fixed top-0 left-0 bg-black/20 backdrop-blur-2xl h-full w-full md:w-64 pt-10 md:pt-0 z-50 flex flex-col">
      {/* Logo */}
      <div
        className="flex text-center cursor-pointer text-blue-400 items-center justify-start w-full font-medium text-shadow-xs dark:text-shadow-white/10 mt-3 h-16 px-8 text-xl"
        onClick={() => (window.location.href = "/")}
      >
        <img
          src="/logo.png"
          alt="Logo"
          className="w-10 h-10 mr-1 rounded-full"
        />
        Trendscreener
      </div>{" "}
      <div className="w-full flex lg:hidden justify-center px-8">
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
            className="w-full rounded-[8px] max-w-xl px-4 py-3 md:py-2 bg-white dark:bg-black/30 text-black text-center dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
          />
        </form>
      </div>
      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-2 mt-2 px-4">
        {" "}
        {links.map((item) => (
          <Link
            key={item.label}
            href={`${item.href}`}
            onClick={() => handleLinkClick(item.href)}
            className={`overflow-hidden flex items-center my-0 px-4 py-1.5 rounded-[8px] text-gray-600 dark:text-neutral-400 text-sm hover:bg-[#E9E9EA] hover:text-black hover:dark:!bg-[#000000] hover:dark:!text-white transition
              ${
                activeLink === item.href &&
                "!bg-[#E9E9EA] !text-black dark:!bg-[#000000] dark:!text-white"
              }
              px-6 py-3 md:px-4 md:py-1.5
            `}
          >
            {item.icon && <item.icon className="w-4 h-4 mr-3" />}
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
        <hr className="border-t border-gray-300 dark:border-neutral-700 my-3 mx-2 opacity-0" />
        {userTrends.map((item) => (
          <Link
            key={item.id}
            href={`/trendscreen/${item.id}`}
            onClick={() => handleLinkClick(`/trendscreen/${item.id}`)}
            className={`overflow-hidden flex items-center my-0 px-4 py-1.5 rounded-[8px] text-gray-600 dark:text-neutral-400 text-sm hover:bg-[#E9E9EA] hover:text-black hover:dark:!bg-[#000000] hover:dark:!text-white transition
              ${
                activeLink === `/trendscreen/${item.id}` &&
                "!bg-[#E9E9EA] !text-black dark:!bg-[#000000] dark:!text-white"
              }
              px-6 py-3 md:px-4 md:py-1.5
            `}
          >
            <span className="text-sm w-full truncate text-ellipsis">
              {item.name || item.urls[0]}
            </span>
          </Link>
        ))}
      </nav>
      <nav className="flex-1 flex flex-col space-y-2 mt-2 px-4"></nav>{" "}
      {/* Auth/Profile Section */}
      {/*<div className="px-4 py-6 flex flex-col gap-y-1">
        <SignedOut>
          <SignInButton>
            <button className="overflow-hidden flex items-center my-0 px-4 py-2 rounded-[8px] text-gray-600 dark:text-neutral-400 text-sm hover:underline hover:text-black dark:hover:text-white transition justify-center text-center">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="overflow-hidden flex items-center my-0 px-4 py-2 rounded-[8px] bg-gradient-to-br from-[#000000] to-black/90 dark:to-white/10 border text-white/80 text-sm hover:text-white transition justify-center text-center">
              Sign Up <ArrowRightCircle className="w-4 h-4 ml-2" />
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className="w-full flex items-center justify-end my-2 px-8">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
        
      </div>*/}
    </aside>
  );
};

export default Sidebar;
