import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import { eq, and, ilike, desc, isNull } from "drizzle-orm";
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

    const trends = await queryDb(async (db) => {
      return db
        .select()
        .from(trendLists)
        .where(
          search
            ? and(
                eq(trendLists.creatorId, userId),
                ilike(trendLists.name, `%${search}%`),
                isNull(trendLists.newId)
              )
            : and(eq(trendLists.creatorId, userId), isNull(trendLists.newId))
        )
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
