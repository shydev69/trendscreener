import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = (await currentUser())?.id;
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, user }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to fetch current user:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch current user",
        message: error.message || "Unknown error",
        cause: error.cause?.message || "Unknown cause",
      }),
      { status: 500 }
    );
  }
}