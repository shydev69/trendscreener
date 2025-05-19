import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const {
      urls,
      analysis,
      creatorId = await currentUser().then((user) => user?.id),
      isPublic = false,
    } = await request.json();

    // Generate a unique ID for the trends list
    const listId = crypto.randomUUID();

    await queryDb(async (db) => {
      return db.insert(trendLists).values({
        id: listId,
        urls,
        analysis,
        creatorId,
        isPublic,
        updatedAt: new Date().toISOString(),
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
