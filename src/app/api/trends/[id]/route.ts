import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../../drizzle/migrations/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listId } = await params;

    if (!listId) {
      return NextResponse.json(
        { success: false, error: "Missing listId" },
        { status: 400 }
      );
    }

    const trendsList = await queryDb(async (db) => {
      return db
        .select()
        .from(trendLists)
        .where(eq(trendLists.id, listId))
        .limit(1)
        .then((rows) => rows[0]);
    });

    if (!trendsList) {
      return NextResponse.json(
        { success: false, error: "Trends list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, trendsList });
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
