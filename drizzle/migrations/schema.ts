import { pgTable, foreignKey, jsonb, timestamp, uuid, boolean, text, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const trendLists = pgTable("trend_lists", {
	urls: jsonb().array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`),
	id: uuid().defaultRandom().primaryKey().notNull(),
	analysis: jsonb().default({}),
	isPublic: boolean("is_public").default(false).notNull(),
	creatorId: text("creator_id").notNull(),
	name: text(),
}, (table) => [
	foreignKey({
			columns: [table.creatorId],
			foreignColumns: [users.id],
			name: "trend_lists_creator_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const users = pgTable("users", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	listIds: uuid("list_ids").array(),
	bio: text(),
	id: text().primaryKey().notNull(),
}, (table) => [
	unique("users_id_key").on(table.id),
]);
