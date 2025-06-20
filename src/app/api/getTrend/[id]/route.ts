import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../../drizzle/migrations/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trendId } = await params;

    if (!trendId) {
      return NextResponse.json(
        { success: false, error: "Missing trend ID" },
        { status: 400 }
      );
    }

    const trend = await queryDb(async (db) => {
      const result = await db
        .select()
        .from(trendLists)
        .where(and(eq(trendLists.id, trendId), isNull(trendLists.newId)))
        .limit(1);

      return result[0] || null;
    });

    if (!trend) {
      return NextResponse.json(
        { success: false, error: "Trend not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, trend });
  } catch (error: any) {
    console.error("Failed to fetch trend:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trend",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
