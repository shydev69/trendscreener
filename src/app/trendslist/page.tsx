"use client";
import React, { useState, useEffect } from "react";
import { Tweet } from "react-tweet";

// Regex for both x.com and twitter.com
const TWEET_URL_REGEX =
  /^https?:\/\/(www\.)?(x|twitter)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/i;

function extractTweetId(url: string): string | null {
  const match = url.match(TWEET_URL_REGEX);
  return match ? match[5] : null;
}

// Simple SVG icons
const Icon = {
  like: (
    <svg
      width="18"
      height="18"
      fill="currentColor"
      style={{ verticalAlign: "middle" }}
    >
      <path d="M9 16s-6-4.35-6-8.5A3.5 3.5 0 0 1 9 4.5a3.5 3.5 0 0 1 6 3C15 11.65 9 16 9 16z" />
    </svg>
  ),
  view: (
    <svg
      width="18"
      height="18"
      fill="currentColor"
      style={{ verticalAlign: "middle" }}
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="9" cy="9" r="2" />
    </svg>
  ),
  reply: (
    <svg
      width="18"
      height="18"
      fill="currentColor"
      style={{ verticalAlign: "middle" }}
    >
      <path d="M2 9l6-6v4h4a4 4 0 0 1 4 4v3h-2v-3a2 2 0 0 0-2-2h-4v4z" />
    </svg>
  ),
  repost: (
    <svg
      width="18"
      height="18"
      fill="currentColor"
      style={{ verticalAlign: "middle" }}
    >
      <path
        d="M17 1v6h-6M1 17v-6h6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M17 7a8 8 0 0 0-8-8M1 11a8 8 0 0 0 8 8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
};

type TweetStats = {
  id: string;
  likes: number;
  views: number;
  replies: number;
  reposts: number;
};

// Simulate fetching tweet stats (replace with real API if available)
async function fetchTweetStats(tweetId: string): Promise<TweetStats> {
  // Use react-tweet fetchTweet to get real tweet data
  // https://react-tweet.vercel.app/docs/api-reference#fetchtweet
  // Returns { data: { ...tweet }, error }
  const { fetchTweet } = await import("react-tweet/api");
  const { data } = await fetchTweet(tweetId);
  if (!data) throw new Error("Failed to fetch tweet data");

  // Use type assertion to access properties that might not be in the Tweet type
  const tweetData = data as any;

  return {
    id: tweetId,
    likes: tweetData.likes ?? 0,
    views: tweetData.views ?? 0,
    replies: tweetData.replies ?? 0,
    reposts: tweetData.reposts ?? 0,
  };
}

export default function TrendsListPage() {
  const [input, setInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<TweetStats[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tweet stats when links change
  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      setLoading(true);
      const newStats: TweetStats[] = [];
      try {
        for (const link of links) {
          const tweetId = extractTweetId(link);
          if (!tweetId) continue;
          try {
            // Fetch real stats using react-tweet
            const stat = await fetchTweetStats(tweetId);
            newStats.push(stat);
          } catch (err) {
            console.error(`Error fetching stats for tweet ${tweetId}:`, err);
          }
        }
        if (!cancelled) setStats(newStats);
      } catch (error) {
        console.error("Error fetching tweet stats:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (links.length) fetchStats();
    else setStats([]);

    return () => {
      cancelled = true;
    };
  }, [links]);

  // Prevent duplicates (case-insensitive, ignore trailing slashes)
  function normalize(url: string) {
    return url.trim().replace(/\/+$/, "").toLowerCase();
  }

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!TWEET_URL_REGEX.test(trimmed)) {
      setError("Please enter a valid tweet URL.");
      return;
    }
    const normalized = normalize(trimmed);
    if (links.map(normalize).includes(normalized)) {
      setError("This tweet is already added.");
      return;
    }
    setLinks([trimmed, ...links]);
    setInput("");
    setError("");
  };

  // Aggregate totals
  const total = stats.reduce(
    (acc, curr) => ({
      likes: acc.likes + curr.likes,
      views: acc.views + curr.views,
      replies: acc.replies + curr.replies,
      reposts: acc.reposts + curr.reposts,
    }),
    { likes: 0, views: 0, replies: 0, reposts: 0 }
  );

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
          {Icon.like} {total.likes}
        </span>
        <span title="Total Views">
          {Icon.view} {total.views}
        </span>
        <span title="Total Replies">
          {Icon.reply} {total.replies}
        </span>
        <span title="Total Reposts">
          {Icon.repost} {total.reposts}
        </span>
      </div>
      <form
        onSubmit={handleAddLink}
        style={{ display: "flex", gap: 8, marginBottom: 8 }}
      >
        <input
          type="url"
          placeholder="Enter a tweet link"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          style={{ flex: 1, padding: 8 }}
          required
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Add
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {loading && (
        <div style={{ color: "#888", marginTop: 8 }}>Loading stats...</div>
      )}
      <ul style={{ marginTop: 24, listStyle: "none", padding: 0 }}>
        {links.map((link, idx) => {
          const tweetId = extractTweetId(link);
          return (
            <li key={idx} style={{ marginBottom: 24 }}>
              {tweetId ? (
                <Tweet id={tweetId} />
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
