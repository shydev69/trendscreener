import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import { eq, and, ilike, desc, isNull, or, like } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const userId = (await currentUser())?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "views";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
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
    const sortColumn = sortColumns[sortBy] || trendLists.views;

    // Build base conditions
    const baseConditions = [
      eq(trendLists.creatorId, userId),
      isNull(trendLists.newId),
    ];
    if (search) {
      baseConditions.push(ilike(trendLists.name, `%${search}%`));
    }

    // TODO: Implement platform filtering for user search
    // Platform filtering temporarily disabled due to TypeScript issues

    const trends = await queryDb(async (db) => {
      return db
        .select()
        .from(trendLists)
        .where(and(...baseConditions))
        .orderBy(sortOrder === "asc" ? sortColumn : desc(sortColumn))
        .limit(limit)
        .offset(offset);
    });
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
