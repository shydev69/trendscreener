import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../drizzle/migrations/schema";
import { eq, and, like } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    if (!search) {
      return NextResponse.json(
        { success: false, error: "Missing search parameter" },
        { status: 400 }
      );
    }

    const trends = await queryDb(async (db) => {
      return db
        .select()
        .from(trendLists)
        .where(
          and(
            eq(trendLists.isPublic, true),
            like(trendLists.name, `%${search}%`)
          )
        )
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

// example link: http://localhost:3000/api/userSearch?search=trends
