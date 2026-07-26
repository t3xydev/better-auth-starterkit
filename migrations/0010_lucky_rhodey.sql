CREATE TABLE "devtools_users" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_key" text NOT NULL,
	"label" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "devtools_users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "devtools_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP INDEX "nostrPubkeys_publicKey_uidx";--> statement-breakpoint
ALTER TABLE "devtools_users" ADD CONSTRAINT "devtools_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;