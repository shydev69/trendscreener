import { relations } from "drizzle-orm/relations";
import { users, trendLists } from "./schema";

export const trendListsRelations = relations(trendLists, ({one}) => ({
	user: one(users, {
		fields: [trendLists.creatorId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	trendLists: many(trendLists),
}));