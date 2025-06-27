"use client";
import {
  Bookmark,
  Eye,
  Heart,
  Link,
  RefreshCcw,
  Reply,
  SaveAll,
  Trash,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Tweet as TweetComponent } from "react-tweet";
import { useParams, useRouter } from "next/navigation";
import Analysis from "@/components/Analysis";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import TrendImage from "@/components/trendimage";
import { trackTrendscreenVisit } from "@/actions/trackVisit";

const TWEET_URL_REGEX =
  /^https?:\/\/(www\.)?(x|twitter)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/i;
const TIKTOK_URL_REGEX = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;

const extractTweetId = (url: string) => url.match(TWEET_URL_REGEX)?.[5] ?? null;
const isInstagramUrl = (url: string) =>
  /instagram\.com\/(?:p|reel|reels)\/[A-Za-z0-9_-]+/.test(url);
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

// Add TikTok stats type
type TiktokStats = {
  videoId: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  description: string | null;
};

// Function to fetch TikTok stats
async function fetchTiktokStats(videoId: string): Promise<TiktokStats | null> {
  try {
    const response = await fetch(`/api/tiktokData?videoId=${videoId}`);
    const result = await response.json();

    if (result.success) {
      return {
        videoId: result.data.videoId,
        likes: result.data.likes || 0,
        comments: result.data.comments || 0,
        views: result.data.views || 0,
        shares: result.data.shares || 0,
        description: result.data.description,
      };
    } else {
      console.error("TikTok API error:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch TikTok stats:", error);
    return null;
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
  const [updating, setUpdating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [listName, setListName] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [newListId, setNewListId] = useState(""); // New CA input
  const [listIdExists, setListIdExists] = useState(false); // Check if new CA exists
  const [listIdChecked, setListIdChecked] = useState(false); // Track if CA was checked
  const [caCopied, setCaCopied] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/currentUser");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Function to check CA existence (only on Enter press)
  const checkListIdExists = async () => {
    if (!newListId.trim() || newListId === listId) {
      setListIdExists(false);
      setListIdChecked(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/listIdExists?listId=${newListId.trim()}`
      );
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
    const value = e.target.value;
    setNewListId(value);
    setListIdChecked(false); // Reset check status
    setListIdExists(false); // Reset exists status
    setError(""); // Clear any previous errors
  };

  // Fetch trends list from server on mount
  useEffect(() => {
    if (!listId) return;
    setInitialLoading(true);
    fetch(`/api/trends/${listId}`)
      .then((res) => res.json())
      .then((list) => {
        // Handle redirect if the list has moved to a new CA
        if (list.trendscreen.newId) {
          window.location.href = `/app/trendscreen/${list.trendscreen.newId}`;
          return;
        }

        if (list && list.trendscreen) {
          setLinks(list.trendscreen.urls || []);
          setStats([list.trendscreen.analysis]);
          setDescription(list.trendscreen.description || "");
          setListName(list.trendscreen.name || "");
          setUserId(list.trendscreen.creatorId);
          setIsPublic(!!list.trendscreen.isPublic);
          setNewListId(listId); // Set current CA as default

          // Track trendscreen visit and update stats in background
          if (list.trendscreen.urls && list.trendscreen.urls.length > 0) {
            trackTrendscreenVisit(listId, list.trendscreen.urls).catch(
              (error) => {
                console.error("Failed to track trendscreen visit:", error);
                // Don't show error to user as this is background functionality
              }
            );
          }
        }
        setInitialLoading(false);
      });
  }, [listId]);

  // Update stats when links change - now handles both Twitter and Instagram
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setUpdating(true);
      const newStats: TweetStats[] = [];

      // Separate Twitter, Instagram, and TikTok links
      const twitterLinks: string[] = [];
      const instagramLinks: string[] = [];
      const tiktokLinks: string[] = [];

      links.forEach((link) => {
        const tweetId = extractTweetId(link);
        const instaShortcode = extractInstagramId(link);
        const tiktokId = extractTiktokId(link);

        if (tweetId) {
          twitterLinks.push(tweetId);
        } else if (instaShortcode) {
          instagramLinks.push(instaShortcode);
        } else if (tiktokId) {
          tiktokLinks.push(tiktokId);
        }
      });

      try {
        // Fetch Twitter stats
        if (twitterLinks.length > 0) {
          const twitterIdsString = twitterLinks.join(",");
          console.log("Fetching Twitter stats for", twitterIdsString);

          try {
            const twitterData = await fetchTweetStats(twitterIdsString);
            newStats.push(twitterData);
          } catch (error) {
            console.error("Failed to fetch Twitter stats:", error);
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
        } // Fetch TikTok stats
        if (tiktokLinks.length > 0) {
          console.log("Fetching TikTok stats for", tiktokLinks);

          for (const tiktokId of tiktokLinks) {
            try {
              const tiktokData = await fetchTiktokStats(tiktokId);
              if (tiktokData) {
                // Convert TikTok stats to TweetStats format
                const convertedStats: TweetStats = {
                  id: tiktokData.videoId,
                  likes: tiktokData.likes,
                  views: tiktokData.views,
                  replies: tiktokData.comments, // TikTok comments = Twitter replies
                  reposts: tiktokData.shares, // TikTok shares = Twitter reposts
                  quotes: 0, // TikTok doesn't have quotes
                  bookmarks: 0, // TikTok doesn't have bookmarks (we don't track saves)
                };
                newStats.push(convertedStats);
              }
            } catch (error) {
              console.error(
                `Failed to fetch TikTok stats for ${tiktokId}:`,
                error
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }

      if (!cancelled) setStats(newStats);
      if (!cancelled) setUpdating(false);
    })();

    if (!links.length) setStats([]);
    return () => {
      cancelled = true;
    };
  }, [links]);

  const normalize = (url: string) => url.trim().replace(/\/+$/, "") + "/";
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
      // If CA changed, check if it exists before proceeding
      if (newListId !== listId) {
        // Auto-check if new CA exists
        if (!listIdChecked) {
          try {
            const response = await fetch(
              `/api/listIdExists?listId=${newListId.trim()}`
            );
            const data = await response.json();
            setListIdExists(data.exists);
            setListIdChecked(true);

            // If it exists, show error and stop
            if (data.exists) {
              setError(
                "This CA already exists. Please choose a different one."
              );
              setSaving(false);
              return;
            }
          } catch (error) {
            console.error("Error checking list ID existence:", error);
            setError("Failed to verify CA availability. Please try again.");
            setSaving(false);
            return;
          }
        } else if (listIdExists) {
          // If already checked and exists, show error and stop
          setError("This CA already exists. Please choose a different one.");
          setSaving(false);
          return;
        }

        // Proceed with creating new list since CA is available
        const createResponse = await fetch("/api/trends", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: newListId,
            name: listName,
            description,
            urls: links.map(normalize),
            analysis: total,
            isPublic,
          }),
        });

        const createData = await createResponse.json();
        if (!createData.success) {
          throw new Error(
            createData.error || "Failed to create new trends list"
          );
        }

        // Then, update the old list's newListId to point to the new one
        const updateResponse = await fetch(`/api/trends/${listId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: listName,
            description,
            urls: links.map(normalize),
            analysis: total,
            isPublic,
            newListId: newListId,
            isRedirect: true,
          }),
        });

        const updateData = await updateResponse.json();
        if (!updateData.success) {
          console.warn(
            "Failed to update old list redirect, but new list created successfully"
          );
        }

        // Redirect to the new list
        window.location.href = `/app/trendscreen/${newListId}`;
      } else {
        // Normal update - no CA change
        const response = await fetch(`/api/trends/${listId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: listName,
            description,
            urls: links.map(normalize),
            analysis: total,
            isPublic,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to save trends list");
        }

        window.location.reload();
      }
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
      window.location.href = "/app/trendscreen";
    } catch (err) {
      setError("Failed to delete trends list. Please try again.");
    } finally {
      setDeleting(false);
    }
  }
  const removeUrlAtIndex = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };
  const [copied, setCopied] = useState(false);

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

  // Add TikTok embed component
  const TiktokEmbed = ({ tiktokId }: { tiktokId: string }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // Listen for postMessage from iframe
      const handleMessage = (event: MessageEvent) => {
        // Check if this message is for THIS specific TikTok video
        if (
          event.data.type === "tiktok-height" &&
          event.data.tiktokId === tiktokId
        ) {
          console.log(`Received height for ${tiktokId}:`, event.data.height);
          if (event.data.height && iframeRef.current) {
            const height = Math.max(event.data.height, 400); // Minimum height
            iframeRef.current.style.height = `${height}px`;
            console.log(`Set iframe height for ${tiktokId} to:`, height);
          }
        }
      };

      window.addEventListener("message", handleMessage);

      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }, [tiktokId]);

    return (
      <div className="w-full">
        <iframe
          ref={iframeRef}
          src={`/api/tiktokEmbed?tiktokId=${tiktokId}`}
          className="w-full border-0 rounded-lg"
          style={{
            borderRadius: "20px",
            height: "600px", // Initial height for TikTok
            minHeight: "400px",
          }}
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
          title={`TikTok video ${tiktokId}`}
        />
      </div>
    );
  };

  return (
    <div className="w-full mx-auto flex flex-col relative items-center">
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
        {updating && (
          <div style={{ color: "#ffffff55", marginTop: 8 }}>
            Updating stats...
          </div>
        )}
        {initialLoading && (
          <div style={{ color: "#ffffff55", marginTop: 8 }}>
            Loading trends...
          </div>
        )}
        {caCopied && (
          <div style={{ color: "green", marginTop: 8 }}>
            CA copied to clipboard!
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 flex gap-5 items-center px-5 py-5 z-10 text-center text-sm">
        {currentUser === userId && (
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
        )}
        <button
          onClick={() => {
            const url =
              typeof window !== "undefined" ? window.location.href : "";
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }}
          className="flex items-center justify-center gap-2 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
          type="button"
          title="Share this list"
        >
          <Link className="w-5 h-5" />
          {copied ? "Copied" : "Copy Link"}
        </button>
        {currentUser === userId && (
          <>
            <button
              onClick={saveTrendsList}
              disabled={saving || updating}
              className="flex items-center justify-center gap-2 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
            >
              <SaveAll className="w-5 h-5" />
              {saving ? "Saving..." : ""}
            </button>
            <button
              onClick={deleteTrendsList}
              disabled={deleting || updating}
              className="flex items-center justify-center gap-2 py-2 rounded-[8px] text-white/80 text-sm hover:text-white transition"
            >
              <Trash className="w-5 h-5" />
              {deleting ? "Deleting..." : ""}
            </button>
          </>
        )}
      </div>
      <img
        src="https://imgs.search.brave.com/qcOifdTjOMr7cRj_GmNOUnWlIA1iFsG9wjUqlehoyqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC9qUFRGdE10/LmpwZw"
        alt="Goku"
        className="mx-auto w-full h-[40vh] pointer-events-none select-none object-cover shadow-lg"
        style={{ filter: "blur(150px)" }}
      />
      <div className="w-full max-w-2xl -mt-[10vh] z-1 relative">
        <TrendImage
          trendId={newListId}
          className="w-full h-96 object-cover mx-4 my-4 rounded-[20px]"
        />
        {currentUser === userId && (
          <>
            <div
              className="flex w-full items-center h-14 geist-mono"
              onClick={() => {
                const idToCopy = listId ? listId : newListId;
                currentUser !== userId
                  ? () => {
                      console.log("Copying CA:", idToCopy);
                      toast("Copied CA to Clipboard!");
                      navigator.clipboard.writeText(idToCopy);
                    }
                  : null;
              }}
            >
              {newListId.startsWith("%3C") && newListId.endsWith("%3C") ? (
                <p className="pl-4 mt-0.5 pr-0.5 opacity-50"></p>
              ) : (
                <p className="pl-4 mt-0.5 pr-0.5 opacity-50">CA:</p>
              )}

              <input
                type="text"
                placeholder={
                  newListId.startsWith("%3C") && newListId.endsWith("%3C")
                    ? "Enter new CA"
                    : "(Leave empty to keep current) - Hit Enter to check"
                }
                className="w-full rounded-[8px] opacity-50 overflow-y-hidden h-14 placeholder:opacity-60 py-0 pr-4 text-black dark:text-white focus:outline-none text-base transition"
                value={
                  newListId.startsWith("%3C") && newListId.endsWith("%3C")
                    ? ""
                    : newListId
                }
                onChange={handleCAChange}
                onKeyDown={handleCAKeyDown}
                required
              />
              <a
                href={`https://axiom.trade/t/${encodeURIComponent(
                  newListId
                )}/@tscreener`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/50 text-white rounded-[8px] px-4 py-2 ml-2 flex items-center gap-2"
                title="Open in Axiom"
                style={{
                  pointerEvents: !newListId.trim() ? "none" : "auto",
                  opacity: !newListId.trim() ? 0.5 : 1,
                }}
              >
                <img
                  src="https://axiom.trade/images/axiom-logo-mark.svg"
                  alt="Trade"
                  className="w-4 h-4"
                />{" "}
                <p className="mr-4">Trade</p>
              </a>
            </div>
            {listIdChecked && newListId && newListId !== listId && (
              <p
                className={`text-sm mb-2 mx-4 ${
                  listIdExists ? "text-red-400" : "text-green-400"
                }`}
              >
                {listIdExists
                  ? "This CA already exists. Please choose a different one."
                  : "CA is available!"}
              </p>
            )}
          </>
        )}
        {currentUser !== userId && (
          <>
            <div
              className="flex w-full geist-mono items-center h-14 truncate !text-ellipsis"
              onClick={() => {
                const idToCopy = listId ? listId : newListId;
                console.log("Copying CA:", idToCopy);
                toast("Copied CA to Clipboard!");
                navigator.clipboard.writeText(idToCopy);
              }}
            >
              <p
                className="w-full rounded-[8px] opacity-50 truncate !text-ellipsis overflow-y-hidden h-14 placeholder:opacity-60 py-0 px-4 text-black dark:text-white focus:outline-none text-base transition flex items-center cursor-pointer"
                style={{ userSelect: "all" }}
                title="Click to copy CA"
                onClick={() => {
                  const idToCopy = listId ? listId : newListId;
                  navigator.clipboard.writeText(idToCopy!);
                  toast("Copied CA to Clipboard!");
                }}
              >
                {"CA: " + newListId}
              </p>{" "}
              <a
                href={`https://axiom.trade/t/${encodeURIComponent(
                  newListId
                )}/@tscreener`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/50 text-white rounded-[8px] px-4 py-2 ml-2 flex items-center gap-2"
                title="Open in Axiom"
                style={{
                  pointerEvents: !newListId.trim() ? "none" : "auto",
                  opacity: !newListId.trim() ? 0.5 : 1,
                }}
              >
                <img
                  src="https://axiom.trade/images/axiom-logo-mark.svg"
                  alt="Trade"
                  className="w-4 h-4"
                />{" "}
                <p className="mr-4">Trade</p>
              </a>
            </div>
          </>
        )}
        <input
          type="text"
          placeholder="List name"
          className="w-full rounded-[8px] overflow-y-hidden h-20 placeholder:opacity-60 opacity-90 py-1.5 px-4 text-black dark:text-white focus:outline-none text-4xl transition"
          value={listName}
          disabled={currentUser !== userId}
          required
          onChange={(e) => setListName(e.target.value)}
        />
        <div className="flex items-center justify-start gap-10 mt-6 mb-4 px-4">
          <Analysis total={total} />
          <div className="flex-1" />
        </div>{" "}
        <textarea
          rows={3}
          placeholder="Add a description..."
          className="w-full rounded-[8px] overflow-y-hidden h-20 placeholder:opacity-60 opacity-90 py-1.5 px-4 text-black dark:text-white focus:outline-none my-5 text-base transition"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {currentUser === userId && (
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
        )}
        <ul className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6 list-none p-0 customTweets max-w-full overflow-x-hidden">
          {links.length > 0 ? (
            links.map((link, idx) => {
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
                      {currentUser === userId && (
                        <div
                          className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                          onClick={() => removeUrlAtIndex(idx)}
                        >
                          <Trash className="w-4 h-4" />
                        </div>
                      )}
                      <TweetComponent id={tweetId} />
                    </div>
                  ) : instaId ? (
                    <div className="flex flex-col items-end relative">
                      {currentUser === userId && (
                        <div
                          className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                          onClick={() => removeUrlAtIndex(idx)}
                        >
                          <Trash className="w-4 h-4" />
                        </div>
                      )}
                      <InstagramEmbed instaId={instaId} />
                    </div>
                  ) : tiktokId ? (
                    <div className="flex flex-col items-end relative">
                      {currentUser === userId && (
                        <div
                          className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                          onClick={() => removeUrlAtIndex(idx)}
                        >
                          <Trash className="w-4 h-4" />
                        </div>
                      )}
                      <TiktokEmbed tiktokId={tiktokId} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-end relative">
                      {currentUser === userId && (
                        <div
                          className="bg-red-900 px-4 absolute top-6 right-2 z-10 hover:bg-red-500 transition duration-300 py-3 rounded-[8px] flex items-center justify-center"
                          onClick={() => removeUrlAtIndex(idx)}
                        >
                          <Trash className="w-4 h-4" />
                        </div>
                      )}
                      <div className="bg-red-900/20 text-red-400 rounded-lg p-4 text-center">
                        Invalid Tweet, Instagram, or TikTok Link
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          ) : (
            <li className="text-center text-gray-300 bg-white/10 rounded-2xl py-8 px-4 backdrop-blur-md">
              This list has no links yet. Add some to get started!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
