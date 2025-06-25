// Server-side utility for updating trendscreen stats
// This runs on the server and is not exposed to the client

interface SocialStats {
  platform: "twitter" | "instagram" | "tiktok";
  postId: string;
  url: string;
  likes: number;
  views: number;
  comments: number;
  reposts?: number;
  quotes?: number;
  bookmarks?: number;
  shares?: number;
}

interface TwitterStats {
  id: string;
  likes: number;
  views: number;
  replies: number;
  reposts: number;
  quotes: number;
  bookmarks: number;
}

interface InstagramStats {
  shortcode: string;
  likes: number;
  comments: number;
  views: number;
  caption: string | null;
}

interface TiktokStats {
  videoId: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  description: string | null;
}

// Extract post IDs from URLs
const extractTweetId = (url: string) => {
  const match = url.match(
    /^https?:\/\/(www\.)?(x|twitter)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/i
  );
  return match?.[5] ?? null;
};

const extractInstagramId = (url: string) => {
  const match = url.match(/instagram\.com\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

const extractTiktokId = (url: string) => {
  const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  return match ? match[1] : null;
};

// Platform detection
const isTwitterUrl = (url: string) =>
  /^https?:\/\/(www\.)?(x|twitter)\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/i.test(
    url
  );

const isInstagramUrl = (url: string) =>
  /instagram\.com\/(?:p|reel|reels)\/[A-Za-z0-9_-]+/.test(url);

const isTiktokUrl = (url: string) =>
  /tiktok\.com\/@[\w.-]+\/video\/(\d+)/.test(url);

// Fetch stats from external APIs (server-side only)
async function fetchTwitterStats(
  tweetId: string
): Promise<TwitterStats | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TWITTERAPI_BEARER_TOKEN;
    const url = `https://api.twitterapi.io/twitter/tweets?tweet_ids=${tweetId}`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey as string,
      },
    });

    if (!response.ok) {
      console.error(`Twitter API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const tweets = Array.isArray(data?.tweets) ? data.tweets : [data?.tweets];

    if (tweets.length > 1) {
      // Sum all fields if array
      return tweets.reduce(
        (acc: TwitterStats, tweet: any) => ({
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
        }
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
    console.error("Error fetching Twitter stats:", error);
    return null;
  }
}

async function fetchInstagramStats(
  shortcode: string
): Promise<InstagramStats | null> {
  try {
    const rapidApiKey =
      process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY_BACKUP;
    const url = `https://instagram-social-api.p.rapidapi.com/v1/post_info?code_or_id_or_url=${shortcode}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey!,
        "x-rapidapi-host": "instagram-social-api.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      console.error(`Instagram API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const postData = data.data;

    if (!postData) {
      return null;
    }

    return {
      shortcode: postData.code || shortcode,
      likes: postData.metrics?.like_count || 0,
      comments: postData.metrics?.comment_count || 0,
      views: postData.metrics?.view_count || 0,
      caption: postData.caption?.text || null,
    };
  } catch (error) {
    console.error("Error fetching Instagram stats:", error);
    return null;
  }
}

async function fetchTiktokStats(videoId: string): Promise<TiktokStats | null> {
  try {
    const rapidApiKey =
      process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY_BACKUP;
    const url = `https://tiktok-api23.p.rapidapi.com/api/post/detail?videoId=${videoId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey!,
        "x-rapidapi-host": "tiktok-api23.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      console.error(`TikTok API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const itemInfo = data.itemInfo?.itemStruct;

    if (!itemInfo) {
      return null;
    }

    return {
      videoId: itemInfo.id || videoId,
      likes: itemInfo.stats?.diggCount || itemInfo.statsV2?.diggCount || 0,
      comments:
        itemInfo.stats?.commentCount || itemInfo.statsV2?.commentCount || 0,
      views: itemInfo.stats?.playCount || itemInfo.statsV2?.playCount || 0,
      shares: itemInfo.stats?.shareCount || itemInfo.statsV2?.shareCount || 0,
      description: itemInfo.desc || null,
    };
  } catch (error) {
    console.error("Error fetching TikTok stats:", error);
    return null;
  }
}

// Main function to update stats for a trendscreen
export async function updateTrendscreenStats(
  trendscreenId: string,
  urls: string[]
): Promise<void> {
  try {
    const stats: SocialStats[] = [];

    // Process each URL and fetch its stats
    for (const url of urls) {
      let stat: SocialStats | null = null;

      if (isTwitterUrl(url)) {
        const tweetId = extractTweetId(url);
        if (tweetId) {
          const twitterStats = await fetchTwitterStats(tweetId);
          if (twitterStats) {
            stat = {
              platform: "twitter",
              postId: tweetId,
              url,
              likes: twitterStats.likes,
              views: twitterStats.views,
              comments: twitterStats.replies,
              reposts: twitterStats.reposts,
              quotes: twitterStats.quotes,
              bookmarks: twitterStats.bookmarks,
            };
          }
        }
      } else if (isInstagramUrl(url)) {
        const shortcode = extractInstagramId(url);
        if (shortcode) {
          const instaStats = await fetchInstagramStats(shortcode);
          if (instaStats) {
            stat = {
              platform: "instagram",
              postId: shortcode,
              url,
              likes: instaStats.likes,
              views: instaStats.views,
              comments: instaStats.comments,
            };
          }
        }
      } else if (isTiktokUrl(url)) {
        const videoId = extractTiktokId(url);
        if (videoId) {
          const tiktokStats = await fetchTiktokStats(videoId);
          if (tiktokStats) {
            stat = {
              platform: "tiktok",
              postId: videoId,
              url,
              likes: tiktokStats.likes,
              views: tiktokStats.views,
              comments: tiktokStats.comments,
              shares: tiktokStats.shares,
            };
          }
        }
      }

      if (stat) {
        stats.push(stat);
      }
    }

    // Only update if we have stats to save
    if (stats.length > 0) {
      const internalToken =
        process.env.INTERNAL_API_TOKEN || "internal-secure-token-change-this";

      // Call internal API to update stats
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/internal/updateStats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${internalToken}`,
            "x-client-id": "server-side-updater",
          },
          body: JSON.stringify({
            trendscreenId,
            stats,
          }),
        }
      );
      console.log(
        `Updating stats for trendscreen ${trendscreenId} with ${stats.length} entries`
      );
      if (!response.ok) {
        console.error(`Failed to update stats: ${response.status}`);
      } else {
        console.log(
          `Successfully updated stats for trendscreen ${trendscreenId}`
        );
      }
    }
    
  } catch (error) {
    console.error("Error in updateTrendscreenStats:", error);
  }
}

// Function to be called when a trendscreen page is visited
export async function onTrendscreenVisit(
  trendscreenId: string,
  urls: string[]
): Promise<void> {
  // Run in background without blocking the page load
  setImmediate(() => {
    updateTrendscreenStats(trendscreenId, urls)
      .then(() => {
        console.log("Background stats update succeeded");
      })
      .catch((error) => {
        console.error("Background stats update failed:", error);
      });
  });
}
