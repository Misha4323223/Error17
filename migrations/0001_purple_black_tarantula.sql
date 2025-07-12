CREATE TABLE "semantic_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"query_hash" text NOT NULL,
	"query_text" text NOT NULL,
	"semantic_result" text NOT NULL,
	"confidence" integer DEFAULT 50,
	"category" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "semantic_cache_query_hash_unique" UNIQUE("query_hash")
);
