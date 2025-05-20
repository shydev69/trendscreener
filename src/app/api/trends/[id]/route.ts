import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";
import { trendLists } from "../../../../../drizzle/migrations/schema";
import { eq, and, or } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

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

    const user = await currentUser();
    const userId = user?.id;
    console.log("userId", userId);

    const trendsList = await queryDb(async (db) => {
      return db
        .select()
        .from(trendLists)
        .where(
          userId
            ? and(
                eq(trendLists.id, listId),
                or(
                  eq(trendLists.isPublic, true),
                  eq(trendLists.creatorId, userId)
                )
              )
            : and(eq(trendLists.id, listId), eq(trendLists.isPublic, true))
        )
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

export async function DELETE(
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

    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const deletedCount = await queryDb(async (db) => {
      return db
        .delete(trendLists)
        .where(and(eq(trendLists.id, listId), eq(trendLists.creatorId, userId)))
        .returning()
        .then((rows) => rows.length);
    });

    if (deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Trends list not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete trends list:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete trends list",
        message: error.message || "Unknown error",
        cause: error.cause?.message || "Unknown cause",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, urls, analysis, isPublic } = body;

    if (!name || !urls || !analysis) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedTrendsList = await queryDb(async (db) => {
      return db
        .update(trendLists)
        .set({
          name,
          urls,
          analysis,
          isPublic,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(trendLists.id, listId), eq(trendLists.creatorId, userId)))
        .returning()
        .then((rows) => rows[0]);
    });

    if (!updatedTrendsList) {
      return NextResponse.json(
        { success: false, error: "Trends list not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, trendsList: updatedTrendsList });
  } catch (error: any) {
    console.error("Failed to update trends list:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update trends list",
        message: error.message || "Unknown error",
        cause: error.cause?.message || "Unknown cause",
      },
      { status: 500 }
    );
  }
}
