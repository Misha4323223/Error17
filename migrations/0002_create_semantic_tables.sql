
-- Создание семантических таблиц
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"favorite_colors" text[],
	"preferred_styles" text[],
	"design_complexity" text DEFAULT 'medium',
	"total_interactions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "learning_patterns" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pattern" text NOT NULL,
	"category" text NOT NULL,
	"confidence" integer DEFAULT 50,
	"success_rate" integer DEFAULT 0,
	"times_used" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "project_memory" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"project_title" text NOT NULL,
	"project_type" text NOT NULL,
	"description" text,
	"domain" text DEFAULT 'general',
	"semantic_tags" text[],
	"concepts" text[],
	"original_query" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "emotional_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"emotional_state" text NOT NULL,
	"dominant_emotion" text,
	"confidence" integer DEFAULT 50,
	"context" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "semantic_cache" (
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

-- Создание внешних ключей
DO $$ BEGIN
 ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "learning_patterns" ADD CONSTRAINT "learning_patterns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "project_memory" ADD CONSTRAINT "project_memory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "emotional_history" ADD CONSTRAINT "emotional_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS "user_profiles_user_id_idx" ON "user_profiles" ("user_id");
CREATE INDEX IF NOT EXISTS "learning_patterns_user_id_idx" ON "learning_patterns" ("user_id");
CREATE INDEX IF NOT EXISTS "learning_patterns_category_idx" ON "learning_patterns" ("category");
CREATE INDEX IF NOT EXISTS "project_memory_user_id_idx" ON "project_memory" ("user_id");
CREATE INDEX IF NOT EXISTS "project_memory_session_id_idx" ON "project_memory" ("session_id");
CREATE INDEX IF NOT EXISTS "project_memory_active_idx" ON "project_memory" ("is_active");
CREATE INDEX IF NOT EXISTS "emotional_history_user_id_idx" ON "emotional_history" ("user_id");
CREATE INDEX IF NOT EXISTS "emotional_history_session_id_idx" ON "emotional_history" ("session_id");
CREATE INDEX IF NOT EXISTS "semantic_cache_category_idx" ON "semantic_cache" ("category");
CREATE INDEX IF NOT EXISTS "semantic_cache_expires_at_idx" ON "semantic_cache" ("expires_at");
