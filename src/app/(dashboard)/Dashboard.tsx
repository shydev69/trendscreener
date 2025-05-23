"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Bookmark,
  Eye,
  Flame,
  Heart,
  RefreshCcw,
  Reply,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [publicTrends, setPublicTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"likes" | "views" | "createdAt">(
    "likes"
  );
  const [searchPage, setSearchPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [resultsPerPage] = useState(10);
  const router = useRouter();

  // Get query param from URL
  useEffect(() => {
    setSearchPage(1);
  }, [typeof window !== "undefined" && window.location.search]);

  // Fetch public trends when filters or query change
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(
      `/api/publicSearch?search=&sortBy=${sortBy}&sortOrder=${
        sortBy == "createdAt" ? "asc" : "desc"
      }&page=1&limit=${resultsPerPage}`
    )
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
  }, [sortBy, resultsPerPage]);

  // Load more public trends
  const loadMorePublicTrends = () => {
    setLoading(true);
    const nextPage = searchPage + 1;
    fetch(
      `/api/publicSearch?search=&sortBy=${sortBy}&sortOrder=${
        sortBy == "createdAt" ? "asc" : "desc"
      }&page=${nextPage}&limit=${resultsPerPage}`
    )
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

  return (
    <div className="w-full mx-auto flex flex-col relative items-center">
      <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
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
        <button
          className={`flex items-center justify-center bg-white/10 px-5 gap-1 py-2 rounded-[8px] text-white/80 text-sm hover:text-white hover:bg-white/20 transition duration-300 ${
            sortBy === "likes" ? "bg-white/20 text-white" : ""
          }`}
          type="button"
          title="Hot"
          onClick={() => {
            setSortBy("likes");
            setSearchPage(1);
          }}
        >
          <Flame className="w-4 h-4 fill-yellow-500 stroke-orange-500" /> Hot
        </button>
        <button
          className={`flex items-center justify-center bg-white/10 px-5 gap-1 py-2 rounded-[8px] text-white/80 text-sm hover:text-white hover:bg-white/20 transition duration-300 ${
            sortBy === "views" ? "bg-white/20 text-white" : ""
          }`}
          type="button"
          title="Top"
          onClick={() => {
            setSortBy("views");
            setSearchPage(1);
          }}
        >
          Top
        </button>
        <button
          className={`flex items-center justify-center bg-white/10 px-5 gap-1 py-2 rounded-[8px] text-white/80 text-sm hover:text-white hover:bg-white/20 transition duration-300 ${
            sortBy === "createdAt" ? "bg-white/20 text-white" : ""
          }`}
          type="button"
          title="New"
          onClick={() => {
            setSortBy("createdAt");
            setSearchPage(1);
          }}
        >
          <Sparkles className="w-4 h-4" /> New
        </button>
      </div>
      <div className="w-full -mt-[30vh] z-1">
        {publicTrends.length === 0 ? (
          <div className="text-center text-gray-300 bg-white/10 rounded-2xl py-8 px-4 backdrop-blur-md">
            {loading ? "Loading..." : "No trends found."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {publicTrends.map((trend: any) => (
              <li
                key={trend.id}
                className="rounded-3xl grid grid-cols-8 gap-x-10 gap-y-2 bg-white/10 dark:bg-black/10 p-6 cursor-pointer hover:scale-[1.005] hover:bg-white/20 transition-all duration-200 backdrop-blur-lg"
                style={{
                  border: "none",
                }}
                onClick={() => router.push(`/trendscreen/${trend.id}`)}
              >
                <div className="col-span-4 xl:col-span-2">
                  <div className="text-xl font-semibold mb-1 truncate text-white">
                    {trend.name || "Untitled List"}
                  </div>
                  <div className="text-sm text-gray-200 mb-1 truncate">
                    {trend.urls?.length || 0} tweets
                  </div>
                </div>
                <div className="col-span-4 xl:col-span-1">
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
