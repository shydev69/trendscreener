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
    const trendscreen = await queryDb(async (db) => {
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

    if (!trendscreen) {
      return NextResponse.json(
        { success: false, error: "Trends list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, trendscreen });
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
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const currentUserId = (await currentUser())?.id;
    if (!currentUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, urls, analysis, isPublic, newListId } = await request.json();
    const listId = params.id;

    // Check if user owns this list
    const existingList = await queryDb(async (db) => {
      const result = await db
        .select()
        .from(trendLists)
        .where(eq(trendLists.id, listId));
      return result[0];
    });

    if (!existingList || existingList.creatorId !== currentUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // If changing CA, check if new CA exists
    if (newListId && newListId !== listId) {
      const newIdExists = await queryDb(async (db) => {
        const result = await db
          .select()
          .from(trendLists)
          .where(eq(trendLists.id, newListId));
        return result.length > 0;
      });

      if (newIdExists) {
        return NextResponse.json(
          { success: false, error: "New CA already exists" },
          { status: 400 }
        );
      }

      // Create new entry with new ID and delete old one
      await queryDb(async (db) => {
        // Insert with new ID
        await db.insert(trendLists).values({
          id: newListId,
          name,
          description,
          urls,
          analysis,
          isPublic: !!isPublic,
          creatorId: currentUserId,
        });

        // Delete old entry
        await db.delete(trendLists).where(eq(trendLists.id, listId));
      });

      return NextResponse.json({ success: true, listId: newListId });
    } else {
      // Update existing entry
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
    }
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
