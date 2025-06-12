"use client";
import {
  Bookmark,
  Delete,
  Eye,
  Heart,
  RefreshCcw,
  Reply,
  SaveAll,
  Trash,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Tweet as TweetComponent } from "react-tweet";
//import returnCurrentUserId from "./returnCurrentUserId";
import { useRouter } from "next/navigation";
import Analysis from "@/components/Analysis";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import TrendImage from "@/components/trendimage";

const TWEET_URL_REGEX =
  /^https?:\/\/(www\.)?(x|twitter)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/i;
const extractTweetId = (url: string) => url.match(TWEET_URL_REGEX)?.[5] ?? null;
const isInstagramUrl = (url: string) =>
  /instagram\.com\/(?:p|reel)\/[A-Za-z0-9_-]+/.test(url);

// Add TikTok support to the main creation page as well
const TIKTOK_URL_REGEX = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
const isTiktokUrl = (url: string) => TIKTOK_URL_REGEX.test(url);
const extractTiktokId = (url: string) => {
  const match = url.match(TIKTOK_URL_REGEX);
  return match ? match[1] : null;
};

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

// Add Instagram stats type
type InstagramStats = {
  shortcode: string;
  likes: number;
  comments: number;
  views: number;
  caption: string | null;
};

// Function to fetch Instagram stats
async function fetchInstagramStats(
  shortcode: string
): Promise<InstagramStats | null> {
  try {
    const response = await fetch(`/api/instagramData?shortcode=${shortcode}`);
    const result = await response.json();

    if (result.success) {
      return {
        shortcode: result.data.shortcode,
        likes: result.data.likes || 0,
        comments: result.data.comments || 0,
        views: result.data.views || 0,
        caption: result.data.caption,
      };
    } else {
      console.error("Instagram API error:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch Instagram stats:", error);
    return null;
  }
}

// Helper function to extract Instagram shortcode
const extractInstagramShortcode = (url: string) => {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

export default function TrendsListPage() {
  const router = useRouter();
  const [input, setInput] = useState(""),
    [links, setLinks] = useState<string[]>([]),
    [error, setError] = useState(""),
    [stats, setStats] = useState<TweetStats[]>([]),
    [loading, setLoading] = useState(false),
    [saving, setSaving] = useState(false),
    [listName, setListName] = useState(""),
    [description, setDescription] = useState(""),
    [listId, setListId] = useState(""),
    [listIdExists, setListIdExists] = useState(false),
    [listIdChecked, setListIdChecked] = useState(false); // Track if CA was checked
  const [isPublic, setIsPublic] = useState(false);

  // Update stats when links change - now handles both Twitter and Instagram
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const newStats: TweetStats[] = [];

      // Separate Twitter and Instagram links
      const twitterLinks: string[] = [];
      const instagramLinks: string[] = [];

      links.forEach((link) => {
        const tweetId = extractTweetId(link);
        const instaShortcode = extractInstagramShortcode(link);

        if (tweetId) {
          twitterLinks.push(tweetId);
        } else if (instaShortcode) {
          instagramLinks.push(instaShortcode);
        }
      });

      try {
        // Fetch Twitter stats
        if (twitterLinks.length > 0) {
          console.log("Fetching Twitter stats for", twitterLinks);

          for (const tweetId of twitterLinks) {
            try {
              const twitterData = await fetchTweetStats(tweetId);
              newStats.push(twitterData);
            } catch (error) {
              console.error(
                `Failed to fetch Twitter stats for ${tweetId}:`,
                error
              );
            }
          }
        }

        // Fetch Instagram stats
        if (instagramLinks.length > 0) {
          console.log("Fetching Instagram stats for", instagramLinks);

          for (const shortcode of instagramLinks) {
            try {
              const instaData = await fetchInstagramStats(shortcode);
              if (instaData) {
                // Convert Instagram stats to TweetStats format
                const convertedStats: TweetStats = {
                  id: instaData.shortcode,
                  likes: instaData.likes,
                  views: instaData.views,
                  replies: instaData.comments, // Instagram comments = Twitter replies
                  reposts: 0, // Instagram doesn't have reposts
                  quotes: 0, // Instagram doesn't have quotes
                  bookmarks: 0, // Instagram doesn't have bookmarks (we don't track saves)
                };
                newStats.push(convertedStats);
              }
            } catch (error) {
              console.error(
                `Failed to fetch Instagram stats for ${shortcode}:`,
                error
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }

      if (!cancelled) setStats(newStats);
      if (!cancelled) setLoading(false);
    })();

    if (!links.length) setStats([]);
    return () => {
      cancelled = true;
    };
  }, [links]);

  // Function to check CA existence
  const checkListIdExists = async () => {
    if (!listId.trim()) {
      setListIdExists(false);
      setListIdChecked(false);
      return;
    }

    try {
      const response = await fetch(`/api/listIdExists?listId=${listId.trim()}`);
      const data = await response.json();
      setListIdExists(data.exists);
      setListIdChecked(true);
    } catch (error) {
      console.error("Error checking list ID existence:", error);
      setListIdChecked(false);
    }
  };

  // Handle Enter key press on CA input
  const handleCAKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkListIdExists();
    }
  };

  // Reset check status when user types
  const handleCAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListId(e.target.value);
    setListIdChecked(false); // Reset check status
    setListIdExists(false); // Reset exists status
  };

  const normalize = (url: string) => url.trim().replace(/\/+$/, "") + "/";

  // Updated handleAddLink to support both Twitter and Instagram
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();

    // Check if it's a valid Twitter, Instagram, or TikTok URL
    const isTweet = TWEET_URL_REGEX.test(trimmed);
    const isInstagram = isInstagramUrl(trimmed);
    const isTiktok = isTiktokUrl(trimmed);

    if (!isTweet && !isInstagram && !isTiktok) {
      return setError("Please enter a valid tweet, Instagram, or TikTok URL.");
    }

    const normalized = normalize(trimmed);
    if (links.map(normalize).includes(normalized)) {
      return setError("This post is already added.");
    }

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
          id: !listIdExists ? listId || undefined : undefined, // Use the provided listId or generate a new one
          name: listName,
          description,
          urls: links.map(normalize),
          analysis: total,
          isPublic, // <-- Save public/private state
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save trends list");
      }

      window.location.href = `/app/trendscreen/${data.listId}`;
    } catch (err) {
      console.error("Failed to save trendscreen:", err);
      setError("Failed to save trends list. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const removeUrlAtIndex = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Add this function to extract Instagram post ID
  const extractInstagramId = (url: string) => {
    const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // Update the Instagram embed component
  const InstagramEmbed = ({ instaId }: { instaId: string }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // Listen for postMessage from iframe
      const handleMessage = (event: MessageEvent) => {
        // Check if this message is for THIS specific Instagram post
        if (
          event.data.type === "instagram-height" &&
          event.data.instaId === instaId
        ) {
          console.log(`Received height for ${instaId}:`, event.data.height);
          if (event.data.height && iframeRef.current) {
            const height = Math.max(event.data.height, 300); // Minimum height of 300px
            iframeRef.current.style.height = `${height}px`;
            console.log(`Set iframe height for ${instaId} to:`, height);
          }
        }
      };

      window.addEventListener("message", handleMessage);

      // Clean up event listener
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }, [instaId]);

    return (
      <div className="w-full">
        <iframe
          ref={iframeRef}
          src={`/api/instagramEmbed?instaId=${instaId}`}
          className="w-full border-0 rounded-lg"
          style={{
            borderRadius: "20px",
            height: "400px", // Initial height
            minHeight: "300px", // Minimum height
          }}
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
          title={`Instagram post ${instaId}`}
        />
      </div>
    );
  };

  return (
    <div className="w-full mx-auto relative flex flex-col items-center">
      <SignedOut>
        <div className="w-full text-center mt-10 h-screen flex items-center justify-center">
          Please log in to create trend screens.
        </div>
      </SignedOut>
      <SignedIn>
        {/* Blue gradient background effects */}
        <div className="relative antialiased w-full justify-center items-center fixed inset-0 -top-[50vh] blur-xl z-0">
          <div className="absolute w-full h-[200vh] bg-radial from-[#60a5fa]/30 to-transparent -top-[70vh] left-[40%] rounded-full blur-[100px]"></div>
          <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[45vh] left-[95%]"></div>
          <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[60%]"></div>
          <div className="absolute w-[70vh] h-[70vh] bg-radial from-[#60a5fa]/30 to-transparent top-[100vh] rounded-full blur-3xl left-[-20%]"></div>
          <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] left-[40%]"></div>
          <div className="absolute w-[10vh] blur-[80px] h-[100vh] bg-radial from-[#60a5fa]/30 -rotate-45 to-transparent top-[20vh] blur-3xl left-[30%]"></div>
        </div>

        <div className="absolute top-0 left-0 w-full z-10 text-center text-sm">
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          {loading && (
            <div style={{ color: "#ffffff55", marginTop: 8 }}>
              Loading stats...
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 flex gap-5 items-center px-5 py-5 z-10 text-center text-sm">
          {/* Public/Private Switch */}
          <div className="flex items-center gap-2 bg-[#ffffff11] backdrop-blur-3xl rounded-3xl px-3 py-2 border border-[#e5eae6]/10">
            <Switch
              id="is-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label
              htmlFor="is-public"
              className="text-[#e5eae6] pt-1 opacity-80 font-normal"
            >
              {isPublic ? "Public" : "Private"}
            </Label>
          </div>
          <button
            onClick={saveTrendsList}
            disabled={saving || loading}
            className="flex items-center justify-center gap-2 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
          >
            <SaveAll className="w-5 h-5" />
            {saving ? "Saving..." : ""}
          </button>
        </div>
        <img
          src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
          alt="Goku"
          className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover shadow-lg"
          style={{ filter: "blur(150px)" }}
        />
        <div className="w-full max-w-2xl -mt-[10vh] z-1 relative">
          <TrendImage
            trendId={listId}
            className="w-14 h-14 mx-4 my-4 rounded-[10px]"
          />{" "}
          <input
            type="text"
            placeholder="Enter CA"
            className="w-full geist-mono rounded-[8px] overflow-y-hidden h-14 placeholder:opacity-60 opacity-50 py-0 px-4 text-black dark:text-white focus:outline-none text-base transition"
            value={listId}
            onChange={handleCAChange}
            onKeyDown={handleCAKeyDown}
          />
          {listIdChecked && listId && (
            <p
              className={`text-sm mb-2 mx-4 ${
                listIdExists ? "text-red-400" : "text-green-400"
              }`}
            >
              {listIdExists ? "This CA already exists." : "CA is available!"}
            </p>
          )}
          <input
            type="text"
            placeholder="Give it a name..."
            className="w-full rounded-[8px] overflow-y-hidden h-20 placeholder:opacity-60 opacity-90 py-1.5 px-4 text-black dark:text-white focus:outline-none text-4xl transition"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
          />
          <div className="flex items-center justify-start gap-10 mt-6 mb-4 px-4">
            <Analysis total={total} />
          </div>{" "}
          <textarea
            rows={3}
            placeholder="Add a description..."
            className="w-full rounded-[8px] overflow-y-hidden h-20 placeholder:opacity-60 opacity-90 py-1.5 px-4 text-black dark:text-white focus:outline-none my-5 text-base transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
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
                placeholder="Paste a Twitter or Instagram link and hit enter"
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
          <ul className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6 list-none p-0 customTweets max-w-full overflow-x-hidden">
            {links.map((link, idx) => {
              const tweetId = extractTweetId(link);
              const instaId = extractInstagramId(link);
              const tiktokId = extractTiktokId(link);
              console.log(
                "Processing link:",
                link,
                "Tweet ID:",
                tweetId,
                "Instagram ID:",
                instaId,
                "TikTok ID:",
                tiktokId
              );

              return (
                <li key={idx}>
                  {tweetId ? (
                    <div className="flex flex-col items-end relative">
                      <div
                        className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                        onClick={() => removeUrlAtIndex(idx)}
                      >
                        <Trash className="w-4 h-4" />
                      </div>
                      <TweetComponent id={tweetId} />
                    </div>
                  ) : instaId ? (
                    <div className="flex flex-col items-end relative">
                      <div
                        className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                        onClick={() => removeUrlAtIndex(idx)}
                      >
                        <Trash className="w-4 h-4" />
                      </div>
                      <InstagramEmbed instaId={instaId} />
                    </div>
                  ) : tiktokId ? (
                    <div className="flex flex-col items-end relative">
                      <div
                        className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                        onClick={() => removeUrlAtIndex(idx)}
                      >
                        <Trash className="w-4 h-4" />
                      </div>
                      <div className="bg-blue-900/20 text-blue-400 rounded-lg p-4 text-center">
                        TikTok videos cannot be previewed yet.
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end relative">
                      <div
                        className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                        onClick={() => removeUrlAtIndex(idx)}
                      >
                        <Trash className="w-4 h-4" />
                      </div>
                      <div className="bg-red-900/20 text-red-400 rounded-lg p-4 text-center">
                        Invalid Tweet or Instagram Link
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </SignedIn>
    </div>
  );
}
