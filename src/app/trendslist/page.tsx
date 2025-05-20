"use client";
import { Bookmark, Eye, Heart, RefreshCcw, Reply, SaveAll } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Tweet as TweetComponent } from "react-tweet";
import { trendLists } from "../../../drizzle/migrations/schema";
//import returnCurrentUserId from "./returnCurrentUserId";
import { useRouter } from "next/navigation";

const TWEET_URL_REGEX =
  /^https?:\/\/(www\.)?(x|twitter)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/i;
const extractTweetId = (url: string) => url.match(TWEET_URL_REGEX)?.[5] ?? null;

type TweetStats = {
  id: string;
  likes: number;
  views: number;
  replies: number;
  reposts: number;
  quotes: number;
  bookmarks: number;
};
async function fetchTweetStats(tweetId: string): Promise<TweetStats> {
  try {
    const res = await fetch(`/api/twitter/proxy?tweet_id=${tweetId}`);
    if (!res.ok) throw new Error("Failed to fetch tweet data");
    const data = await res.json();
    console.log("from x", data);
    const tweet = data?.tweets?.[0] ?? {};
    return {
      id: tweetId,
      likes: tweet.likeCount ?? 0,
      views: tweet.viewCount ?? 0,
      replies: tweet.replyCount ?? 0,
      reposts: tweet.retweetCount ?? 0,
      quotes: tweet.quoteCount ?? 0,
      bookmarks: tweet.bookmarkCount ?? 0,
    };
  } catch (error) {
    const { fetchTweet } = await import("react-tweet/api");
    const { data } = await fetchTweet(tweetId);
    const t = data as any;
    console.log("from react tweet", error, t);

    return {
      id: tweetId,
      likes: t?.favorite_count ?? 0,
      views: t?.views ?? 0,
      replies: t?.conversation_count ?? 0,
      reposts: t?.reposts ?? 0,
      quotes: t?.quotes ?? 0,
      bookmarks: t?.bookmarks ?? 0,
    };
  }
}

export default function TrendsListPage() {
  const router = useRouter();
  const [input, setInput] = useState(""),
    [links, setLinks] = useState<string[]>([]),
    [error, setError] = useState(""),
    [stats, setStats] = useState<TweetStats[]>([]),
    [loading, setLoading] = useState(false),
    [saving, setSaving] = useState(false),
    [listName, setListName] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const newStats: TweetStats[] = [];
      for (const link of links) {
        const tweetId = extractTweetId(link);
        if (!tweetId) continue;
        try {
          newStats.push(await fetchTweetStats(tweetId));
        } catch {}
      }
      if (!cancelled) setStats(newStats);
      if (!cancelled) setLoading(false);
    })();
    if (!links.length) setStats([]);
    return () => {
      cancelled = true;
    };
  }, [links]);

  const normalize = (url: string) =>
    url.trim().replace(/\/+$/, "").toLowerCase();
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!TWEET_URL_REGEX.test(trimmed))
      return setError("Please enter a valid tweet URL.");
    const normalized = normalize(trimmed);
    if (links.map(normalize).includes(normalized))
      return setError("This tweet is already added.");
    setLinks([trimmed, ...links]);
    setInput("");
    setError("");
  };

  const total = stats.reduce(
    (a, c) => ({
      likes: a.likes + c.likes,
      views: a.views + c.views,
      replies: a.replies + c.replies,
      reposts: a.reposts + c.reposts,
      quotes: a.quotes + c.quotes,
      bookmarks: a.bookmarks + c.bookmarks,
    }),
    { likes: 0, views: 0, replies: 0, reposts: 0, quotes: 0, bookmarks: 0 }
  );
  async function saveTrendsList() {
    if (!links.length) return;

    setSaving(true);
    try {
      // Call the API endpoint instead of directly using db
      const response = await fetch("/api/trends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: listName,
          urls: links.map(normalize),
          analysis: JSON.stringify(stats),
          isPublic: false,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save trends list");
      }

      window.location.href = `/trendslist/${data.listId}`;
    } catch (err) {
      console.error("Failed to save trendslist:", err);
      setError("Failed to save trends list. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <img
        src="https://images.pexels.com/photos/19961796/pexels-photo-19961796/free-photo-of-view-of-an-erupting-volcano.jpeg?auto=compress&cs=tinysrgb&w=600"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover shadow-lg"
        style={{ filter: "blur(150px)" }}
      />
      <div className="w-full max-w-4xl -mt-[10vh] z-1">
        <input
          type="text"
          placeholder="Secret-Goku"
          className="w-full rounded-[8px] overflow-y-hidden h-20 placeholder:opacity-60 opacity-90 py-1.5 px-4 text-black dark:text-white focus:outline-none text-4xl transition"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          required
        />
        <div className="flex items-center justify-start gap-10 mt-6 mb-4 px-4">
          <span
            className="flex justify-center opacity-70 items-center gap-2"
            title="Total Views"
          >
            <Eye className="w-5 h-5" />
            {total.views}
          </span>
          <span
            className="flex justify-center opacity-70 items-center gap-2"
            title="Total Likes"
          >
            <Heart className="w-5 h-5" />
            {total.likes}
          </span>
          <span
            className="flex justify-center opacity-70 items-center gap-2"
            title="Total Replies"
          >
            <Reply className="w-5 h-5" />
            {total.replies}
          </span>
          <span
            className="flex justify-center opacity-70 items-center gap-2"
            title="Total Reposts"
          >
            <RefreshCcw className="w-5 h-5" />
            {total.reposts + total.quotes}
          </span>
          <span
            className="flex justify-center opacity-70 items-center gap-2"
            title="Total Bookmarks"
          >
            <Bookmark className="w-5 h-5" />
            {total.bookmarks}
          </span>{" "}
          <div className="flex-1" />
          {links.length > 0 && (
            <button
              onClick={saveTrendsList}
              disabled={saving || loading}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
            >
              <SaveAll className="w-5 h-5" />
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <form
            onSubmit={handleAddLink}
            style={{ display: "flex", gap: 8, flex: 1 }}
          >
            <input
              type="url"
              placeholder="Paste a link and hit enter"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-[8px] bg-black/10 focus:bg-black/30 placeholder:opacity-60 opacity-90 py-2 mt-4 px-4 text-black dark:text-white focus:outline-none"
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddLink(e as any);
                }
              }}
            />
          </form>
        </div>

        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {loading && (
          <div style={{ color: "#888", marginTop: 8 }}>Loading stats...</div>
        )}
        <ul
          style={{
            marginTop: 24,
            listStyle: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
          className="customTweets"
        >
          {links.map((link, idx) => {
            const tweetId = extractTweetId(link);
            return (
              <li key={idx}>
                {tweetId ? (
                  <TweetComponent id={tweetId} />
                ) : (
                  <span>Invalid Tweet Link</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
