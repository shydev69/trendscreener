import { currentUser } from "@clerk/nextjs/server";
import { users } from "../../drizzle/migrations/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export default async function Home() {
  const user = await currentUser();
  console.log("User ID:", user?.id);
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  let allusers = [];
  try {
    allusers = await db.select().from(users);
    console.log("allusers", allusers);
  } catch (error) {
    console.error("Database error:", error);
    // Handle the error appropriately
  }

  let dbStatus = "not connected";
  try {
    // Try a simple query to check connection
    await db.execute("SELECT 1");
    dbStatus = "connected";
  } catch (error) {
    dbStatus = "not connected";
    console.error("Database ping failed:", error);
  }

  return (
    <div>
      {user ? "hello " + user.firstName : "not logged in"}
      <br />
      Database status:{" "}
      <b style={{ color: dbStatus === "connected" ? "green" : "red" }}>
        {dbStatus}
      </b>
    </div>
  );
}
