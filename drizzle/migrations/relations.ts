import { relations } from "drizzle-orm/relations";
import { usersInAuth, trendLists, users } from "./schema";

export const trendListsRelations = relations(trendLists, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [trendLists.creatorId],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	trendLists: many(trendLists),
	users: many(users),
}));

export const usersRelations = relations(users, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
}));