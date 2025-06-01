"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Eye,
  Heart,
  ChevronDown,
  Clock,
  TrendingUp,
  SortDesc,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [publicTrends, setPublicTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"views" | "createdAt">("views");

  // Only one filter can be active at a time: "top", "new", or null
  const [activeFilter, setActiveFilter] = useState<"top" | "new" | null>("top");
  const [topTimeFilter, setTopTimeFilter] = useState<string>("allTime");
  const [newTimeFilter, setNewTimeFilter] = useState<string>("24h");

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

    // Add filter based on active filter
    if (activeFilter === "top") {
      if (topTimeFilter === "today") {
        apiUrl += "&findFromToday=true";
      } else if (topTimeFilter === "thisWeek") {
        apiUrl += "&findFromThisWeek=true";
      }
    }

    if (activeFilter === "new") {
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
  }, [sortBy, topTimeFilter, newTimeFilter, activeFilter, resultsPerPage]);

  // Load more public trends
  const loadMorePublicTrends = () => {
    setLoading(true);
    const nextPage = searchPage + 1;

    let apiUrl = `/api/publicSearch?search=&sortBy=${sortBy}&sortOrder=desc&page=${nextPage}&limit=${resultsPerPage}`;

    if (activeFilter === "top") {
      if (topTimeFilter === "today") {
        apiUrl += "&findFromToday=true";
      } else if (topTimeFilter === "thisWeek") {
        apiUrl += "&findFromThisWeek=true";
      }
    }

    if (activeFilter === "new") {
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
      </div>

      <img
        src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover"
        style={{ filter: "blur(150px)" }}
      />

      <div className="absolute top-0 left-0 flex flex-wrap gap-2 items-center px-0 py-5 z-10 text-center text-sm">
        {/* Sort By */}
        <div className="flex items-center bg-white/10 rounded-[8px] overflow-hidden">
          <button
            onClick={() => setSortBy("views")}
            className={`flex items-center gap-1 px-3 py-2 text-sm transition duration-200 ${
              sortBy === "views"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Views
          </button>
          <button
            onClick={() => setSortBy("createdAt")}
            className={`flex items-center gap-1 px-3 py-2 text-sm transition duration-200 ${
              sortBy === "createdAt"
                ? "bg-white/20 text-white"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Clock className="w-4 h-4" />
            Newest
          </button>
        </div>

        {/* Top Filter */}
        <div
          className={`flex items-center rounded-[8px] overflow-hidden transition duration-200 ${
            activeFilter === "top"
              ? "bg-blue-500/20 border border-blue-500/30"
              : "bg-white/10"
          }`}
        >
          <button
            onClick={() =>
              setActiveFilter(activeFilter === "top" ? null : "top")
            }
            className={`flex items-center gap-1 px-3 py-2 text-sm transition duration-200 ${
              activeFilter === "top"
                ? "text-blue-300"
                : "text-white/80 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Top
          </button>
          {activeFilter === "top" && (
            <>
              <div className="w-px h-4 bg-blue-500/30" />
              {getTopDropdownOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTopTimeFilter(option.value)}
                  className={`px-3 py-2 text-sm transition duration-200 ${
                    topTimeFilter === option.value
                      ? "bg-blue-500/30 text-blue-200"
                      : "text-blue-300/80 hover:text-blue-200 hover:bg-blue-500/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* New Filter */}
        <div
          className={`flex items-center rounded-[8px] overflow-hidden transition duration-200 ${
            activeFilter === "new"
              ? "bg-green-500/20 border border-green-500/30"
              : "bg-white/10"
          }`}
        >
          <button
            onClick={() =>
              setActiveFilter(activeFilter === "new" ? null : "new")
            }
            className={`flex items-center gap-1 px-3 py-2 text-sm transition duration-200 ${
              activeFilter === "new"
                ? "text-green-300"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            New
          </button>
          {activeFilter === "new" && (
            <>
              <div className="w-px h-4 bg-green-500/30" />
              {getNewDropdownOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => setNewTimeFilter(option.value)}
                  className={`px-3 py-2 text-sm transition duration-200 ${
                    newTimeFilter === option.value
                      ? "bg-green-500/30 text-green-200"
                      : "text-green-300/80 hover:text-green-200 hover:bg-green-500/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="w-full -mt-[19vh] md:-mt-[26vh] lg:-mt-[30vh] z-1">
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
                    
                    <div className="text-xl font-semibold mb-2 truncate text-white flex items-center gap-2">
                     <img src={"https://solana.com/src/img/branding/solanaLogoMark.svg"} alt={trend.name} 
                    className="w-5 h-5" /> {trend.name || "Untitled List"}
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
