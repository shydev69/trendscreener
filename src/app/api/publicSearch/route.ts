import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import {
  eq,
  and,
  ilike,
  desc,
  gte,
  sql,
  isNull,
  or,
  like,
  SQL,
} from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "views";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const findFromToday = searchParams.get("findFromToday") === "true";
    const findFromThisWeek = searchParams.get("findFromThisWeek") === "true";
    const newTimeFilter = searchParams.get("newTimeFilter"); // For new sort: 5m, 1h, 6h, 12h, 24h
    const intelligentSort = searchParams.get("intelligentSort") === "true";
    const platforms = searchParams.get("platforms")?.split(",") || [
      "twitter",
      "instagram",
      "tiktok",
    ];

    const offset = (page - 1) * limit;

    // Map sortBy string to column
    const sortColumns: Record<string, any> = {
      likes: trendLists.likes,
      views: trendLists.views,
      quotes: trendLists.quotes,
      reposts: trendLists.reposts,
      replies: trendLists.replies,
      bookmarks: trendLists.bookmarks,
      createdAt: trendLists.createdAt,
    };
    const sortColumn = sortColumns[sortBy];

    // Build where conditions
    const conditions = [
      and(eq(trendLists.isPublic, true), isNull(trendLists.newId)),
    ];

    if (search) {
      conditions.push(ilike(trendLists.name, `%${search}%`));
    }

    // Time filters based on createdAt (when trendscreen was first created)
    // These can be applied together now
    if (findFromToday) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      conditions.push(gte(trendLists.createdAt, today.toISOString()));
    }

    if (findFromThisWeek) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo.setHours(0, 0, 0, 0);
      conditions.push(gte(trendLists.createdAt, oneWeekAgo.toISOString()));
    }

    // New time filters (can be combined with Top filters)
    if (newTimeFilter) {
      const now = new Date();
      let timeAgo = new Date();

      switch (newTimeFilter) {
        case "5m":
          timeAgo.setMinutes(now.getMinutes() - 5);
          break;
        case "1h":
          timeAgo.setHours(now.getHours() - 1);
          break;
        case "6h":
          timeAgo.setHours(now.getHours() - 6);
          break;
        case "12h":
          timeAgo.setHours(now.getHours() - 12);
          break;
        case "24h":
          timeAgo.setHours(now.getHours() - 24);
          break;
        default:
          break;
      }
      conditions.push(gte(trendLists.createdAt, timeAgo.toISOString()));
    }

    let trends;
    if (intelligentSort) {
      // Intelligent sort: order by createdAt DESC, then views DESC
      trends = await queryDb(async (db) => {
        // Intelligent sort: score = (views + 1) / (hours since created + 2)^1.5
        // This boosts new trends with high views, penalizes old/low-view trends
        const now = new Date();
        return db
          .select()
          .from(trendLists)
          .where(and(...conditions))
          .orderBy(
            // Custom score: (views + 1) / (hours since created + 2)^1.5 DESC
            desc(
              sql`
                (((${trendLists.views} + 1)::float) / 
                POWER(EXTRACT(EPOCH FROM (NOW() - ${trendLists.createdAt})) / 3600 + 2, 1.5))
              `
            )
          )
          .limit(limit)
          .offset(offset);
      });
    } else {
      trends = await queryDb(async (db) => {
        return db
          .select()
          .from(trendLists)
          .where(and(...conditions))
          .orderBy(sortOrder === "asc" ? sortColumn : desc(sortColumn))
          .limit(limit)
          .offset(offset);
      });
    }

    // Apply platform filtering after database fetch (since urls is JSON array)
    if (platforms.length > 0 && platforms.length < 3) {
      trends = trends.filter((trend: any) => {
        const urls = Array.isArray(trend.urls)
          ? trend.urls
          : JSON.parse(trend.urls || "[]");

        return platforms.some((platform) => {
          return urls.some((url: string) => {
            const lowerUrl = url.toLowerCase();
            switch (platform) {
              case "twitter":
                return (
                  lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")
                );
              case "instagram":
                return lowerUrl.includes("instagram.com");
              case "tiktok":
                return lowerUrl.includes("tiktok.com");
              default:
                return false;
            }
          });
        });
      });
    }

    console.log("Trends fetched:", trends);
    return NextResponse.json({ success: true, trends });
  } catch (error: any) {
    console.error("Failed to fetch trends list:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trends list",
        message: error.message || "Unknown error",
        cause: error.cause?.message || "Unknown cause",
      },
      { status: 500 }
    );
  }
}

// example link: http://localhost:3000/api/publicSearch?search=trends&findFromToday=true
