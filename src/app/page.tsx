"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Eye, Heart, RefreshCcw, Reply } from "lucide-react";

export default function Home() {
  const [userTrends, setUserTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    function getUserTrends() {
      fetch(`/api/getUserTrends`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserTrends(data.trends);
          } else {
            setError(data.error || "Error fetching user trends");
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching user trends: " + error);
          setLoading(false);
        });
    }
    getUserTrends();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center mt-10">Loading your trends...</div>
    );
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <img
        src="https://images.pexels.com/photos/19961796/pexels-photo-19961796/free-photo-of-view-of-an-erupting-volcano.jpeg?auto=compress&cs=tinysrgb&w=600"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover"
        style={{ filter: "blur(150px)" }}
      />
      <div className="w-full max-w-2xl -mt-[10vh] z-1">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Your Trends Lists
        </h1>
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
        {userTrends.length === 0 ? (
          <div className="text-center text-gray-300 bg-white/10 rounded-xl py-8 px-4 backdrop-blur-md">
            No trends lists found.
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userTrends.map((trend: any) => {
              return (
                <li
                  key={trend.id}
                  className="rounded-3xl bg-white/10 dark:bg-[#1a1a1a]/30 p-6 pt-8 cursor-pointer hover:scale-[1.03] hover:bg-white/20 transition-all duration-200 backdrop-blur-lg"
                  style={{
                    border: "none",
                  }}
                  onClick={() => router.push(`/trendslist/${trend.id}`)}
                >
                  <div className="text-xl font-semibold mb-3 truncate text-white">
                    {trend.name || "Untitled List"}
                  </div>
                  <div className="text-sm text-gray-200 mb-3 truncate">
                    {trend.urls?.length || 0} tweets
                  </div>
                  <div className="flex items-center gap-6 text-sm opacity-90">
                    <span className="flex items-center gap-1 text-white/80">
                      <Eye className="w-4 h-4" />
                      {trend.analysis?.views ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-white/80">
                      <Heart className="w-4 h-4" />
                      {trend.analysis?.likes ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-white/80">
                      <Reply className="w-4 h-4" />
                      {trend.analysis?.replies ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-white/80">
                      <RefreshCcw className="w-4 h-4" />
                      {(trend.analysis?.reposts ?? 0) +
                        (trend.analysis?.quotes ?? 0)}
                    </span>
                    <span className="flex items-center gap-1 text-white/80">
                      <Bookmark className="w-4 h-4" />
                      {trend.analysis?.bookmarks ?? 0}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
