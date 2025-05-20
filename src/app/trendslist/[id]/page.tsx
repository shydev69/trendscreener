"use client";
import {
  Bookmark,
  Eye,
  Heart,
  RefreshCcw,
  Reply,
  SaveAll,
  Trash,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Tweet as TweetComponent } from "react-tweet";
import { useParams, useRouter } from "next/navigation";

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
    // Support both array and single tweet object
    const tweets = Array.isArray(data?.tweets) ? data.tweets : [data?.tweets];
    if (tweets.length > 1) {
      // Sum all fields if array
      interface TweetApiResponse {
        likeCount?: number;
        viewCount?: number;
        replyCount?: number;
        retweetCount?: number;
        quoteCount?: number;
        bookmarkCount?: number;
      }

      return tweets.reduce(
        (acc: TweetStats, tweet: TweetApiResponse) => ({
          id: tweetId,
          likes: acc.likes + (tweet.likeCount ?? 0),
          views: acc.views + (tweet.viewCount ?? 0),
          replies: acc.replies + (tweet.replyCount ?? 0),
          reposts: acc.reposts + (tweet.retweetCount ?? 0),
          quotes: acc.quotes + (tweet.quoteCount ?? 0),
          bookmarks: acc.bookmarks + (tweet.bookmarkCount ?? 0),
        }),
        {
          id: tweetId,
          likes: 0,
          views: 0,
          replies: 0,
          reposts: 0,
          quotes: 0,
          bookmarks: 0,
        } as TweetStats
      );
    }
    const tweet = tweets?.[0] ?? {};
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

export default function TrendsListIdPage() {
  const params = useParams();
  const router = useRouter();
  const listId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [input, setInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<TweetStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [listName, setListName] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch trends list from server on mount
  useEffect(() => {
    if (!listId) return;
    setInitialLoading(true);
    fetch(`/api/trends/${listId}`)
      .then((res) => res.json())
      .then((list) => {
        if (list && list.trendsList) {
          setLinks(list.trendsList.urls || []);
          setStats(
            Array.isArray(list.trendsList.analysis)
              ? list.trendsList.analysis
              : JSON.parse(list.trendsList.analysis || "[]")
          );
          setListName(list.trendsList.name || "");
        }
        setInitialLoading(false);
      });
  }, [listId]);

  // Update stats when links change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const newStats: TweetStats[] = [];
      const linksIdsStringWithCommasWithoutBrackets = links
        .reduce((acc, link) => {
          const tweetId = extractTweetId(link);
          if (tweetId) {
            acc.push(tweetId);
          }
          return acc;
        }, [] as string[])
        .join(",")
        .replace(/[\[\]']+/g, "");
      console.log(
        "Fetching stats for",
        linksIdsStringWithCommasWithoutBrackets
      );
      try {
        let data = await fetchTweetStats(
          linksIdsStringWithCommasWithoutBrackets
        );

        newStats.push(data);
      } catch {}
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
      const response = await fetch(`/api/trends/${listId}`, {
        method: "PATCH",
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
      window.location.reload();
    } catch (err) {
      setError("Failed to save trends list. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTrendsList() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/trends/${listId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to delete trends list");
      }
      window.location.href = "/trendslist";
    } catch (err) {
      setError("Failed to delete trends list. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-full mx-auto flex flex-col relative items-center">
      <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {loading && (
          <div style={{ color: "#ffffff55", marginTop: 8 }}>
            Loading stats...
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 flex gap-5 items-center px-7 py-5 z-10 text-center text-sm">
        <button
          onClick={() => {
            const url =
              typeof window !== "undefined" ? window.location.href : "";
            if (navigator.share) {
              navigator.share({
                title: listName || "Trends List",
                url,
              });
            } else {
              navigator.clipboard.writeText(url);
              alert("Link copied to clipboard!");
            }
          }}
          className="flex items-center justify-center gap-2 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
          type="button"
          title="Share this list"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
          Share
        </button>
        <button
          onClick={saveTrendsList}
          disabled={saving || loading}
          className="flex items-center justify-center gap-2 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
        >
          <SaveAll className="w-5 h-5" />
          {saving ? "Saving..." : ""}
        </button>
        <button
          onClick={deleteTrendsList}
          disabled={deleting || loading}
          className="flex items-center justify-center gap-2 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
        >
          <Trash className="w-5 h-5" />
          {deleting ? "Deleting..." : ""}
        </button>
      </div>
      <img
        src="https://images.pexels.com/photos/19961796/pexels-photo-19961796/free-photo-of-view-of-an-erupting-volcano.jpeg?auto=compress&cs=tinysrgb&w=600"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover shadow-lg"
        style={{ filter: "blur(150px)" }}
      />
      <div className="w-full max-w-2xl -mt-[10vh] z-1">
        <input
          type="text"
          placeholder="List name"
          className="w-full rounded-[8px] overflow-y-hidden h-20 placeholder:opacity-60 opacity-90 py-1.5 px-4 text-black dark:text-white focus:outline-none text-4xl transition"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
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

        <ul className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6 list-none p-0 customTweets">
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
