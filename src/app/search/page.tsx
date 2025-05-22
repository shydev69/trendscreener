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

export default function SearchPage() {
  const [userTrends, setUserTrends] = useState<any[]>([]);
  const [publicTrends, setPublicTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [isDesc, setIsDesc] = useState(true);
  const [sortBy, setSortBy] = useState("views");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [userSearchPage, setUserSearchPage] = useState(1);
  const [publicSearchPage, setPublicSearchPage] = useState(1);
  const [userHasMore, setUserHasMore] = useState(true);
  const [publicHasMore, setPublicHasMore] = useState(true);
  const router = useRouter();

  // Helper to get query param from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    setQuery(q);
    setUserSearchPage(1);
    setPublicSearchPage(1);
  }, [typeof window !== "undefined" && window.location.search]);

  // Fetch trends when filters or query change
  useEffect(() => {
    if (!query) {
      setUserTrends([]);
      setPublicTrends([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    // Fetch user trends
    fetch(
      `/api/userSearch?search=${encodeURIComponent(
        query
      )}&sortBy=${sortBy}&sortOrder=${
        isDesc ? "desc" : "asc"
      }&page=1&limit=${resultsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserTrends(data.trends);
          setUserHasMore(data.trends.length === resultsPerPage);
        } else {
          setError(data.error || "Error fetching user trends");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching user trends: " + error);
        setLoading(false);
      });

    // Fetch public trends
    fetch(
      `/api/publicSearch?search=${encodeURIComponent(
        query
      )}&sortBy=${sortBy}&sortOrder=${
        isDesc ? "desc" : "asc"
      }&page=1&limit=${resultsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPublicTrends(data.trends);
          setPublicHasMore(data.trends.length === resultsPerPage);
        } else {
          setError(data.error || "Error fetching public trends");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching public trends: " + error);
        setLoading(false);
      });
  }, [query, sortBy, isDesc, resultsPerPage]);

  // Load more user trends
  const loadMoreUserTrends = () => {
    setLoading(true); // Show loading when loading more
    const nextPage = userSearchPage + 1;
    fetch(
      `/api/userSearch?search=${encodeURIComponent(
        query
      )}&sortBy=${sortBy}&sortOrder=${
        isDesc ? "desc" : "asc"
      }&page=${nextPage}&limit=${resultsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserTrends((prev) => [...prev, ...data.trends]);
          setUserSearchPage(nextPage);
          setUserHasMore(data.trends.length === resultsPerPage);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Load more public trends
  const loadMorePublicTrends = () => {
    setLoading(true); // Show loading when loading more
    const nextPage = publicSearchPage + 1;
    fetch(
      `/api/publicSearch?search=${encodeURIComponent(
        query
      )}&sortBy=${sortBy}&sortOrder=${
        isDesc ? "desc" : "asc"
      }&page=${nextPage}&limit=${resultsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPublicTrends((prev) => [...prev, ...data.trends]);
          setPublicSearchPage(nextPage);
          setPublicHasMore(data.trends.length === resultsPerPage);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const returnReadableNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="w-full mx-auto flex flex-col relative items-center">
      <img
        src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover"
        style={{ filter: "blur(150px)" }}
      />{" "}
      <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
        {loading && (
          <div className="text-center text-white py-4 px-4 backdrop-blur-md">
            Loading trends...
          </div>
        )}
        {error && (
          <div className="text-center text-red-400 rounded-2xl py-4 px-4 backdrop-blur-md">
            {error}
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 flex gap-2 items-center px-5 py-5 z-10 text-center text-sm max-w-screen flex-wrap">
        {/* Filters */}

        <div className="flex items-center gap-2 bg-white/10 rounded-[8px] px-1 py-1">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className="w-[150px] bg-white/10 text-white/80 border-none rounded-[8px] shadow-sm"
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
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-[8px] px-2 py-2.5">
          <Switch id="is-desc" checked={isDesc} onCheckedChange={setIsDesc} />
          <Label htmlFor="is-desc">{isDesc ? "Desc" : "Asc"}</Label>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-[8px] px-1 py-1">
          <Select
            value={resultsPerPage.toString()}
            onValueChange={(value) => setResultsPerPage(Number(value))}
          >
            <SelectTrigger
              className="w-[150px] bg-white/10 text-white/80 border-none rounded-[8px] shadow-sm"
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
        {/* {<div className="flex items-center gap-2 bg-white/10 rounded-[8px] px-1 py-0.5 hover:bg-white/15">
          {" "}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 items-center"
            style={{ marginBottom: 0 }}
          >
            <Button
              type="submit"
              className="px-4 !py-2 rounded bg-transparent text-white rounded-[8px] shadow-sm hover:bg-transparent transition-all duration-200"
              variant="secondary"
            >
              Apply filters
            </Button>
          </form>
        </div>} */}
      </div>
      <div className="w-full max-w-2xl -mt-[10vh] z-1">
        <h1 className="text-4xl font-semibold mb-6 text-white opacity-50">
          Search Results for "{query}"
        </h1>
        <h1 className="text-xl font-semibold mb-6 text-white">
          From Your Trends
        </h1>
        {userTrends.length === 0 ? (
          <div className="text-center text-gray-300 bg-white/10 rounded-2xl py-8 px-4 backdrop-blur-md">
            {loading ? "Loading..." : "No trends lists found."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {userTrends.map((trend: any) => (
              <li
                key={trend.id}
                className="rounded-3xl bg-white/10 dark:bg-[#1a1a1a]/30 p-6 pt-8 cursor-pointer hover:scale-[1.03] hover:bg-white/20 transition-all duration-200 backdrop-blur-lg"
                style={{
                  border: "none",
                }}
                onClick={() => router.push(`/trendscreen/${trend.id}`)}
              >
                <div className="text-xl font-semibold mb-3 truncate text-white">
                  {trend.name || "Untitled List"}
                </div>
                <div className="text-sm text-gray-200 mb-3 truncate">
                  {trend.urls?.length || 0} tweets
                </div>
                <div className="flex items-center gap-6 gap-y-2 text-sm opacity-90 flex-wrap w-full">
                  <span className="flex items-center gap-1 text-white/80">
                    <Eye className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.views ?? 0)}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <Heart className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.likes ?? 0)}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <Reply className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.replies ?? 0)}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <RefreshCcw className="w-4 h-4" />
                    {returnReadableNumber(
                      (trend.analysis?.reposts ?? 0) +
                        (trend.analysis?.quotes ?? 0)
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <Bookmark className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.bookmarks ?? 0)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {userHasMore && (
          <div className="flex items-end justify-center gap-2 mt-4 rounded-[8px] px-2 py-2.5">
            <Button
              className="bg-white/10 text-white/80 border-none rounded-[8px] shadow-sm"
              size="sm"
              variant="outline"
              onClick={loadMoreUserTrends}
            >
              <ArrowDown className="w-4 h-4" />
              Load More
            </Button>
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl mt-10 z-1">
        <h1 className="text-xl font-semibold mb-6 text-white">
          Top Public Search Results
        </h1>
        {publicTrends.length === 0 ? (
          <div className="text-center text-gray-300 bg-white/10 rounded-2xl py-8 px-4 backdrop-blur-md">
            {loading ? "Loading..." : "No trends lists found."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {publicTrends.map((trend: any) => (
              <li
                key={trend.id}
                className="rounded-3xl bg-white/10 dark:bg-[#1a1a1a]/30 p-6 pt-8 cursor-pointer hover:scale-[1.03] hover:bg-white/20 transition-all duration-200 backdrop-blur-lg"
                style={{
                  border: "none",
                }}
                onClick={() => router.push(`/trendscreen/${trend.id}`)}
              >
                <div className="text-xl font-semibold mb-3 truncate text-white">
                  {trend.name || "Untitled List"}
                </div>
                <div className="text-sm text-gray-200 mb-3 truncate">
                  {trend.urls?.length || 0} tweets
                </div>
                <div className="flex items-center gap-6 gap-y-2 text-sm opacity-90 flex-wrap w-full">
                  <span className="flex items-center gap-1 text-white/80">
                    <Eye className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.views ?? 0)}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <Heart className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.likes ?? 0)}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <Reply className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.replies ?? 0)}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <RefreshCcw className="w-4 h-4" />
                    {returnReadableNumber(
                      (trend.analysis?.reposts ?? 0) +
                        (trend.analysis?.quotes ?? 0)
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-white/80">
                    <Bookmark className="w-4 h-4" />
                    {returnReadableNumber(trend.analysis?.bookmarks ?? 0)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {publicHasMore && (
          <div className="flex items-end justify-center gap-2 mt-4 rounded-[8px] px-2 py-2.5">
            <Button
              className="bg-white/10 text-white/80 border-none rounded-[8px] shadow-sm"
              size="sm"
              variant="outline"
              onClick={loadMorePublicTrends}
            >
              <ArrowDown className="w-4 h-4" />
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
