import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 10; // max requests
const WINDOW_MS = 60 * 1000; // per minute
const ipRequests = new Map<string, { count: number; timestamp: number }>();

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
    // Make request to your production Instagram API server
    const response = await fetch(
      "https://trendscreener-py.onrender.com/get_likes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shortcode: shortcode,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the Instagram data
    return NextResponse.json({
      success: true,
      data: {
        shortcode: data.shortcode,
        likes: data.likes_count || 0,
        comments: data.comments_count || 0,
        views: data.views_count || 0,
        caption: data.caption,
        error: data.error,
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

    // Make request to your local Instagram API server
    // const response = await fetch("http://localhost:8000/get_likes", {
    const response = await fetch(
      "https://trendscreener-py.onrender.com/get_likes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shortcode: shortcode,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the Instagram data
    return NextResponse.json({
      success: true,
      data: {
        shortcode: data.shortcode,
        likes: data.likes_count || 0,
        comments: data.comments_count || 0,
        views: data.views_count || 0,
        caption: data.caption,
        error: data.error,
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
