import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import { eq, and, isNull } from "drizzle-orm";
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

    const trends = await queryDb(async (db) => {
      return db
        .select()
        .from(trendLists)
        .where(and(eq(trendLists.isPublic, true), isNull(trendLists.newId)))
        .limit(10);
    });

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
