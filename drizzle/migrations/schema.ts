import { pgTable, jsonb, timestamp, text, boolean, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const trendLists = pgTable("trend_lists", {
	urls: jsonb().array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`),
	id: text().primaryKey().notNull(),
	analysis: jsonb().default({}),
	isPublic: boolean("is_public").default(true).notNull(),
	creatorId: text("creator_id").notNull(),
	name: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	likes: bigint({ mode: "number" }).default(sql`'0'`),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	views: bigint({ mode: "number" }).default(sql`'0'`),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	quotes: bigint({ mode: "number" }).default(sql`'0'`),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	replies: bigint({ mode: "number" }).default(sql`'0'`),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	reposts: bigint({ mode: "number" }).default(sql`'0'`),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	bookmarks: bigint({ mode: "number" }).default(sql`'0'`),
	description: text(),
	newId: text(),
});
