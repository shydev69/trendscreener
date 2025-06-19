import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 10; // max requests
const WINDOW_MS = 60 * 1000; // per minute
const ipRequests = new Map<string, { count: number; timestamp: number }>();

// RapidAPI configuration
const RAPIDAPI_KEY =
  process.env.RAPIDAPI_KEY ||
  process.env.RAPIDAPI_KEY_BACKUP ||
  "9707a123d7mshe432c4216c34521p135753jsnadd255e63470";
const RAPIDAPI_HOST = "instagram-social-api.p.rapidapi.com";

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

  const shortcode = req.nextUrl.searchParams.get("shortcode");
  if (!shortcode) {
    return NextResponse.json(
      { error: "Missing shortcode parameter" },
      { status: 400 }
    );
  }

  try {
    // Make request to RapidAPI Instagram Social API
    const url = `https://${RAPIDAPI_HOST}/v1/post_info?code_or_id_or_url=${shortcode}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });

    console.log("Instagram API response status:", response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract data from RapidAPI response structure
    const postData = data.data;

    if (!postData) {
      return NextResponse.json(
        { error: "No post data found" },
        { status: 404 }
      );
    }

    // Return the Instagram data in your expected format
    return NextResponse.json({
      success: true,
      data: {
        shortcode: postData.code || shortcode,
        likes: postData.metrics?.like_count || 0,
        comments: postData.metrics?.comment_count || 0,
        views: postData.metrics?.view_count || 0,
        caption: postData.caption?.text || "",
        user: {
          username: postData.user?.username || "",
          full_name: postData.user?.full_name || "",
          is_verified: postData.user?.is_verified || false,
          profile_pic_url: postData.user?.profile_pic_url || "",
        },
        media_type: postData.media_type,
        taken_at: postData.taken_at,
        thumbnail_url:
          postData.thumbnail_url || postData.image_versions?.items?.[0]?.url,
        error: null,
      },
    });
  } catch (error: any) {
    console.error("Instagram API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Instagram data",
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
    const { shortcode } = body;

    if (!shortcode) {
      return NextResponse.json(
        { error: "Missing shortcode in body" },
        { status: 400 }
      );
    }

    // Make request to RapidAPI Instagram Social API
    const url = `https://${RAPIDAPI_HOST}/v1/post_info?code_or_id_or_url=${shortcode}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract data from RapidAPI response structure
    const postData = data.data;

    if (!postData) {
      return NextResponse.json(
        { error: "No post data found" },
        { status: 404 }
      );
    }

    // Return the Instagram data in your expected format
    return NextResponse.json({
      success: true,
      data: {
        shortcode: postData.code || shortcode,
        likes: postData.metrics?.like_count || 0,
        comments: postData.metrics?.comment_count || 0,
        views: postData.metrics?.view_count || 0,
        caption: postData.caption?.text || "",
        user: {
          username: postData.user?.username || "",
          full_name: postData.user?.full_name || "",
          is_verified: postData.user?.is_verified || false,
          profile_pic_url: postData.user?.profile_pic_url || "",
        },
        media_type: postData.media_type,
        taken_at: postData.taken_at,
        thumbnail_url:
          postData.thumbnail_url || postData.image_versions?.items?.[0]?.url,
        error: null,
      },
    });
  } catch (error: any) {
    console.error("Instagram API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Instagram data",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
