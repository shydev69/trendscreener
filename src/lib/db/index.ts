import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/lib/db/schema";
import { env } from "@/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function queryDb(
  query: (db: ReturnType<typeof drizzle>) => Promise<any>
) {
  try {
    const result = await query(db);
    return result;
  } catch (error) {
    console.log("Database error:", error);
  }
}
