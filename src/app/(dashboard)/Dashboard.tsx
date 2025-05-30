"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Bookmark,
  Eye,
  Flame,
  Heart,
  Instagram,
  RefreshCcw,
  Reply,
  Sparkles,
  ChevronDown,
  Clock,
  TrendingUp,
  X,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SearchPage() {
  const [publicTrends, setPublicTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"views" | "createdAt">("views");

  // Separate filters for Top and New
  const [topTimeFilter, setTopTimeFilter] = useState<string>("allTime");
  const [newTimeFilter, setNewTimeFilter] = useState<string>("24h");
  const [useTopFilter, setUseTopFilter] = useState(true);
  const [useNewFilter, setUseNewFilter] = useState(false);

  const [searchPage, setSearchPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [resultsPerPage] = useState(10);
  const router = useRouter();

  // Get query param from URL
  useEffect(() => {
    setSearchPage(1);
  }, [typeof window !== "undefined" && window.location.search]);

  // Fetch public trends when filters change
  useEffect(() => {
    setLoading(true);
    setError("");

    let apiUrl = `/api/publicSearch?search=&sortBy=${sortBy}&sortOrder=desc&page=1&limit=${resultsPerPage}`;

    // Add both filters if enabled
    if (useTopFilter) {
      if (topTimeFilter === "today") {
        apiUrl += "&findFromToday=true";
      } else if (topTimeFilter === "thisWeek") {
        apiUrl += "&findFromThisWeek=true";
      }
    }

    if (useNewFilter) {
      apiUrl += `&newTimeFilter=${newTimeFilter}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPublicTrends(data.trends);
          setHasMore(data.trends.length === resultsPerPage);
        } else {
          setError(data.error || "Error fetching public trends");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching public trends: " + error);
        setLoading(false);
      });
  }, [
    sortBy,
    topTimeFilter,
    newTimeFilter,
    useTopFilter,
    useNewFilter,
    resultsPerPage,
  ]);

  // Load more public trends
  const loadMorePublicTrends = () => {
    setLoading(true);
    const nextPage = searchPage + 1;

    let apiUrl = `/api/publicSearch?search=&sortBy=${sortBy}&sortOrder=desc&page=${nextPage}&limit=${resultsPerPage}`;

    if (useTopFilter) {
      if (topTimeFilter === "today") {
        apiUrl += "&findFromToday=true";
      } else if (topTimeFilter === "thisWeek") {
        apiUrl += "&findFromThisWeek=true";
      }
    }

    if (useNewFilter) {
      apiUrl += `&newTimeFilter=${newTimeFilter}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPublicTrends((prev) => [...prev, ...data.trends]);
          setSearchPage(nextPage);
          setHasMore(data.trends.length === resultsPerPage);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const returnReadableNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  // Get dropdown options for Top filter
  const getTopDropdownOptions = () => [
    { value: "allTime", label: "All Time" },
    { value: "thisWeek", label: "This Week" },
    { value: "today", label: "Today" },
  ];

  // Get dropdown options for New filter
  const getNewDropdownOptions = () => [
    { value: "5m", label: "5m" },
    { value: "1h", label: "1h" },
    { value: "6h", label: "6h" },
    { value: "12h", label: "12h" },
    { value: "24h", label: "24h" },
  ];

  // Get display label for Top filter
  const getTopFilterLabel = () => {
    const options = getTopDropdownOptions();
    const current = options.find((opt) => opt.value === topTimeFilter);
    return current?.label || topTimeFilter;
  };

  // Get display label for New filter
  const getNewFilterLabel = () => {
    const options = getNewDropdownOptions();
    const current = options.find((opt) => opt.value === newTimeFilter);
    return current?.label || newTimeFilter;
  };

  // Toggle Top filter
  const toggleTopFilter = () => {
    setUseTopFilter(!useTopFilter);
    setSearchPage(1);
  };

  // Toggle New filter
  const toggleNewFilter = () => {
    setUseNewFilter(!useNewFilter);
    setSearchPage(1);
  };

  return (
    <div className="w-full mx-auto flex flex-col relative items-center">
      <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
        {error && (
          <div style={{ color: "red", marginTop: 8 }}>
            Error, please try{" "}
            <a onClick={() => window.location.reload()} className="underline">
              reloading
            </a>
            .
          </div>
        )}
        {loading && (
          <div style={{ color: "#ffffff55", marginTop: 8 }}>loading...</div>
        )}
      </div>{" "}
      <img
        src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover"
        style={{ filter: "blur(150px)" }}
      />
      <div className="absolute top-0 left-0 flex gap-2 items-center px-0 py-5 z-10 text-center text-sm">
        {/* Sort By Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center bg-white/10 px-5 gap-1 py-2 rounded-[8px] text-white/80 text-sm hover:text-white hover:bg-white/20 transition duration-300"
              type="button"
              title="Sort By"
            >
              {sortBy === "views" ? (
                <>
                  <SortDesc className="w-4 h-4" />
                  Views
                </>
              ) : (
                <>
                  <SortDesc className="w-4 h-4" />
                  Newest
                </>
              )}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-black/90 border-white/20"
          >
            <DropdownMenuItem
              onClick={() => setSortBy("views")}
              className={`text-white hover:bg-white/20 ${
                sortBy === "views" ? "bg-white/10" : ""
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Sort by Views
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("createdAt")}
              className={`text-white hover:bg-white/20 ${
                sortBy === "createdAt" ? "bg-white/10" : ""
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Sort by Newest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Top Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center justify-center px-4 gap-1 py-2 rounded-[8px] text-sm transition duration-300 ${
                useTopFilter
                  ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                  : "bg-white/10 text-white/80 hover:text-white hover:bg-white/20"
              }`}
              type="button"
              title="Top Filter"
            >
              <TrendingUp className="w-4 h-4" />

              {useTopFilter ? (
                <span className="text-sm opacity-75">
                  {getTopFilterLabel()}
                </span>
              ) : (
                "Top"
              )}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-black/90 border-white/20"
          >
            <DropdownMenuItem
              onClick={toggleTopFilter}
              className="text-white hover:bg-white/20"
            >
              {useTopFilter ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Disable Top Filter
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Enable Top Filter
                </>
              )}
            </DropdownMenuItem>
            {useTopFilter && (
              <>
                <div className="border-t border-white/20 my-1" />
                {getTopDropdownOptions().map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTopTimeFilter(option.value)}
                    className={`text-white hover:bg-white/20 ${
                      topTimeFilter === option.value ? "bg-white/10" : ""
                    }`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center justify-center px-4 gap-1 py-2 rounded-[8px] text-sm transition duration-300 ${
                useNewFilter
                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                  : "bg-white/10 text-white/80 hover:text-white hover:bg-white/20"
              }`}
              type="button"
              title="New Filter"
            >
              <Clock className="w-4 h-4" />

              {useNewFilter ? (
                <span className="text-sm opacity-75">
                  {getNewFilterLabel()}
                </span>
              ) : (
                "New"
              )}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-black/90 border-white/20"
          >
            <DropdownMenuItem
              onClick={toggleNewFilter}
              className="text-white hover:bg-white/20"
            >
              {useNewFilter ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Disable New Filter
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Enable New Filter
                </>
              )}
            </DropdownMenuItem>
            {useNewFilter && (
              <>
                <div className="border-t border-white/20 my-1" />
                {getNewDropdownOptions().map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setNewTimeFilter(option.value)}
                    className={`text-white hover:bg-white/20 ${
                      newTimeFilter === option.value ? "bg-white/10" : ""
                    }`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="absolute top-0 right-0 hidden md:flex gap-2 items-center px-0 py-5 z-10 text-center text-sm"></div>
      <div className="w-full -mt-[30vh] z-1">
        {publicTrends && publicTrends.length === 0 ? (
          <div className="text-center text-gray-300 bg-white/10 rounded-2xl py-8 px-4 backdrop-blur-md">
            {loading ? "Loading..." : "No trends found."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {publicTrends &&
              publicTrends.map((trend: any) => (
                <li
                  key={trend.id}
                  className="rounded-3xl grid grid-cols-8 gap-x-5 md:gap-x-10 gap-y-2 bg-white/10 dark:bg-[#ffffff55]/10 p-6 cursor-pointer hover:scale-[1.005] hover:bg-white/20 transition-all duration-200 backdrop-blur-lg"
                  style={{
                    border: "none",
                  }}
                  onClick={() => router.push(`/trendscreen/${trend.id}`)}
                >
                  <div className="col-span-6 xl:col-span-2">
                    <div className="text-xl font-semibold mb-1 truncate text-white">
                      {trend.name || "Untitled List"}
                    </div>
                    <div className="text-sm text-gray-200 mb-1 truncate">
                      {trend.urls?.length || 0} posts
                    </div>
                    <div className="text-sm text-gray-200 mb-1 truncate">
                      {(() => {
                        const now = new Date();
                        const created = new Date(trend.createdAt);
                        const diffMs = now.getTime() - created.getTime();
                        const diffSec = Math.floor(diffMs / 1000);
                        const diffMin = Math.floor(diffSec / 60);
                        const diffHour = Math.floor(diffMin / 60);
                        const diffDay = Math.floor(diffHour / 24);

                        if (diffDay > 0) {
                          return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
                        } else if (diffHour > 0) {
                          return `${diffHour} hour${
                            diffHour > 1 ? "s" : ""
                          } ago`;
                        } else if (diffMin > 0) {
                          return `${diffMin} minute${
                            diffMin > 1 ? "s" : ""
                          } ago`;
                        } else {
                          return "Just now";
                        }
                      })()}
                    </div>
                  </div>
                  <div className="col-span-2 xl:col-span-1">
                    <div className="flex flex-col items-center gap-6 gap-y-2 items-end xl:items-start text-sm opacity-90 flex-wrap w-full">
                      <span className="flex items-center gap-1 text-white/80">
                        <Eye className="w-4 h-4" />
                        {returnReadableNumber(trend.analysis?.views ?? 0)}
                      </span>
                      <span className="flex items-center gap-1 text-white/80">
                        <Heart className="w-4 h-4" />
                        {returnReadableNumber(trend.analysis?.likes ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-5">
                    <div className="flex items-center gap-6 gap-y-2 text-sm opacity-90 flex-wrap w-full">
                      {trend.description ? (
                        <span className="flex items-center gap-1 text-white/80">
                          {trend.description}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-white/20">
                          No description
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
        {hasMore && (
          <div className="flex items-end justify-center gap-2 mt-4 rounded-[8px] px-2 py-2.5">
            <Button
              className="bg-white/10 text-white/80 border-none rounded-[8px] shadow-sm"
              size="sm"
              variant="outline"
              onClick={loadMorePublicTrends}
              disabled={loading}
            >
              <ArrowDown className="w-4 h-4" />
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
