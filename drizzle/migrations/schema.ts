import { pgTable, foreignKey, jsonb, timestamp, uuid, unique, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const trendLists = pgTable("trend_lists", {
	urls: jsonb().array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`(now() AT TIME ZONE 'utc'::text)`),
	id: uuid().defaultRandom().primaryKey().notNull(),
	creatorId: uuid("creator_id").defaultRandom(),
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
	id: uuid().defaultRandom().primaryKey().notNull(),
	listIds: uuid("list_ids").array(),
	bio: text(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("users_id_key").on(table.id),
]);
