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
  Share,
  Atom,
  BadgeDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TrendImage from "@/components/trendimage";

export default function SearchPage() {
  const [publicTrends, setPublicTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"views" | "createdAt">("createdAt");

  // Only one filter can be active at a time: "top", "new", or null
  const [activeFilter, setActiveFilter] = useState<"top" | "new" | null>("new");
  const [topTimeFilter, setTopTimeFilter] = useState<string>("allTime");
  const [newTimeFilter, setNewTimeFilter] = useState<string>("allTime");

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

    if (activeFilter === "new" && newTimeFilter !== "allTime") {
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

    if (activeFilter === "new" && newTimeFilter !== "allTime") {
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
    { value: "allTime", label: "All Time" },
  ];

  return (
    <div className="w-full mx-auto flex flex-col relative items-center min-h-screen">
      {/* Blue gradient background effects */}
      <div className="relative antialiased w-full justify-center items-center fixed inset-0 -top-[50vh] blur-xl z-0">
        <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa]/30 to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[45vh] left-[95%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[60%]"></div>
        <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa]/30 to-transparent top-[100vh] rounded-full blur-3xl left-[-20%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[40%]"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] blur-3xl left-[30%]"></div>
      </div>

      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-0 pb-40 sm:px-6 lg:px-8 pt-8">
        <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
          {error && (
            <div style={{ color: "#ef4444", marginTop: 8 }}>
              Error, please try{" "}
              <a
                onClick={() => window.location.reload()}
                className="underline text-[#60a5fa]"
              >
                reloading
              </a>
              .
            </div>
          )}
          {loading && (
            <div style={{ color: "#e5eae6", marginTop: 8 }}>loading...</div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center px-0 py-5 z-10 text-center text-sm">
          {/* Sort By */}
          <div className="flex items-center bg-[#ffffff11] backdrop-blur-3xl rounded-3xl overflow-hidden border border-[#e5eae6]/10">
            <button
              onClick={() => setSortBy("views")}
              className={`flex items-center gap-1 px-4 py-3 text-sm transition duration-200 ${
                sortBy === "views"
                  ? "bg-[#2563eb]/30 text-[#e5eae6]"
                  : "text-[#e5eae6]/80 hover:text-[#e5eae6] hover:bg-[#ffffff22]"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Views
            </button>
            <button
              onClick={() => setSortBy("createdAt")}
              className={`flex items-center gap-1 px-4 py-3 text-sm transition duration-200 ${
                sortBy === "createdAt"
                  ? "bg-[#2563eb]/30 text-[#e5eae6]"
                  : "text-[#e5eae6]/80 hover:text-[#e5eae6] hover:bg-[#ffffff22]"
              }`}
            >
              <Clock className="w-4 h-4" />
              Newest
            </button>
          </div>

          {/* Top Filter */}
          <div
            className={`flex items-center rounded-3xl flex-wrap transition duration-200 backdrop-blur-3xl border ${
              activeFilter === "top"
                ? "bg-[#2563eb]/20 border-[#60a5fa]/50"
                : "bg-[#ffffff11] border-[#ffffff11]/10"
            }`}
          >
            <button
              onClick={() =>
                setActiveFilter(activeFilter === "top" ? null : "top")
              }
              className={`flex items-center gap-1 px-4 py-3 text-sm transition duration-200 ${
                activeFilter === "top"
                  ? "text-[#93c5fd]"
                  : "text-[#e5eae6]/80 hover:text-[#e5eae6]"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Top
            </button>
            {activeFilter === "top" && (
              <>
                <div className="w-px h-4 bg-[#60a5fa]/30" />
                {getTopDropdownOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTopTimeFilter(option.value)}
                    className={`px-4 py-3 text-sm transition rounded-3xl duration-20 ${
                      topTimeFilter === option.value
                        ? "bg-[#2563eb]/30 text-[#93c5fd]"
                        : "text-[#93c5fd]/80 hover:text-[#93c5fd] hover:bg-[#2563eb]/20"
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
            className={`flex items-center rounded-3xl flex-wrap transition duration-200 backdrop-blur-3xl border ${
              activeFilter === "new"
                ? "bg-[#2563eb]/20 border-[#60a5fa]/50"
                : "bg-[#ffffff11] border-[#ffffff11]/10"
            }`}
          >
            <button
              onClick={() =>
                setActiveFilter(activeFilter === "new" ? null : "new")
              }
              className={`flex items-center gap-1 px-4 py-3 text-sm transition duration-200 ${
                activeFilter === "new"
                  ? "text-[#93c5fd]"
                  : "text-[#e5eae6]/80 hover:text-[#e5eae6]"
              }`}
            >
              <Clock className="w-4 h-4" />
              New
            </button>
            {activeFilter === "new" && (
              <>
                <div className="w-px h-4 bg-[#60a5fa]/30" />
                {getNewDropdownOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNewTimeFilter(option.value)}
                    className={`px-4 py-3 text-sm transition rounded-3xl duration-200 ${
                      newTimeFilter === option.value
                        ? "bg-[#2563eb]/30 text-[#93c5fd]"
                        : "text-[#93c5fd]/80 hover:text-[#93c5fd] hover:bg-[#2563eb]/20"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="w-full z-10 mt-6">
          {publicTrends && publicTrends.length === 0 ? (
            <div className="text-center text-[#e5eae6]/70 bg-[#ffffff11] backdrop-blur-3xl rounded-3xl py-8 px-4 border border-[#e5eae6]/10">
              {loading ? "Loading..." : "No trends found."}
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {publicTrends &&
                publicTrends.map((trend: any) => (
                  <li
                    key={trend.id}
                    className="rounded-3xl grid grid-cols-8 gap-x-5 md:gap-x-10 gap-y-2 bg-[#ffffff11] backdrop-blur-3xl p-6 cursor-pointer hover:scale-[1.005] hover:bg-[#ffffff22] transition-all duration-200 border border-[#e5eae6]/10"
                    onClick={() => router.push(`/app/trendscreen/${trend.id}`)}
                  >
                    <div className="col-span-6 xl:col-span-3 flex flex-col md:flex-row items-start gap-4">
                      <TrendImage
                        trendId={trend.id}
                        className="w-auto h-full max-w-20 max-h-20 aspect-square object-cover rounded-[10px]"
                      />
                      <div className="w-full lg:truncate lg:text-ellipsis lg:overflow-hidden">
                        <p className="text-xl line-clamp-1 font-semibold mb-2 w-full max-w-full lg:overflow-hidden lg:truncate text-[#e5eae6] items-center gap-2">
                          {trend.name || "Untitled List"}
                        </p>
                        <div className="text-sm text-[#e5eae6]/70 mb-1 truncate">
                          {trend.urls?.length || 0} posts
                        </div>
                        <div className="text-sm text-[#e5eae6]/50 mb-1 truncate">
                          {(() => {
                            const now = new Date();
                            const created = new Date(trend.createdAt);
                            const diffMs = now.getTime() - created.getTime();
                            const diffSec = Math.floor(diffMs / 1000);
                            const diffMin = Math.floor(diffSec / 60);
                            const diffHour = Math.floor(diffMin / 60);
                            const diffDay = Math.floor(diffHour / 24);

                            if (diffDay > 0) {
                              return `${diffDay} day${
                                diffDay > 1 ? "s" : ""
                              } ago`;
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
                    </div>
                    <div className="col-span-2 xl:col-span-1">
                      <div className="flex flex-col items-center gap-6 gap-y-2 items-end xl:items-start text-sm opacity-90 flex-wrap w-full">
                        <span className="flex items-center gap-1 text-[#e5eae6]/70">
                          <Eye className="w-4 h-4" />
                          {returnReadableNumber(trend.analysis?.views ?? 0)}
                        </span>
                        <span className="flex items-center gap-1 text-[#e5eae6]/70">
                          <Heart className="w-4 h-4" />
                          {returnReadableNumber(trend.analysis?.likes ?? 0)}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-8 xl:col-span-4">
                      <div className="flex items-center gap-6 gap-y-2 text-sm opacity-90 flex-wrap w-full">
                        {trend.description ? (
                          <span className="flex items-center gap-1 text-[#e5eae6]/70">
                            {trend.description}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#e5eae6]/30">
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
            <div className="flex items-end justify-center gap-2 mt-6 rounded-3xl px-2 py-2.5">
              <Button
                className="bg-[#ffffff11] backdrop-blur-3xl text-[#e5eae6]/80 border border-[#e5eae6]/10 rounded-3xl shadow-sm hover:bg-[#ffffff22] hover:text-[#e5eae6]"
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
    </div>
  );
}
