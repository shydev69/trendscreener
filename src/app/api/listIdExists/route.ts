import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("listId");

    if (!listId) {
      return NextResponse.json(
        { success: false, error: "listId parameter is required" },
        { status: 400 }
      );
    }

    const exists = await queryDb(async (db) => {
      const result = await db
        .select()
        .from(trendLists)
        .where(eq(trendLists.id, listId));
      return result.length > 0;
    });
    console.log("List ID exists:", exists);

    return NextResponse.json({ success: true, exists });
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
