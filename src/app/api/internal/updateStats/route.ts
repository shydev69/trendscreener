import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../../drizzle/migrations/schema";
import { eq } from "drizzle-orm";

// Internal security token - this should be set in environment variables
const INTERNAL_API_TOKEN =
  process.env.INTERNAL_API_TOKEN || "internal-secure-token-change-this";

// Rate limiting for internal calls
const RATE_LIMIT = 50; // max requests
const WINDOW_MS = 60 * 1000; // per minute
const internalRequests = new Map<
  string,
  { count: number; timestamp: number }
>();

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
  lastUpdated: number;
}

interface UpdateStatsPayload {
  trendscreenId: string;
  stats: SocialStats[];
}

export async function POST(req: NextRequest) {
  try {
    // Security check 1: Verify internal token
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== INTERNAL_API_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Security check 2: Verify request origin (internal only)
    const headersList = await headers();
    const host = headersList.get("host");
    const referer = headersList.get("referer");

    // Only allow requests from same origin or no referer (server-side)
    if (referer && !referer.includes(host || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Rate limiting for internal calls
    const clientId = req.headers.get("x-client-id") || "internal";
    const now = Date.now();
    const entry = internalRequests.get(clientId) || {
      count: 0,
      timestamp: now,
    };

    if (now - entry.timestamp > WINDOW_MS) {
      entry.count = 1;
      entry.timestamp = now;
    } else {
      entry.count += 1;
    }
    internalRequests.set(clientId, entry);

    if (entry.count > RATE_LIMIT) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Parse request body
    const body: UpdateStatsPayload = await req.json();
    const { trendscreenId, stats } = body;

    if (!trendscreenId || !stats || !Array.isArray(stats)) {
      return NextResponse.json(
        {
          error: "Invalid payload. Required: trendscreenId, stats array",
        },
        { status: 400 }
      );
    }

    // Validate trendscreen exists
    const trendscreen = await queryDb(async (db) => {
      return db
        .select()
        .from(trendLists)
        .where(eq(trendLists.id, trendscreenId))
        .limit(1);
    });

    if (!trendscreen || trendscreen.length === 0) {
      return NextResponse.json(
        {
          error: "Trendscreen not found",
        },
        { status: 404 }
      );
    }

    // Aggregate all stats from all platforms for this trendscreen
    const totalStats = {
      likes: 0,
      views: 0,
      replies: 0,
      reposts: 0,
      quotes: 0,
      bookmarks: 0,
    };

    // Sum up stats from all posts
    for (const stat of stats) {
      totalStats.likes += stat.likes || 0;
      totalStats.views += stat.views || 0;
      totalStats.replies += stat.comments || 0; // comments -> replies mapping
      totalStats.reposts += stat.reposts || 0;
      totalStats.quotes += stat.quotes || 0;
      totalStats.bookmarks += stat.bookmarks || 0;
    }

    // Update the database with aggregated stats
    await queryDb(async (db) => {
      return db
        .update(trendLists)
        .set({
          likes: totalStats.likes,
          views: totalStats.views,
          replies: totalStats.replies,
          reposts: totalStats.reposts,
          quotes: totalStats.quotes,
          bookmarks: totalStats.bookmarks,
          analysis: {
            likes: totalStats.likes,
            views: totalStats.views,
            quotes: totalStats.quotes,
            replies: totalStats.replies,
            reposts: totalStats.reposts,
            bookmarks: totalStats.bookmarks,
          },
          updatedAt: new Date().toISOString(),
        })
        .where(eq(trendLists.id, trendscreenId));
    });

    return NextResponse.json({
      success: true,
      message: "Stats updated successfully",
      updatedCount: stats.length,
      totalStats,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Error updating stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Only allow POST method for security
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
