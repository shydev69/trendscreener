"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  Bookmark,
  Eye,
  Heart,
  RefreshCcw,
  Reply,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/nextjs";
import TrendImage from "@/components/trendimage";

export default function SearchPage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [isDesc, setIsDesc] = useState(true);
  const [sortBy, setSortBy] = useState("views");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [personal, setPersonal] = useState(false); // Switch for user/public
  const [platforms, setPlatforms] = useState<string[]>([
    "twitter",
    "instagram",
    "tiktok",
  ]);
  const router = useRouter();
  // Helper to get query param from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    setQuery(q);
    setSearchPage(1);

    // Check for platform filters in URL
    const platformsParam = searchParams.get("platforms");
    if (platformsParam) {
      setPlatforms(platformsParam.split(","));
    }
  }, [typeof window !== "undefined" && window.location.search]);

  // Listen for platform filter changes from sidebar
  useEffect(() => {
    const handlePlatformFiltersChanged = (event: CustomEvent) => {
      setPlatforms(event.detail.platforms);
      setSearchPage(1); // Reset to first page when filters change
    };

    window.addEventListener(
      "platformFiltersChanged",
      handlePlatformFiltersChanged as EventListener
    );

    return () => {
      window.removeEventListener(
        "platformFiltersChanged",
        handlePlatformFiltersChanged as EventListener
      );
    };
  }, []);

  // Fetch trends when filters or query change
  useEffect(() => {
    if (!query) {
      setTrends([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const endpoint = personal ? "/api/userSearch" : "/api/publicSearch";
    setTrends([]);

    let apiUrl = `${endpoint}?search=${encodeURIComponent(
      query
    )}&sortBy=${sortBy}&sortOrder=${
      sortBy == "createdAt" ? "asc" : isDesc ? "desc" : "asc"
    }&page=1&limit=${resultsPerPage}`;

    // Add platform filters
    if (platforms.length > 0 && platforms.length < 3) {
      apiUrl += `&platforms=${platforms.join(",")}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.trends);
          setTrends(data.trends);
          setHasMore(data.trends.length === resultsPerPage);
        } else {
          setError(data.error || "Error fetching trends");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching trends: " + error);
        setLoading(false);
      });
  }, [query, sortBy, isDesc, resultsPerPage, personal, platforms]);
  // Load more trends
  const loadMoreTrends = () => {
    setLoading(true);
    const nextPage = searchPage + 1;
    const endpoint = personal ? "/api/userSearch" : "/api/publicSearch";

    let apiUrl = `${endpoint}?search=${encodeURIComponent(
      query
    )}&sortBy=${sortBy}&sortOrder=${
      sortBy == "createdAt" ? "asc" : isDesc ? "desc" : "asc"
    }&page=${nextPage}&limit=${resultsPerPage}`;

    // Add platform filters
    if (platforms.length > 0 && platforms.length < 3) {
      apiUrl += `&platforms=${platforms.join(",")}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTrends((prev) => [...prev, ...data.trends]);
          setSearchPage(nextPage);
          setHasMore(data.trends.length === resultsPerPage);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/app/search?q=${encodeURIComponent(query)}`);
  };

  const returnReadableNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="w-full mx-auto flex flex-col relative items-center min-h-screen">
      {/* Blue gradient background effects */}
      <div className="relative antialiased w-full justify-center items-center fixed inset-0 -top-[50vh] blur-xl z-0 pointer-events-none">
        <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa]/30 to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[45vh] left-[95%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[60%] pointer-events-none"></div>
        <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa]/30 to-transparent top-[100vh] rounded-full blur-3xl left-[-20%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[40%] pointer-events-none"></div>
        <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] blur-3xl left-[30%] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-0 pb-40 sm:px-6 lg:px-8 pt-8">
        <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
          {loading && (
            <div className="text-center text-[#e5eae6] py-4 px-4 backdrop-blur-md">
              Loading trends...
            </div>
          )}
          {error &&
            (error == "no user" ? (
              <div className="text-center text-red-400 rounded-3xl py-4 px-4 backdrop-blur-md"></div>
            ) : (
              <div className="text-center text-red-400 rounded-3xl py-4 px-4 backdrop-blur-md">
                Error, please try{" "}
                <a
                  onClick={() => window.location.reload()}
                  className="underline text-[#60a5fa]"
                >
                  reloading
                </a>
                .
              </div>
            ))}
        </div>

        <div className="absolute top-0 right-0 flex gap-2 items-center px-5 py-5 z-10 text-center text-sm max-w-screen flex-wrap">
          {/* User/Public Switch */}
          <SignedIn>
            <div className="flex items-center gap-2 bg-[#ffffff11] backdrop-blur-3xl rounded-3xl px-3 py-2.5 justify-center h-full border border-[#e5eae6]/10">
              <Switch
                id="personal-switch"
                checked={personal}
                onCheckedChange={setPersonal}
              />
              <Label
                htmlFor="personal-switch"
                className="text-[#e5eae6] pt-1 opacity-80 font-normal"
              >
                {personal ? "Personal" : "Public"}
              </Label>
            </div>
          </SignedIn>
          {/* Filters */}
          <div className="flex items-center gap-2 bg-[#ffffff11] backdrop-blur-3xl rounded-3xl px-1 py-1 border border-[#e5eae6]/10">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                className="w-[150px] bg-[#ffffff11] backdrop-blur-3xl text-[#e5eae6]/80 border-none rounded-3xl shadow-sm"
                size="sm"
              >
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Default: Views</SelectLabel>
                  <SelectItem value="likes">Likes</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="replies">Replies</SelectItem>
                  <SelectItem value="reposts">Reposts</SelectItem>
                  <SelectItem value="quotes">Quotes</SelectItem>
                  <SelectItem value="bookmarks">Bookmarks</SelectItem>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 bg-[#ffffff11] backdrop-blur-3xl rounded-3xl px-3 py-2.5 justify-center h-full border border-[#e5eae6]/10">
            <Switch id="is-desc" checked={isDesc} onCheckedChange={setIsDesc} />
            <Label
              htmlFor="is-desc"
              className="text-[#e5eae6] pt-1 opacity-80 font-normal"
            >
              {isDesc ? "Desc" : "Asc"}
            </Label>
          </div>
          <div className="flex items-center gap-2 bg-[#ffffff11] backdrop-blur-3xl rounded-3xl px-1 py-1 border border-[#e5eae6]/10">
            <Select
              value={resultsPerPage.toString()}
              onValueChange={(value) => setResultsPerPage(Number(value))}
            >
              <SelectTrigger
                className="w-[150px] bg-[#ffffff11] backdrop-blur-3xl text-[#e5eae6]/80 border-none rounded-3xl shadow-sm"
                size="sm"
              >
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Results per page</SelectLabel>
                  <SelectItem value="5">5 Screens</SelectItem>
                  <SelectItem value="10">10 Screens</SelectItem>
                  <SelectItem value="25">25 Screens</SelectItem>
                  <SelectItem value="50">50 Screens</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full mt-20 z-10">
          {trends.length === 0 ? (
            <div className="text-center text-[#e5eae6]/70 bg-[#ffffff11] backdrop-blur-3xl rounded-3xl py-8 px-4 border border-[#e5eae6]/10">
              {loading ? "Loading..." : "No trends found."}
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10 lg:mt-0">
              {trends.map((trend: any) => (
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
                            } ago`.toLowerCase();
                          } else if (diffHour > 0) {
                            return `${diffHour} hour${
                              diffHour > 1 ? "s" : ""
                            } ago`.toLowerCase();
                          } else if (diffMin > 0) {
                            return `${diffMin} minute${
                              diffMin > 1 ? "s" : ""
                            } ago`.toLowerCase();
                          } else {
                            return "Just now";
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 xl:col-span-1">
                    <div className="flex flex-col items-center gap-6 gap-y-2 items-end xl:items-start text-sm opacity-90 flex-wrap w-full">
                      {(() => {
                        // Check if trendscreen has Instagram or TikTok posts (and no Twitter posts)
                        const hasTwitterPosts = trend.urls?.some(
                          (url: string) =>
                            url.toLowerCase().includes("twitter.com") ||
                            url.toLowerCase().includes("x.com")
                        );
                        const hasInstagramPosts = trend.urls?.some(
                          (url: string) =>
                            url.toLowerCase().includes("instagram.com")
                        );
                        const hasTiktokPosts = trend.urls?.some((url: string) =>
                          url.toLowerCase().includes("tiktok.com")
                        );

                        // Hide views if it's 0 and only has Instagram or TikTok posts
                        const shouldHideViews =
                          (trend.analysis?.views ?? 0) === 0 &&
                          !hasTwitterPosts &&
                          (hasInstagramPosts || hasTiktokPosts);

                        return (
                          <>
                            {!shouldHideViews && (
                              <span className="flex items-center gap-1 text-[#e5eae6]/70">
                                <Eye className="w-4 h-4" />
                                {returnReadableNumber(
                                  trend.analysis?.views ?? 0
                                )}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[#e5eae6]/70">
                              <Heart className="w-4 h-4" />
                              {returnReadableNumber(trend.analysis?.likes ?? 0)}
                            </span>
                          </>
                        );
                      })()}
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
            <div className="flex items-end justify-center gap-2 mt-4 rounded-3xl px-2 py-2.5">
              <Button
                className="bg-[#ffffff11] backdrop-blur-3xl text-[#e5eae6]/80 border border-[#e5eae6]/10 rounded-3xl shadow-sm hover:bg-[#ffffff22] hover:text-[#e5eae6]"
                size="sm"
                variant="outline"
                onClick={loadMoreTrends}
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
