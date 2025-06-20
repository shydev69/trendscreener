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
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTrend } from "@/contexts/TrendContext";
import { Switch } from "@/components/ui/switch";

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
  const { currentUrls } = useTrend();
  const [activeLink, setActiveLink] = React.useState<string | null>(
    usePathname() ? "/" + usePathname().split("/")[1] : null
  );
  const [userTrends, setUserTrends] = React.useState<userTrend[]>([]);
  const [publicTrends, setPublicTrends] = React.useState<userTrend[]>([]);
  const [currentTrendData, setCurrentTrendData] =
    React.useState<userTrend | null>(null);
  const [isLoadingTrends, setIsLoadingTrends] = React.useState(true);

  // State for platform filtering on dashboard/search pages
  const [platformSwitches, setPlatformSwitches] = React.useState({
    twitter: true,
    instagram: true,
    tiktok: true,
  });

  // Get current trend ID from pathname
  const pathname = usePathname();
  const currentTrendId =
    pathname.includes("/app/trendscreen/") &&
    pathname.split("/app/trendscreen/")[1]?.split("?")[0]
      ? pathname.split("/app/trendscreen/")[1].split("?")[0]
      : null;

  // Get current trend data from cached lists or individual fetch
  const allTrends = [...userTrends, ...publicTrends];
  const currentTrend = currentTrendId
    ? allTrends.find((trend) => trend.id === currentTrendId) || currentTrendData
    : null;

  // Check if current trend has posts from specific platform
  const currentTrendHasPlatform = (platform: string) => {
    if (!currentTrend) return false;

    const hasPlatform = currentTrend.urls.some((url) => {
      const lowerUrl = url.toLowerCase();
      switch (platform) {
        case "twitter":
          return lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com");
        case "instagram":
          return lowerUrl.includes("instagram.com");
        case "tiktok":
          return lowerUrl.includes("tiktok.com");
        default:
          return false;
      }
    });

    // Debug logging - remove this later
    console.log(`Platform ${platform}:`, hasPlatform, currentTrend.urls);

    return hasPlatform;
  };

  // Check if current URLs (from create page) have posts from specific platform
  const currentUrlsHasPlatform = (platform: string) => {
    if (!currentUrls.length) return false;

    return currentUrls.some((url) => {
      const lowerUrl = url.toLowerCase();
      switch (platform) {
        case "twitter":
          return lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com");
        case "instagram":
          return lowerUrl.includes("instagram.com");
        case "tiktok":
          return lowerUrl.includes("tiktok.com");
        default:
          return false;
      }
    });
  };
  // Get platform dot color
  const getPlatformDotColor = (
    platform: "twitter" | "instagram" | "tiktok"
  ) => {
    // If we're on the create trendscreen page
    if (pathname === "/app/trendscreen") {
      // If there are URLs, show based on current URLs
      if (currentUrls.length > 0) {
        return currentUrlsHasPlatform(platform)
          ? "text-green-400"
          : "text-red-400";
      }
      // If create page is empty, show all dots as red
      return "text-red-400";
    }

    // If we're viewing a specific trend, show based on that trend's platforms
    if (currentTrend) {
      return currentTrendHasPlatform(platform)
        ? "text-green-400"
        : "text-red-400";
    } // For all other pages (dashboard, FAQ, etc.), show all green
    return "text-green-400";
  };

  // Check if current page should show switches instead of dots
  const shouldShowSwitches = () => {
    return pathname === "/app" || pathname === "/app/search";
  };

  // Toggle platform switch for filtering
  const togglePlatformSwitch = (
    platform: "twitter" | "instagram" | "tiktok"
  ) => {
    setPlatformSwitches((prev) => {
      const newSwitches = {
        ...prev,
        [platform]: !prev[platform],
      };

      // Trigger URL update for dashboard/search pages
      if (shouldShowSwitches()) {
        updatePageWithFilters(newSwitches);
      }

      return newSwitches;
    });
  };

  // Update page URL with platform filters
  const updatePageWithFilters = (switches: typeof platformSwitches) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const platforms = Object.entries(switches)
        .filter(([_, enabled]) => enabled)
        .map(([platform, _]) => platform);

      if (platforms.length === 3) {
        // All platforms selected, remove filter
        url.searchParams.delete("platforms");
      } else if (platforms.length > 0) {
        // Some platforms selected
        url.searchParams.set("platforms", platforms.join(","));
      } else {
        // No platforms selected, show all (fallback)
        url.searchParams.delete("platforms");
      }

      // Update URL without page reload
      window.history.replaceState({}, "", url.toString());

      // Trigger a custom event to notify pages about filter change
      window.dispatchEvent(
        new CustomEvent("platformFiltersChanged", {
          detail: {
            platforms:
              platforms.length > 0
                ? platforms
                : ["twitter", "instagram", "tiktok"],
          },
        })
      );
    }
  }; // Load platform switches from localStorage on component mount
  React.useEffect(() => {
    // Load platform switches from localStorage and URL params
    const savedSwitches = localStorage.getItem("platformSwitches");
    if (savedSwitches) {
      try {
        const parsedSwitches = JSON.parse(savedSwitches);
        setPlatformSwitches(parsedSwitches);
      } catch (error) {
        console.error(
          "Error parsing platform switches from localStorage:",
          error
        );
      }
    }

    // Check URL params for platform filters
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const platformsParam = url.searchParams.get("platforms");
      if (platformsParam) {
        const enabledPlatforms = platformsParam.split(",");
        const newSwitches = {
          twitter: enabledPlatforms.includes("twitter"),
          instagram: enabledPlatforms.includes("instagram"),
          tiktok: enabledPlatforms.includes("tiktok"),
        };
        setPlatformSwitches(newSwitches);
      }
    }
  }, []);

  // Save platform switches to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("platformSwitches", JSON.stringify(platformSwitches));
  }, [platformSwitches]);
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  // Fetch individual trend data if not found in cached lists
  React.useEffect(() => {
    if (
      currentTrendId &&
      !allTrends.find((trend) => trend.id === currentTrendId)
    ) {
      fetch(`/api/getTrend/${currentTrendId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.trend) {
            setCurrentTrendData(data.trend);
          }
        })
        .catch((error) => {
          console.error("Error fetching individual trend:", error);
        });
    } else {
      setCurrentTrendData(null);
    }
  }, [currentTrendId, allTrends.length]);

  function getUserTrends() {
    setIsLoadingTrends(true);
    Promise.all([
      fetch(`/api/getUserTrends`).then((response) => response.json()),
      fetch(`/api/getPublicTrends`).then((response) => response.json()),
    ])
      .then(([userData, publicData]) => {
        console.log("User trends:", userData);
        console.log("Public trends:", publicData);

        if (userData.success) {
          setUserTrends(userData.trends || []);
        } else {
          console.error("Error fetching user trends:", userData.error);
          setUserTrends([]);
        }

        if (publicData.success) {
          setPublicTrends(publicData.trends || []);
        } else {
          console.error("Error fetching public trends:", publicData.error);
          setPublicTrends([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching trends:", error);
        setUserTrends([]);
        setPublicTrends([]);
      })
      .finally(() => {
        setIsLoadingTrends(false);
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
          window.location.href = "/app";
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
        <hr className="border-t border-gray-300 dark:border-neutral-700 my-2 mx-2 opacity-0" />{" "}
        <SignedIn>
          {/* Platform Status Section */}
          <div className="space-y-2">
            {/* Twitter */}
            <div className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400 font-semibold mb-2 px-4 py-2 rounded-[8px]">
              <div className="flex items-center">
                Twitter
                {shouldShowSwitches() ? (
                  <Switch
                    checked={platformSwitches.twitter}
                    onCheckedChange={() => togglePlatformSwitch("twitter")}
                    className="ml-2 scale-75"
                  />
                ) : (
                  <span className={`ml-2 ${getPlatformDotColor("twitter")}`}>
                    ●
                  </span>
                )}
              </div>
            </div>

            {/* Instagram */}
            <div className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400 font-semibold mb-2 px-4 py-2 rounded-[8px]">
              <div className="flex items-center">
                Instagram
                {shouldShowSwitches() ? (
                  <Switch
                    checked={platformSwitches.instagram}
                    onCheckedChange={() => togglePlatformSwitch("instagram")}
                    className="ml-2 scale-75"
                  />
                ) : (
                  <span className={`ml-2 ${getPlatformDotColor("instagram")}`}>
                    ●
                  </span>
                )}
              </div>
            </div>

            {/* TikTok */}
            <div className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400 font-semibold mb-2 px-4 py-2 rounded-[8px]">
              <div className="flex items-center">
                TikTok
                {shouldShowSwitches() ? (
                  <Switch
                    checked={platformSwitches.tiktok}
                    onCheckedChange={() => togglePlatformSwitch("tiktok")}
                    className="ml-2 scale-75"
                  />
                ) : (
                  <span className={`ml-2 ${getPlatformDotColor("tiktok")}`}>
                    ●
                  </span>
                )}
              </div>
            </div>
          </div>
          <hr className="border-t border-gray-300 dark:border-neutral-700 my-4 mx-2" />
          {/* All User Trends Section */}
          <div className="space-y-2">
            <h3 className="text-sm text-gray-600 dark:text-neutral-400 font-semibold px-4 mb-2">
              Your Trendscreens
            </h3>
            {isLoadingTrends ? (
              <div className="mx-4 my-2 px-3 py-2 bg-white/10 dark:bg-white/10 rounded-[8px] text-center">
                <span className="text-xs text-gray-500 dark:text-neutral-500">
                  Loading trendscreens...
                </span>
              </div>
            ) : userTrends.length > 0 ? (
              userTrends.map((item) => (
                <Link
                  key={`all-${item.id}`}
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
              ))
            ) : (
              <div className="mx-4 my-2 px-3 py-2 bg-white/10 dark:bg-white/10 rounded-[8px] text-center">
                <span className="text-xs text-gray-500 dark:text-neutral-500">
                  No trendscreens yet
                </span>
              </div>
            )}
          </div>{" "}
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
