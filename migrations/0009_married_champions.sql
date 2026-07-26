CREATE TABLE "dbsc_bound_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"kind" text NOT NULL,
	"jwk" text NOT NULL,
	"created_at" integer NOT NULL,
	"algorithm" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dbsc_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tier" text NOT NULL,
	"created_at" integer NOT NULL,
	"expires_at" integer NOT NULL,
	"last_refresh_at" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dbsc_bound_keys" ADD CONSTRAINT "dbsc_bound_keys_session_id_dbsc_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."dbsc_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dbsc_sessions" ADD CONSTRAINT "dbsc_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;