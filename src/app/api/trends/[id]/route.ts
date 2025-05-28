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
    const { id } = await params;

    const trends = await queryDb(async (db) => {
      return db.select().from(trendLists).where(eq(trendLists.id, id));
    });

    if (trends.length === 0) {
      return NextResponse.json(
        { success: false, error: "Trends list not found" },
        { status: 404 }
      );
    }

    const trend = trends[0];

    // If this list has a newListId (redirect), redirect to the new one
    if (trend.newListId && trend.newListId !== id) {
      return NextResponse.json({
        success: true,
        redirect: trend.newListId,
        message: "This list has been moved to a new CA",
      });
    }

    return NextResponse.json({
      success: true,
      trendscreen: trend,
    });
  } catch (error: any) {
    console.error("Failed to fetch trends list:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trends list",
        message: error.message || "Unknown error",
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
    const currentUserId = (await currentUser())?.id;

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      name,
      description,
      urls,
      analysis,
      isPublic,
      newListId,
      isRedirect,
    } = await request.json();

    // Check if user owns this list
    const existingList = await queryDb(async (db) => {
      const result = await db
        .select()
        .from(trendLists)
        .where(eq(trendLists.id, listId));
      return result[0];
    });

    if (!existingList || existingList.creatorId !== currentUserId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // If this is a redirect update (old list pointing to new CA)
    if (isRedirect && newListId) {
      await queryDb(async (db) => {
        await db
          .update(trendLists)
          .set({
            newId: newListId, // Set redirect CA
            // Don't update other fields for redirect
          })
          .where(eq(trendLists.id, listId));
      });

      return NextResponse.json({ success: true, listId, isRedirect: true });
    }

    // Normal update (no CA change)
    await queryDb(async (db) => {
      await db
        .update(trendLists)
        .set({
          name,
          description,
          urls,
          analysis,
          isPublic: !!isPublic,
        })
        .where(eq(trendLists.id, listId));
    });

    return NextResponse.json({ success: true, listId });
  } catch (error: any) {
    console.error("Failed to update trends list:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update trends list",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
