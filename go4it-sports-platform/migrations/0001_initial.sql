-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	"role" text DEFAULT 'student' NOT NULL,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

-- Create videos table
CREATE TABLE IF NOT EXISTS "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"filename" text NOT NULL,
	"original_name" text,
	"analysis_status" text DEFAULT 'pending' NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"processed_at" timestamp
);

-- Create gar_scores table
CREATE TABLE IF NOT EXISTS "gar_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"video_id" integer,
	"overall_score" integer NOT NULL,
	"speed_score" integer,
	"accuracy_score" integer,
	"decision_score" integer,
	"skill_breakdown" jsonb,
	"created_at" timestamp DEFAULT now()
);

-- Create starpath_progress table
CREATE TABLE IF NOT EXISTS "starpath_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"skill_id" text NOT NULL,
	"skill_name" text NOT NULL,
	"xp_points" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"is_unlocked" boolean DEFAULT false NOT NULL,
	"unlocked_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);

-- Create academic_records table
CREATE TABLE IF NOT EXISTS "academic_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"gpa" numeric(3,2),
	"credits_completed" integer DEFAULT 0,
	"total_credits_required" integer DEFAULT 120,
	"sat_score" integer,
	"is_ncaa_eligible" boolean DEFAULT false,
	"courses" jsonb,
	"updated_at" timestamp DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"xp_reward" integer DEFAULT 0,
	"earned_at" timestamp DEFAULT now()
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "gar_scores" ADD CONSTRAINT "gar_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "gar_scores" ADD CONSTRAINT "gar_scores_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "starpath_progress" ADD CONSTRAINT "starpath_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "academic_records" ADD CONSTRAINT "academic_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create uploads directory (handled by application)
-- Note: This would typically be handled by the application startup process
-- to create the uploads/videos/ directory for file storage
