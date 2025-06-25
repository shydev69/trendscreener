// src/app/api/tiktokData/route.ts
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 10; // max requests
const WINDOW_MS = 60 * 1000; // per minute
const ipRequests = new Map<string, { count: number; timestamp: number }>();

// RapidAPI configuration for TikTok
const RAPIDAPI_KEY =
  process.env.RAPIDAPI_KEY! ||
  process.env.RAPIDAPI_KEY_BACKUP!;
const RAPIDAPI_HOST = "tiktok-api23.p.rapidapi.com";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  // Rate limiting logic
  const entry = ipRequests.get(ip) || { count: 0, timestamp: now };
  if (now - entry.timestamp > WINDOW_MS) {
    entry.count = 1;
    entry.timestamp = now;
  } else {
    entry.count += 1;
  }
  ipRequests.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const videoId = req.nextUrl.searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json(
      { error: "Missing videoId parameter" },
      { status: 400 }
    );
  }

  try {
    // Make request to RapidAPI TikTok API
    const url = `https://${RAPIDAPI_HOST}/api/post/detail?videoId=${videoId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });

    console.log("TikTok API response status:", response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TikTok data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract data from RapidAPI response structure
    const itemInfo = data.itemInfo?.itemStruct;

    if (!itemInfo) {
      return NextResponse.json(
        { error: "No video data found" },
        { status: 404 }
      );
    }

    // Return the TikTok data in your expected format
    return NextResponse.json({
      success: true,
      data: {
        videoId: itemInfo.id || videoId,
        likes:
          itemInfo.stats?.diggCount ||
          data.itemInfo?.itemStruct?.statsV2?.diggCount ||
          0,
        comments:
          itemInfo.stats?.commentCount ||
          data.itemInfo?.itemStruct?.statsV2?.commentCount ||
          0,
        views:
          itemInfo.stats?.playCount ||
          data.itemInfo?.itemStruct?.statsV2?.playCount ||
          0,
        shares:
          itemInfo.stats?.shareCount ||
          data.itemInfo?.itemStruct?.statsV2?.shareCount ||
          0,
        description: itemInfo.desc || "",
        author: {
          username: itemInfo.author?.uniqueId || "",
          nickname: itemInfo.author?.nickname || "",
          is_verified: itemInfo.author?.verified || false,
          avatar_url:
            itemInfo.author?.avatarThumb || itemInfo.author?.avatarMedium || "",
          follower_count:
            itemInfo.authorStats?.followerCount ||
            itemInfo.authorStatsV2?.followerCount ||
            0,
        },
        video: {
          duration: itemInfo.video?.duration || 0,
          cover_url: itemInfo.video?.cover || itemInfo.video?.originCover || "",
          play_url: itemInfo.video?.playAddr || "",
          download_url: itemInfo.video?.downloadAddr || "",
          width: itemInfo.video?.width || 0,
          height: itemInfo.video?.height || 0,
        },
        music: {
          title: itemInfo.music?.title || "",
          author: itemInfo.music?.authorName || "",
          is_original: itemInfo.music?.original || false,
          duration: itemInfo.music?.duration || 0,
        },
        created_time: itemInfo.createTime || 0,
        hashtags:
          itemInfo.textExtra?.filter((item: any) => item.hashtagName) || [],
        mentions:
          itemInfo.textExtra?.filter((item: any) => item.userUniqueId) || [],
        error: null,
      },
    });
  } catch (error: any) {
    console.error("TikTok API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch TikTok data",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support POST method for flexibility
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  // Rate limiting logic
  const entry = ipRequests.get(ip) || { count: 0, timestamp: now };
  if (now - entry.timestamp > WINDOW_MS) {
    entry.count = 1;
    entry.timestamp = now;
  } else {
    entry.count += 1;
  }
  ipRequests.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId in body" },
        { status: 400 }
      );
    }

    // Make request to RapidAPI TikTok API
    const url = `https://${RAPIDAPI_HOST}/api/post/detail?videoId=${videoId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TikTok data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract data from RapidAPI response structure
    const itemInfo = data.itemInfo?.itemStruct;

    if (!itemInfo) {
      return NextResponse.json(
        { error: "No video data found" },
        { status: 404 }
      );
    }

    // Return the TikTok data in your expected format
    return NextResponse.json({
      success: true,
      data: {
        videoId: itemInfo.id || videoId,
        likes:
          itemInfo.stats?.diggCount ||
          data.itemInfo?.itemStruct?.statsV2?.diggCount ||
          0,
        comments:
          itemInfo.stats?.commentCount ||
          data.itemInfo?.itemStruct?.statsV2?.commentCount ||
          0,
        views:
          itemInfo.stats?.playCount ||
          data.itemInfo?.itemStruct?.statsV2?.playCount ||
          0,
        shares:
          itemInfo.stats?.shareCount ||
          data.itemInfo?.itemStruct?.statsV2?.shareCount ||
          0,
        description: itemInfo.desc || "",
        author: {
          username: itemInfo.author?.uniqueId || "",
          nickname: itemInfo.author?.nickname || "",
          is_verified: itemInfo.author?.verified || false,
          avatar_url:
            itemInfo.author?.avatarThumb || itemInfo.author?.avatarMedium || "",
          follower_count:
            itemInfo.authorStats?.followerCount ||
            itemInfo.authorStatsV2?.followerCount ||
            0,
        },
        video: {
          duration: itemInfo.video?.duration || 0,
          cover_url: itemInfo.video?.cover || itemInfo.video?.originCover || "",
          play_url: itemInfo.video?.playAddr || "",
          download_url: itemInfo.video?.downloadAddr || "",
          width: itemInfo.video?.width || 0,
          height: itemInfo.video?.height || 0,
        },
        music: {
          title: itemInfo.music?.title || "",
          author: itemInfo.music?.authorName || "",
          is_original: itemInfo.music?.original || false,
          duration: itemInfo.music?.duration || 0,
        },
        created_time: itemInfo.createTime || 0,
        hashtags:
          itemInfo.textExtra?.filter((item: any) => item.hashtagName) || [],
        mentions:
          itemInfo.textExtra?.filter((item: any) => item.userUniqueId) || [],
        error: null,
      },
    });
  } catch (error: any) {
    console.error("TikTok API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch TikTok data",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
