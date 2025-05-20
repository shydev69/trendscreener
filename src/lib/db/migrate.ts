import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
export const db: NeonHttpDatabase<typeof schema> = drizzle(connectionString, {
  schema,
});

const main = async () => {
  const startTime = Date.now();

  try {
    await migrate(db, { migrationsFolder: "drizzle/migrations" });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
  } catch (error: unknown) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(
      `[${new Date().toISOString()}] ❌ Migration failed after ${duration}s`
    );

    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
      if (error.stack) {
        console.error(`Stack trace:\n${error.stack}`);
      }
    } else {
      console.error(`Error details: ${String(error)}`);
    }

    process.exit(1);
  }

  process.exit(0);
};

main();
