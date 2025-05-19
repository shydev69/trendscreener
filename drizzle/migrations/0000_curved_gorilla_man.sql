-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "trend_lists" (
	"urls" jsonb[],
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis" jsonb DEFAULT '{}'::jsonb,
	"is_public" boolean DEFAULT false NOT NULL,
	"creator_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trend_lists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"list_ids" uuid[],
	"bio" text,
	"id" text PRIMARY KEY NOT NULL,
	CONSTRAINT "users_id_key" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "trend_lists" ADD CONSTRAINT "trend_lists_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
*/