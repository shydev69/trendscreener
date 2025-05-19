"use client";
import { Eye, Heart, RefreshCcw, Reply } from "lucide-react";
import React, { useEffect, useState } from "react";
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

type TrendsList = {
  trendsList: any;
};

async function fetchTrendsList(id: string): Promise<TrendsList | null> {
  try {
    const res = await fetch(`/api/trends/${id}`);
    if (!res.ok) throw new Error("Failed to fetch trends list");

    return await res.json();
  } catch {
    return null;
  }
}

async function fetchTweetStats(tweetId: string): Promise<TweetStats> {
  try {
    const res = await fetch(
      `https://api.twitterapi.io/twitter/tweets?tweet_ids=${tweetId}`,
      {
        headers: {
          "X-API-Key": process.env
            .NEXT_PUBLIC_TWITTERAPI_BEARER_TOKEN as string,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch tweet data");
    const data = await res.json();
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

export default function TrendsListEditPage() {
  const params = useParams();
  const router = useRouter();
  const listId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [input, setInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<TweetStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch trends list from server on mount
  useEffect(() => {
    if (!listId) return;
    setInitialLoading(true);
    fetchTrendsList(listId).then((list) => {
      if (list) {
        setLinks(list.trendsList.urls || []);
        setStats(list.trendsList.analysis || []);
      }
      console.log("Fetched trends list:", list);
      setInitialLoading(false);
    });
  }, [listId]);

  // Update stats when links change
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

  const handleRemoveLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: links.map(normalize),
          analysis: JSON.stringify(stats),
        }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save trends list");
      }
      router.refresh();
    } catch (err) {
      setError("Failed to save trends list. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (initialLoading) {
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16 }}>
        Loading trends list...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 16,
          justifyContent: "center",
        }}
      >
        <span title="Total Likes">
          <Heart />
          {total.likes}
        </span>
        <span title="Total Views">
          <Eye />
          {total.views}
        </span>
        <span title="Total Replies">
          <Reply />
          {total.replies}
        </span>
        <span title="Total Reposts">
          <RefreshCcw />
          {total.reposts}
        </span>
        <span title="Total Quotes">
          <span>Q</span>
          {total.quotes}
        </span>
        <span title="Total Bookmarks">
          <span>B</span>
          {total.bookmarks}
        </span>
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
            placeholder="Enter a tweet link"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: 8 }}
            required
          />
          <button type="submit" style={{ padding: "8px 16px" }}>
            Add
          </button>
        </form>

        {links.length > 0 && (
          <button
            onClick={saveTrendsList}
            disabled={saving || loading}
            style={{
              marginLeft: 8,
              padding: "8px 16px",
              background: "#1da1f2",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {saving ? "Saving..." : "Save List"}
          </button>
        )}
      </div>

      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {loading && (
        <div style={{ color: "#888", marginTop: 8 }}>Loading stats...</div>
      )}
      <ul style={{ marginTop: 24, listStyle: "none", padding: 0 }}>
        {links.map((link, idx) => {
          const tweetId = extractTweetId(link);
          return (
            <li key={idx} style={{ marginBottom: 24, position: "relative" }}>
              <button
                onClick={() => handleRemoveLink(idx)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  fontSize: 18,
                }}
                title="Remove"
                aria-label="Remove"
              >
                ×
              </button>
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
  );
}
