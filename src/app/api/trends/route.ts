import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const {
      id: _id, // This is not used, but kept for compatibility
      urls,
      name,
      description,
      analysis,
      creatorId = await currentUser().then((user) => user?.id),
      isPublic = false,
    } = await request.json();

    // Generate a unique ID for the trends list
    const listId = _id || crypto.randomUUID();

    await queryDb(async (db) => {
      return db.insert(trendLists).values({
        id: listId,
        urls,
        name,
        description,
        analysis,
        creatorId,
        isPublic,
        updatedAt: new Date().toISOString(),
        likes: analysis.likes,
        views: analysis.views,
        quotes: analysis.quotes,
        reposts: analysis.reposts,
        replies: analysis.replies,
        bookmarks: analysis.bookmarks,
      });
    });

    return NextResponse.json({ success: true, listId });
  } catch (error: any) {
    console.error("Failed to save trends list:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save trends list",
        message: error.message || "Unknown error",
        cause: error.cause?.message || "Unknown cause",
      },
      { status: 500 }
    );
  }
}
