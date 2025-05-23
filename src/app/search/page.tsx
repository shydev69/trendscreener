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
  const router = useRouter();

  // Helper to get query param from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q") || "";
    setQuery(q);
    setSearchPage(1);
  }, [typeof window !== "undefined" && window.location.search]);

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
    fetch(
      `${endpoint}?search=${encodeURIComponent(
        query
      )}&sortBy=${sortBy}&sortOrder=${
        sortBy == "createdAt" ? "asc" : isDesc ? "desc" : "asc"
      }&page=1&limit=${resultsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
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
  }, [query, sortBy, isDesc, resultsPerPage, personal]);

  // Load more trends
  const loadMoreTrends = () => {
    setLoading(true);
    const nextPage = searchPage + 1;
    const endpoint = personal ? "/api/userSearch" : "/api/publicSearch";
    fetch(
      `${endpoint}?search=${encodeURIComponent(
        query
      )}&sortBy=${sortBy}&sortOrder=${
        sortBy == "createdAt" ? "asc" : isDesc ? "desc" : "asc"
      }&page=${nextPage}&limit=${resultsPerPage}`
    )
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
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const returnReadableNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/currentUser");
      if (!res.ok) {
        setError("no user");
        return;
      }
      const data = await res.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);
  return (
    <div className="w-full mx-auto flex flex-col relative items-center">
      <img
        src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover"
        style={{ filter: "blur(150px)" }}
      />
      <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
        {loading && (
          <div className="text-center text-white py-4 px-4 backdrop-blur-md">
            Loading trends...
          </div>
        )}
        {error &&
          (error == "no user" ? (
            <div className="text-center text-red-400 rounded-2xl py-4 px-4 backdrop-blur-md">
              You are not logged in for personal search.
            </div>
          ) : (
            <div className="text-center text-red-400 rounded-2xl py-4 px-4 backdrop-blur-md">
              Error, please try{" "}
              <a onClick={() => window.location.reload()} className="underline">
                reloading
              </a>
              .
            </div>
          ))}
      </div>
      <div className="absolute top-0 right-0 flex gap-2 items-center px-5 py-5 z-10 text-center text-sm max-w-screen flex-wrap">
        {/* User/Public Switch */}
        <div className="flex items-center gap-2 bg-white/10 rounded-[8px] px-3 py-2.5 justify-center h-full">
          <Switch
            id="personal-switch"
            checked={personal}
            onCheckedChange={setPersonal}
          />
          <Label
            htmlFor="personal-switch"
            className="text-white pt-1 opacity-80 font-normal"
          >
            {personal ? "Personal" : "Public"}
          </Label>
        </div>
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
                <SelectItem value="createdAt">Newest First</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-[8px] px-3 py-2.5 justify-center h-full">
          <Switch id="is-desc" checked={isDesc} onCheckedChange={setIsDesc} />
          <Label htmlFor="is-desc" className="pt-1 opacity-80 font-normal">
            {isDesc ? "Desc" : "Asc"}
          </Label>
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
      </div>

      <div className="w-full -mt-[30vh] z-1">
        {trends.length === 0 ? (
          <div className="text-center text-gray-300 bg-white/10 rounded-2xl py-8 px-4 backdrop-blur-md">
            {loading ? "Loading..." : "No trends found."}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10 lg:mt-0 ">
            {trends.map((trend: any) => (
              <li
                key={trend.id}
                className="rounded-3xl grid grid-cols-8 gap-x-5 md:gap-x-10 gap-y-2 bg-white/10 dark:bg-black/10 p-6 cursor-pointer hover:scale-[1.005] hover:bg-white/20 transition-all duration-200 backdrop-blur-lg"
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
                    {trend.urls?.length || 0} tweets
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
  );
}
