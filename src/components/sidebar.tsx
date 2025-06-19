"use client";

import React, { useEffect, useState } from "react";
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
  Lock,
  HelpCircle,
  Plus,
  TriangleRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  {
    icon: Plus,
    label: "Make a Trendscreen",
    href: "/app/trendscreen",
  },
  {
    icon: HelpCircle,
    label: "FAQ",
    href: "/app/faq",
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

interface SidebarProps {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen = false,
  toggleSidebar,
}) => {
  const [activeLink, setActiveLink] = React.useState<string | null>(
    usePathname() ? "/" + usePathname().split("/")[1] : null
  );
  const [userTrends, setUserTrends] = React.useState<userTrend[]>([]);
  const [dropdownStates, setDropdownStates] = React.useState({
    twitter: true,
    instagram: true,
    tiktok: true,
  });

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const toggleDropdown = (platform: "twitter" | "instagram" | "tiktok") => {
    setDropdownStates((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const filterTrendsByPlatform = (platform: string) => {
    return userTrends.filter((trend) => {
      return trend.urls.some((url) => {
        const lowerUrl = url.toLowerCase();
        switch (platform) {
          case "twitter":
            return (
              lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")
            );
          case "instagram":
            return lowerUrl.includes("instagram.com");
          case "tiktok":
            return lowerUrl.includes("tiktok.com");
          default:
            return false;
        }
      });
    });
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
    <aside
      className={`fixed top-0 left-0 h-screen overflow-y-auto bg-black/20 backdrop-blur-2xl w-full md:w-64 pt-10 md:pt-0 z-50 flex flex-col ${
        isSidebarOpen ? "block" : "hidden"
      }`}
    >
      {/* Logo */}
      <div
        className="flex text-center cursor-pointer text-blue-400 items-center justify-start w-full font-medium text-shadow-xs dark:text-shadow-white/10 mt-3 h-16 px-8 text-xl"
        onClick={() => {
          window.location.href = "/";
          toggleSidebar?.();
        }}
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
              window.location.href = `/app/search?q=${encodeURIComponent(
                input.value.trim()
              )}`;
            }
            toggleSidebar?.();
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
            onClick={() => {
              handleLinkClick(item.href);
              toggleSidebar?.();
            }}
            className={`overflow-hidden flex items-center my-0 px-4 py-1.5 rounded-[8px] text-gray-600 dark:text-neutral-400 text-sm hover:bg-[#E9E9EA] hover:text-black hover:dark:!bg-[#000000] hover:dark:!text-white transition
              ${
                activeLink === item.href &&
                "!bg-[#E9E9EA] !text-black dark:!bg-[#000000] dark:!text-white"
              }
              px-6 py-3 md:px-4 md:py-3
            `}
          >
            {item.icon && <item.icon className="w-4 h-4 mr-3" />}
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
        <hr className="border-t border-gray-300 dark:border-neutral-700 my-2 mx-2 opacity-0" />
        <SignedIn>
          {/* Twitter Section */}
          <div>
            <button
              onClick={() => toggleDropdown("twitter")}
              className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400 font-semibold mb-2 px-4 py-2 hover:bg-[#E9E9EA] hover:text-black hover:dark:bg-[#000000] hover:dark:text-white rounded-[8px] transition"
            >
              <div className="flex items-center">
                Twitter
                <span className="text-green-400 ml-2">●</span>
              </div>
              {dropdownStates.twitter ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {dropdownStates.twitter && (
              <div className="ml-2 space-y-1">
                {filterTrendsByPlatform("twitter").map((item) => (
                  <Link
                    key={`twitter-${item.id}`}
                    href={`/app/trendscreen/${item.id}`}
                    onClick={() => {
                      handleLinkClick(`/app/trendscreen/${item.id}`);
                      toggleSidebar?.();
                    }}
                    className={`overflow-hidden flex items-center my-0 px-4 py-1.5 rounded-[8px] text-gray-600 dark:text-neutral-400 text-sm hover:bg-[#E9E9EA] hover:text-black hover:dark:!bg-[#000000] hover:dark:!text-white transition
                    ${
                      activeLink === `/app/trendscreen/${item.id}` &&
                      "!bg-[#E9E9EA] !text-black dark:!bg-[#000000] dark:!text-white"
                    }
                    px-6 py-3 md:px-4 md:py-3
                  `}
                  >
                    <span className="text-sm w-full truncate text-ellipsis">
                      {item.name || item.urls[0]}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Instagram Section */}
          <div>
            <button
              onClick={() => toggleDropdown("instagram")}
              className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400 font-semibold mb-2 px-4 py-2 hover:bg-[#E9E9EA] hover:text-black hover:dark:bg-[#000000] hover:dark:text-white rounded-[8px] transition"
            >
              <div className="flex items-center">
                Instagram
                <span className="text-green-400 ml-2">●</span>
              </div>
              {dropdownStates.instagram ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {dropdownStates.instagram && (
              <div className="ml-2 space-y-1">
                {filterTrendsByPlatform("instagram").map((item) => (
                  <Link
                    key={`instagram-${item.id}`}
                    href={`/app/trendscreen/${item.id}`}
                    onClick={() => {
                      handleLinkClick(`/app/trendscreen/${item.id}`);
                      toggleSidebar?.();
                    }}
                    className={`overflow-hidden flex items-center my-0 px-4 py-1.5 rounded-[8px] text-gray-600 dark:text-neutral-400 text-sm hover:bg-[#E9E9EA] hover:text-black hover:dark:!bg-[#000000] hover:dark:!text-white transition
                    ${
                      activeLink === `/app/trendscreen/${item.id}` &&
                      "!bg-[#E9E9EA] !text-black dark:!bg-[#000000] dark:!text-white"
                    }
                    px-6 py-3 md:px-4 md:py-3
                  `}
                  >
                    <span className="text-sm w-full truncate text-ellipsis">
                      {item.name || item.urls[0]}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* TikTok Section */}
          <div>
            <button
              onClick={() => toggleDropdown("tiktok")}
              className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400 font-semibold mb-2 px-4 py-2 hover:bg-[#E9E9EA] hover:text-black hover:dark:bg-[#000000] hover:dark:text-white rounded-[8px] transition"
            >
              <div className="flex items-center">
                TikTok
                <span className="text-green-400 ml-2">●</span>
              </div>
              {dropdownStates.tiktok ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {dropdownStates.tiktok && (
              <div className="ml-2 space-y-1">
                {filterTrendsByPlatform("tiktok").map((item) => (
                  <Link
                    key={`tiktok-${item.id}`}
                    href={`/app/trendscreen/${item.id}`}
                    onClick={() => {
                      handleLinkClick(`/app/trendscreen/${item.id}`);
                      toggleSidebar?.();
                    }}
                    className={`overflow-hidden flex items-center my-0 px-4 py-1.5 rounded-[8px] text-gray-600 dark:text-neutral-400 text-sm hover:bg-[#E9E9EA] hover:text-black hover:dark:!bg-[#000000] hover:dark:!text-white transition
                    ${
                      activeLink === `/app/trendscreen/${item.id}` &&
                      "!bg-[#E9E9EA] !text-black dark:!bg-[#000000] dark:!text-white"
                    }
                    px-6 py-3 md:px-4 md:py-3
                  `}
                  >
                    <span className="text-sm w-full truncate text-ellipsis">
                      {item.name || item.urls[0]}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <hr className="border-t border-gray-300 dark:border-neutral-700 my-2 mx-2 opacity-0" />
        </SignedIn>
        <SignedOut>
          <div className="flex items-center justify-center w-full px-4">
            <p className="text-gray-600 dark:text-neutral-400 text-sm">
              Please log in to view your trend screens.
            </p>
          </div>
        </SignedOut>
      </nav>
    </aside>
  );
};

export default Sidebar;
