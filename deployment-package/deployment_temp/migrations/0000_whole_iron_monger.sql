CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"achievement_type" text NOT NULL,
	"earned_date" timestamp DEFAULT now(),
	"icon_type" text
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_type" text NOT NULL,
	"key_value" text NOT NULL,
	"added_at" timestamp DEFAULT now(),
	"last_used" timestamp,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "api_keys_key_type_unique" UNIQUE("key_type")
);
--> statement-breakpoint
CREATE TABLE "artist_nil_deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_id" integer NOT NULL,
	"athlete_id" integer NOT NULL,
	"deal_type" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"deal_terms" jsonb,
	"deal_status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "athlete_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"challenge_id" integer NOT NULL,
	"status" text DEFAULT 'accepted' NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"proof_url" text
);
--> statement-breakpoint
CREATE TABLE "athlete_discoveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"scout_id" integer,
	"full_name" text NOT NULL,
	"username" text NOT NULL,
	"platform" text NOT NULL,
	"profile_url" text NOT NULL,
	"email" text,
	"phone" text,
	"estimated_age" integer,
	"location" text,
	"school_name" text,
	"graduation_year" integer,
	"sports" text[],
	"positions" text[],
	"bio" text,
	"follower_count" integer,
	"post_count" integer,
	"highlights" text[],
	"discovered_at" timestamp DEFAULT now(),
	"last_checked_at" timestamp DEFAULT now(),
	"status" text DEFAULT 'new',
	"assigned_to" integer,
	"notes" text,
	"potential_rating" integer,
	"confidence" integer DEFAULT 70,
	"media_urls" text[],
	"contact_attempts" integer DEFAULT 0,
	"converted_to_user_id" integer
);
--> statement-breakpoint
CREATE TABLE "athlete_journey_map" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"current_phase" text NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"timeline" jsonb NOT NULL,
	"goals" jsonb NOT NULL,
	"milestones" jsonb NOT NULL,
	CONSTRAINT "athlete_journey_map_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "athlete_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"height" integer,
	"weight" integer,
	"age" integer,
	"school" text,
	"graduation_year" integer,
	"sports_interest" text[],
	"motion_score" integer DEFAULT 0,
	"profile_completion_percentage" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "athlete_star_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"star_level" integer NOT NULL,
	"sport" text NOT NULL,
	"position" text NOT NULL,
	"age_group" text,
	"metrics" jsonb NOT NULL,
	"traits" jsonb NOT NULL,
	"film_expectations" text[],
	"training_focus" text[],
	"avatar" text NOT NULL,
	"rank" text,
	"xp_level" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "athlete_star_profiles_profile_id_unique" UNIQUE("profile_id")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"summary" text NOT NULL,
	"cover_image" text,
	"author_id" integer,
	"category" text NOT NULL,
	"publish_date" timestamp DEFAULT now(),
	"featured" boolean DEFAULT false,
	"slug" text NOT NULL,
	"tags" text[],
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text NOT NULL,
	"xp_reward" integer NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"creator_id" integer
);
--> statement-breakpoint
CREATE TABLE "city_influencer_discoveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"scout_id" integer,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"bio" text,
	"follower_count" integer,
	"engagement_rate" real,
	"audience_demo" json,
	"sports" text[],
	"locality_score" integer DEFAULT 0,
	"influence_rank" integer,
	"contact_email" text,
	"contact_phone" text,
	"discovered_at" timestamp DEFAULT now(),
	"last_checked_at" timestamp DEFAULT now(),
	"status" text DEFAULT 'new',
	"assigned_to" integer,
	"notes" text,
	"combine_role" text,
	"compensation" json,
	"media_deliverables" text[],
	"contract_status" text DEFAULT 'none',
	"past_performance" json
);
--> statement-breakpoint
CREATE TABLE "city_influencer_scouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"active" boolean DEFAULT true,
	"last_run_at" timestamp,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"sport_focus" text[],
	"platforms" text[],
	"min_followers" integer DEFAULT 5000,
	"max_influencers" integer DEFAULT 10,
	"created_at" timestamp DEFAULT now(),
	"created_by" integer,
	"discovery_count" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now(),
	"combine_event_id" integer
);
--> statement-breakpoint
CREATE TABLE "coach_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"coach_id" integer NOT NULL,
	"athlete_id" integer NOT NULL,
	"connection_status" text DEFAULT 'pending' NOT NULL,
	"connection_date" timestamp DEFAULT now(),
	"notes" text,
	"last_contact" timestamp
);
--> statement-breakpoint
CREATE TABLE "coach_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"institution" text,
	"sports" text[],
	"level" text,
	"experience" integer,
	"achievements" text
);
--> statement-breakpoint
CREATE TABLE "coach_recruiting_boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"coach_id" integer NOT NULL,
	"transfer_id" integer NOT NULL,
	"interest_level" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"status" text DEFAULT 'tracking' NOT NULL,
	"priority" text DEFAULT 'medium',
	"needs_fit" integer DEFAULT 0,
	"academic_fit" integer DEFAULT 0,
	"culture_fit" integer DEFAULT 0,
	"talent_fit" integer DEFAULT 0,
	"overall_fit" integer DEFAULT 0,
	"last_contact_date" timestamp,
	"next_contact_date" timestamp,
	"visit_scheduled" timestamp,
	"offer_details" json,
	"competing_schools" text[],
	"commitment_chance" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "combine_tour_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"location" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"registration_deadline" timestamp,
	"maximum_attendees" integer,
	"current_attendees" integer DEFAULT 0,
	"price" numeric NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft',
	"featured_image" text,
	"active_network_id" text,
	"registration_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "combine_tour_events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comparison_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"comparison_id" integer NOT NULL,
	"analysis_date" timestamp DEFAULT now(),
	"similarity_score" integer,
	"differences" json,
	"recommendations" text[],
	"ai_generated_notes" text,
	"technique_breakdown" json,
	"play_assignments" json,
	"assignment_grades" json,
	"busted_coverage" boolean DEFAULT false,
	"busted_coverage_details" json,
	"player_comparisons" json,
	"performance_rating" json,
	"recommended_examples" json,
	"defense_analysis" json
);
--> statement-breakpoint
CREATE TABLE "comparison_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"comparison_id" integer NOT NULL,
	"video_id" integer,
	"external_video_url" text,
	"athlete_name" text,
	"video_type" text NOT NULL,
	"order" integer DEFAULT 0,
	"notes" text,
	"key_points" text[],
	"markups" json
);
--> statement-breakpoint
CREATE TABLE "content_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"section" text NOT NULL,
	"order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"last_updated" timestamp DEFAULT now(),
	"last_updated_by" integer,
	"metadata" jsonb,
	CONSTRAINT "content_blocks_identifier_unique" UNIQUE("identifier")
);
--> statement-breakpoint
CREATE TABLE "fan_club_followers" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer NOT NULL,
	"follower_name" text NOT NULL,
	"follower_email" text,
	"follower_type" text NOT NULL,
	"follow_date" timestamp DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "featured_athletes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"cover_image" text,
	"featured_video" text,
	"highlight_text" text NOT NULL,
	"sport_position" text,
	"star_rating" integer NOT NULL,
	"featured_stats" json,
	"featured_date" timestamp DEFAULT now(),
	"order" integer DEFAULT 0,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "film_comparisons" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"is_public" boolean DEFAULT false,
	"comparison_type" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"tags" text[]
);
--> statement-breakpoint
CREATE TABLE "gar_athlete_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"video_analysis_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"subcategory_id" integer,
	"score" integer NOT NULL,
	"percentile_rank" integer,
	"previous_score" integer,
	"score_date" timestamp DEFAULT now(),
	"notes" text,
	"confidence" integer DEFAULT 90
);
--> statement-breakpoint
CREATE TABLE "gar_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"sport_type" text NOT NULL,
	"position_type" text,
	"display_order" integer DEFAULT 0,
	"icon" text,
	"color" text,
	"created_at" timestamp DEFAULT now(),
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "gar_rating_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"video_analysis_id" integer,
	"total_gar_score" integer NOT NULL,
	"category_scores" json NOT NULL,
	"calculated_date" timestamp DEFAULT now(),
	"star_rating" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gar_subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"display_order" integer DEFAULT 0,
	"icon" text,
	"color" text,
	"max_score" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now(),
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "grade_scales" (
	"id" serial PRIMARY KEY NOT NULL,
	"country" text NOT NULL,
	"education_system" text NOT NULL,
	"original_scale" json NOT NULL,
	"us_equivalent_scale" json NOT NULL,
	"conversion_formula" text,
	"notes" text,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "highlight_generator_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true,
	"sport_type" text NOT NULL,
	"highlight_types" text[],
	"min_duration" integer DEFAULT 8,
	"max_duration" integer DEFAULT 30,
	"max_highlights_per_video" integer DEFAULT 3,
	"quality_threshold" integer DEFAULT 70,
	"detectable_events" json,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"last_run" timestamp,
	"use_thumbnail_frame" text DEFAULT 'best',
	"add_text_overlay" boolean DEFAULT true,
	"add_music_track" boolean DEFAULT false,
	"music_category" text DEFAULT 'highEnergy'
);
--> statement-breakpoint
CREATE TABLE "journey_milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"journey_map_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_date" timestamp,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"type" text NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"category" text NOT NULL,
	"rank_position" integer NOT NULL,
	"score" integer NOT NULL,
	"city" text,
	"state" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "media_partner_discoveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"scout_id" integer,
	"name" text NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"follower_count" integer,
	"audience_type" text,
	"average_engagement" real,
	"sports" text[],
	"location" text,
	"recent_topics" text[],
	"content_quality" integer DEFAULT 0,
	"relevance_score" integer DEFAULT 0,
	"partnership_potential" integer DEFAULT 0,
	"discovered_at" timestamp DEFAULT now(),
	"last_checked_at" timestamp DEFAULT now(),
	"status" text DEFAULT 'new',
	"assigned_to" integer,
	"notes" text,
	"partnership_terms" text,
	"partnership_start_date" timestamp,
	"partnership_end_date" timestamp,
	"partnership_results" json
);
--> statement-breakpoint
CREATE TABLE "media_partnership_scouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"active" boolean DEFAULT true,
	"last_run_at" timestamp,
	"sport_focus" text[],
	"media_types" text[],
	"follower_threshold" integer DEFAULT 10000,
	"location_focus" text[],
	"keywords_to_track" text[],
	"exclusion_terms" text[],
	"created_at" timestamp DEFAULT now(),
	"created_by" integer,
	"discovery_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"content" text NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"read" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "music_artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"artist_username" text NOT NULL,
	"email" text NOT NULL,
	"bio" text,
	"profile_image" text,
	"cover_image" text,
	"social_links" jsonb,
	"genres" text[],
	"verified_artist" boolean DEFAULT false,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"active" boolean DEFAULT true,
	CONSTRAINT "music_artists_artist_username_unique" UNIQUE("artist_username")
);
--> statement-breakpoint
CREATE TABLE "music_listening_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"track_id" integer NOT NULL,
	"played_at" timestamp DEFAULT now(),
	"play_duration" integer,
	"completed_play" boolean DEFAULT false,
	"context_type" text,
	"context_id" integer
);
--> statement-breakpoint
CREATE TABLE "music_playlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"creator_id" integer NOT NULL,
	"cover_image" text,
	"is_public" boolean DEFAULT true,
	"categories" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"likes" integer DEFAULT 0,
	"followers" integer DEFAULT 0,
	"sport_association" text[],
	"training_phase" text[],
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "music_tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist_id" integer NOT NULL,
	"file_path" text NOT NULL,
	"cover_art" text,
	"duration" integer NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"release_date" date,
	"genres" text[],
	"tags" text[],
	"is_explicit" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"featured_artists" text[],
	"description" text,
	"lyrics" text,
	"plays" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"bpm" integer,
	"mood" text[],
	"sport_match_categories" text[],
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "music_user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"favorite_genres" text[],
	"favorite_moods" text[],
	"favorite_artists" integer[],
	"favorite_tracks" integer[],
	"disliked_tracks" integer[],
	"explicit_content_allowed" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "music_user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "ncaa_core_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"eligibility_id" integer NOT NULL,
	"course_name" text NOT NULL,
	"course_type" text NOT NULL,
	"grade_earned" text,
	"original_grade" text,
	"translated_grade" text,
	"grade_points" real,
	"credit_hours" real NOT NULL,
	"quality_points" real,
	"completed" boolean DEFAULT false,
	"in_progress" boolean DEFAULT false,
	"ncaa_approved" boolean DEFAULT false,
	"verification_status" text DEFAULT 'pending',
	"completion_date" date,
	"year_taken" integer,
	"semester_taken" text,
	"school" text,
	"country" text,
	"is_international_course" boolean DEFAULT false,
	"translation_method" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "ncaa_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"eligibility_id" integer NOT NULL,
	"document_type" text NOT NULL,
	"file_path" text NOT NULL,
	"file_name" text NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"verification_status" text DEFAULT 'pending',
	"verification_notes" text,
	"verified_by" integer,
	"verification_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "ncaa_eligibility" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"core_courses_completed" integer DEFAULT 0,
	"core_courses_required" integer DEFAULT 16,
	"gpa" real,
	"gpa_meets_requirement" boolean DEFAULT false,
	"sat_score" integer,
	"act_score" integer,
	"test_scores_meet_requirement" boolean DEFAULT false,
	"minimum_required_test_score" integer,
	"is_international_student" boolean DEFAULT false,
	"country_of_education" text,
	"diploma_type" text,
	"international_grade_scale" text,
	"has_translated_documents" boolean DEFAULT false,
	"amateurism_status" text DEFAULT 'incomplete',
	"ncaa_division" text DEFAULT 'division_i',
	"overall_eligibility_status" text DEFAULT 'incomplete',
	"academic_redshirt" boolean DEFAULT false,
	"qualification_percentage" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ncaa_registration" (
	"id" serial PRIMARY KEY NOT NULL,
	"eligibility_id" integer NOT NULL,
	"ncaa_id" text,
	"registration_date" timestamp,
	"registration_status" text DEFAULT 'not_started',
	"academic_status" text,
	"amateurism_certified" boolean DEFAULT false,
	"division_level" text,
	"final_certification_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "ncaa_sliding_scales" (
	"id" serial PRIMARY KEY NOT NULL,
	"effective_date" date NOT NULL,
	"division" text NOT NULL,
	"core_gpa" real NOT NULL,
	"min_sat_score" integer,
	"min_act_score" integer,
	"full_qualifier_status" boolean DEFAULT true,
	"academic_redshirt_status" boolean DEFAULT false,
	"notes" text,
	"is_current_scale" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "ncaa_team_rosters" (
	"id" serial PRIMARY KEY NOT NULL,
	"school" text NOT NULL,
	"mascot" text,
	"conference" text NOT NULL,
	"division" text NOT NULL,
	"sport" text NOT NULL,
	"season" text NOT NULL,
	"roster_count" integer,
	"scholarship_count" integer,
	"scholarship_limit" integer,
	"roster_position_counts" json,
	"roster_status" text,
	"last_updated" timestamp DEFAULT now(),
	"logo_url" text,
	"team_url" text,
	"coaching_staff" json,
	"position_needs" json,
	"transfers_in" integer DEFAULT 0,
	"transfers_out" integer DEFAULT 0,
	"recent_roster_changes" json,
	"academic_requirements" json,
	"priority_recruiting_areas" text[]
);
--> statement-breakpoint
CREATE TABLE "onboarding_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"current_step" integer DEFAULT 1 NOT NULL,
	"total_steps" integer DEFAULT 5 NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"completed_sections" text[],
	"skipped_sections" text[],
	CONSTRAINT "onboarding_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"registration_id" integer,
	"amount" numeric NOT NULL,
	"external_id" text,
	"status" text NOT NULL,
	"processed_at" timestamp DEFAULT now(),
	"refunded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "player_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"badge_id" text NOT NULL,
	"badge_name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"tier" text DEFAULT 'bronze' NOT NULL,
	"is_active" boolean DEFAULT true,
	"icon_path" text NOT NULL,
	"earned_at" timestamp DEFAULT now(),
	"progress" integer DEFAULT 100
);
--> statement-breakpoint
CREATE TABLE "player_equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"equipment_id" integer NOT NULL,
	"acquired_date" timestamp DEFAULT now(),
	"level" integer DEFAULT 1 NOT NULL,
	"times_used" integer DEFAULT 0,
	"last_used" timestamp,
	"is_favorite" boolean DEFAULT false,
	"custom_name" text,
	"usage_streak" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "player_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"current_level" integer DEFAULT 1 NOT NULL,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"level_xp" integer DEFAULT 0 NOT NULL,
	"xp_to_next_level" integer DEFAULT 100 NOT NULL,
	"rank" text DEFAULT 'Rookie' NOT NULL,
	"lifetime_achievements" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"last_active" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playlist_tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"playlist_id" integer NOT NULL,
	"track_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now(),
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "podcast_collaboration_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"show_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"request_note" text,
	"response_note" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"proposed_date" timestamp,
	"proposed_topic" text
);
--> statement-breakpoint
CREATE TABLE "podcast_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"episode_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"timestamp" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"parent_comment_id" integer,
	"likes" integer DEFAULT 0,
	"is_edited" boolean DEFAULT false,
	"is_removed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "podcast_episode_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"episode_id" integer NOT NULL,
	"topic_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "podcast_episodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"show_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"audio_file_path" text NOT NULL,
	"duration" integer NOT NULL,
	"publish_date" timestamp DEFAULT now(),
	"episode_number" integer,
	"season_number" integer DEFAULT 1,
	"cover_image" text,
	"is_explicit" boolean DEFAULT false,
	"listen_count" integer DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"show_notes" text,
	"highlights" jsonb,
	"transcript_path" text,
	"is_highlight_episode" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "podcast_guests" (
	"id" serial PRIMARY KEY NOT NULL,
	"episode_id" integer NOT NULL,
	"guest_name" text NOT NULL,
	"user_id" integer,
	"bio" text,
	"title" text,
	"instagram_handle" text,
	"twitter_handle" text,
	"website_url" text,
	"image_url" text,
	"topic_discussed" text,
	"appearance_start_time" integer
);
--> statement-breakpoint
CREATE TABLE "podcast_hosts" (
	"id" serial PRIMARY KEY NOT NULL,
	"show_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" text DEFAULT 'host',
	"bio" text,
	"joined_at" timestamp DEFAULT now(),
	"left_at" timestamp,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "podcast_listening_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"episode_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"last_position" integer DEFAULT 0,
	"completed" boolean DEFAULT false,
	"listen_date" timestamp DEFAULT now(),
	"device" text,
	"listen_duration" integer
);
--> statement-breakpoint
CREATE TABLE "podcast_shows" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"cover_image" text,
	"creator_id" integer NOT NULL,
	"is_group_show" boolean DEFAULT false,
	"categories" text[],
	"tags" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"is_explicit" boolean DEFAULT false,
	"rss_feed_url" text,
	"website_url" text,
	"sport_categories" text[],
	"show_format" text,
	"episode_frequency" text,
	"subscriber_count" integer DEFAULT 0,
	"total_listens" integer DEFAULT 0,
	"featured_position" integer
);
--> statement-breakpoint
CREATE TABLE "podcast_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"show_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"subscribed_at" timestamp DEFAULT now(),
	"notifications_enabled" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "podcast_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon_name" text,
	"category" text,
	"popular" boolean DEFAULT false,
	CONSTRAINT "podcast_topics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "recovery_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"log_date" date DEFAULT now() NOT NULL,
	"sleep_hours" real,
	"soreness_level" integer,
	"energy_level" integer,
	"hydration_level" integer,
	"notes" text,
	"overall_recovery_score" integer
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_id" integer,
	"status" text DEFAULT 'pending',
	"external_id" text,
	"registered_at" timestamp DEFAULT now(),
	"payment_status" text DEFAULT 'unpaid',
	"notes" text,
	"check_in_time" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "site_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"alt" text NOT NULL,
	"location" text NOT NULL,
	"active" boolean DEFAULT true,
	"upload_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"skill_name" text NOT NULL,
	"skill_category" text NOT NULL,
	"skill_level" integer DEFAULT 0 NOT NULL,
	"xp_points" integer DEFAULT 0 NOT NULL,
	"next_level_xp" integer DEFAULT 100 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_media_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"audit_date" timestamp DEFAULT now(),
	"overall_score" integer NOT NULL,
	"platforms_analyzed" text[],
	"content_analysis" json,
	"red_flag_count" integer DEFAULT 0,
	"red_flag_items" json,
	"improvement_suggestions" text[],
	"positive_highlights" json,
	"recruitment_impact_score" integer,
	"report_generated_by" integer,
	"shared_with_user" boolean DEFAULT false,
	"user_acknowledged" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "social_media_scouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"active" boolean DEFAULT true,
	"last_run_at" timestamp,
	"sport_focus" text[],
	"age_range_min" integer DEFAULT 12,
	"age_range_max" integer DEFAULT 18,
	"location_focus" text[],
	"keywords_to_track" text[],
	"platforms_to_search" text[],
	"created_at" timestamp DEFAULT now(),
	"created_by" integer,
	"discovery_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "sport_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"sport" text NOT NULL,
	"match_percentage" integer NOT NULL,
	"position_recommendation" text,
	"potential_level" text,
	"reason_for_match" text,
	"recommendation_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "spotlight_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"story" text NOT NULL,
	"cover_image" text NOT NULL,
	"media_gallery" text[],
	"spotlight_date" timestamp DEFAULT now(),
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'pending' NOT NULL,
	"approved_by" integer,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"is_trending" boolean DEFAULT false,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transfer_portal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_name" text NOT NULL,
	"previous_school" text NOT NULL,
	"sport" text NOT NULL,
	"position" text NOT NULL,
	"eligibility_remaining" text,
	"height" text,
	"weight" text,
	"hometown" text,
	"high_school" text,
	"star_rating" integer,
	"portal_entry_date" timestamp NOT NULL,
	"last_season_stats" json,
	"career_stats" json,
	"academic_info" json,
	"injury_history" json,
	"video_highlights" text[],
	"portal_status" text DEFAULT 'active',
	"committed_to" text,
	"commit_date" timestamp,
	"best_fit_schools" text[],
	"fit_reasons" json,
	"transfer_rating" integer,
	"notes" text,
	"social_media_handles" json,
	"contact_info" json,
	"agent_name" text,
	"portal_deadline" timestamp,
	"nil_deals" json,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transfer_portal_monitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"active" boolean DEFAULT true,
	"sport_type" text NOT NULL,
	"divisions" text[],
	"conferences" text[],
	"monitor_type" text NOT NULL,
	"update_frequency" integer DEFAULT 360,
	"last_run_at" timestamp,
	"alert_threshold" integer DEFAULT 3,
	"notify_coaches" boolean DEFAULT true,
	"position_groups" text[],
	"created_at" timestamp DEFAULT now(),
	"created_by" integer,
	"transfer_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_agreements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"agreement_type" text NOT NULL,
	"version" text NOT NULL,
	"accepted_at" timestamp DEFAULT now(),
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'athlete' NOT NULL,
	"profile_image" text,
	"bio" text,
	"phone_number" text,
	"created_at" timestamp DEFAULT now(),
	"measurement_system" text DEFAULT 'metric',
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "video_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" integer NOT NULL,
	"analysis_date" timestamp DEFAULT now(),
	"motion_data" json NOT NULL,
	"overall_score" integer NOT NULL,
	"feedback" text NOT NULL,
	"improvement_tips" text[],
	"key_frame_timestamps" real[],
	"gar_scores" json
);
--> statement-breakpoint
CREATE TABLE "video_highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" real NOT NULL,
	"end_time" real NOT NULL,
	"highlight_path" text NOT NULL,
	"thumbnail_path" text,
	"created_at" timestamp DEFAULT now(),
	"created_by" integer NOT NULL,
	"ai_generated" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"tags" text[],
	"home_page_eligible" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"likes_count" integer DEFAULT 0,
	"quality_score" integer DEFAULT 0,
	"primary_skill" text,
	"skill_level" integer DEFAULT 0,
	"game_context" text,
	"ai_analysis_notes" text
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_path" text NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"analyzed" boolean DEFAULT false,
	"sport_type" text,
	"thumbnail_path" text
);
--> statement-breakpoint
CREATE TABLE "weight_room_equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"equipment_type" text NOT NULL,
	"difficulty_level" text NOT NULL,
	"target_muscles" text[],
	"base_xp" integer NOT NULL,
	"icon_path" text NOT NULL,
	"model_path" text,
	"price" integer DEFAULT 0 NOT NULL,
	"unlock_level" integer DEFAULT 1 NOT NULL,
	"is_premium" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"playlist_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sets" integer,
	"reps" integer,
	"duration" integer,
	"rest_period" integer,
	"order" integer NOT NULL,
	"video_url" text,
	"image_url" text,
	"notes" text,
	"equipment_needed" text[]
);
--> statement-breakpoint
CREATE TABLE "workout_playlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"workout_type" text NOT NULL,
	"intensity_level" text NOT NULL,
	"duration" integer NOT NULL,
	"targets" text[],
	"created_at" timestamp DEFAULT now(),
	"last_used" timestamp,
	"times_used" integer DEFAULT 0,
	"is_custom" boolean DEFAULT true,
	"is_public" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "workout_verification_checkpoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"verification_id" integer NOT NULL,
	"exercise_name" text NOT NULL,
	"is_completed" boolean DEFAULT false,
	"completed_amount" integer,
	"target_amount" integer,
	"feedback" text,
	"media_proof" text,
	"checkpoint_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"workout_id" integer,
	"title" text NOT NULL,
	"submission_date" timestamp DEFAULT now(),
	"verification_status" text DEFAULT 'pending' NOT NULL,
	"verified_by" integer,
	"verification_date" timestamp,
	"verification_method" text,
	"proof_type" text,
	"proof_data" text,
	"notes" text,
	"xp_earned" integer DEFAULT 0,
	"duration" integer,
	"recovery_impact" integer
);
--> statement-breakpoint
CREATE TABLE "xp_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"transaction_type" text NOT NULL,
	"source_id" text,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"multiplier" real DEFAULT 1
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_nil_deals" ADD CONSTRAINT "artist_nil_deals_artist_id_music_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."music_artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_nil_deals" ADD CONSTRAINT "artist_nil_deals_athlete_id_users_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_challenges" ADD CONSTRAINT "athlete_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_challenges" ADD CONSTRAINT "athlete_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_discoveries" ADD CONSTRAINT "athlete_discoveries_scout_id_social_media_scouts_id_fk" FOREIGN KEY ("scout_id") REFERENCES "public"."social_media_scouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_discoveries" ADD CONSTRAINT "athlete_discoveries_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_discoveries" ADD CONSTRAINT "athlete_discoveries_converted_to_user_id_users_id_fk" FOREIGN KEY ("converted_to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_journey_map" ADD CONSTRAINT "athlete_journey_map_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_profiles" ADD CONSTRAINT "athlete_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_star_profiles" ADD CONSTRAINT "athlete_star_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_influencer_discoveries" ADD CONSTRAINT "city_influencer_discoveries_scout_id_city_influencer_scouts_id_fk" FOREIGN KEY ("scout_id") REFERENCES "public"."city_influencer_scouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_influencer_discoveries" ADD CONSTRAINT "city_influencer_discoveries_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_influencer_scouts" ADD CONSTRAINT "city_influencer_scouts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_connections" ADD CONSTRAINT "coach_connections_coach_id_users_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_connections" ADD CONSTRAINT "coach_connections_athlete_id_users_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_profiles" ADD CONSTRAINT "coach_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_recruiting_boards" ADD CONSTRAINT "coach_recruiting_boards_coach_id_users_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_recruiting_boards" ADD CONSTRAINT "coach_recruiting_boards_transfer_id_transfer_portal_entries_id_fk" FOREIGN KEY ("transfer_id") REFERENCES "public"."transfer_portal_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparison_analyses" ADD CONSTRAINT "comparison_analyses_comparison_id_film_comparisons_id_fk" FOREIGN KEY ("comparison_id") REFERENCES "public"."film_comparisons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparison_videos" ADD CONSTRAINT "comparison_videos_comparison_id_film_comparisons_id_fk" FOREIGN KEY ("comparison_id") REFERENCES "public"."film_comparisons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comparison_videos" ADD CONSTRAINT "comparison_videos_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_last_updated_by_users_id_fk" FOREIGN KEY ("last_updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fan_club_followers" ADD CONSTRAINT "fan_club_followers_athlete_id_users_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_athletes" ADD CONSTRAINT "featured_athletes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "featured_athletes" ADD CONSTRAINT "featured_athletes_featured_video_videos_id_fk" FOREIGN KEY ("featured_video") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "film_comparisons" ADD CONSTRAINT "film_comparisons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gar_athlete_ratings" ADD CONSTRAINT "gar_athlete_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gar_athlete_ratings" ADD CONSTRAINT "gar_athlete_ratings_video_analysis_id_video_analyses_id_fk" FOREIGN KEY ("video_analysis_id") REFERENCES "public"."video_analyses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gar_athlete_ratings" ADD CONSTRAINT "gar_athlete_ratings_category_id_gar_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gar_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gar_athlete_ratings" ADD CONSTRAINT "gar_athlete_ratings_subcategory_id_gar_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."gar_subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gar_rating_history" ADD CONSTRAINT "gar_rating_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gar_rating_history" ADD CONSTRAINT "gar_rating_history_video_analysis_id_video_analyses_id_fk" FOREIGN KEY ("video_analysis_id") REFERENCES "public"."video_analyses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gar_subcategories" ADD CONSTRAINT "gar_subcategories_category_id_gar_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gar_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highlight_generator_configs" ADD CONSTRAINT "highlight_generator_configs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_milestones" ADD CONSTRAINT "journey_milestones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_milestones" ADD CONSTRAINT "journey_milestones_journey_map_id_athlete_journey_map_id_fk" FOREIGN KEY ("journey_map_id") REFERENCES "public"."athlete_journey_map"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_partner_discoveries" ADD CONSTRAINT "media_partner_discoveries_scout_id_media_partnership_scouts_id_fk" FOREIGN KEY ("scout_id") REFERENCES "public"."media_partnership_scouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_partner_discoveries" ADD CONSTRAINT "media_partner_discoveries_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_partnership_scouts" ADD CONSTRAINT "media_partnership_scouts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_artists" ADD CONSTRAINT "music_artists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_listening_history" ADD CONSTRAINT "music_listening_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_listening_history" ADD CONSTRAINT "music_listening_history_track_id_music_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."music_tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_playlists" ADD CONSTRAINT "music_playlists_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_artist_id_music_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."music_artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_user_preferences" ADD CONSTRAINT "music_user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ncaa_core_courses" ADD CONSTRAINT "ncaa_core_courses_eligibility_id_ncaa_eligibility_id_fk" FOREIGN KEY ("eligibility_id") REFERENCES "public"."ncaa_eligibility"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ncaa_documents" ADD CONSTRAINT "ncaa_documents_eligibility_id_ncaa_eligibility_id_fk" FOREIGN KEY ("eligibility_id") REFERENCES "public"."ncaa_eligibility"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ncaa_documents" ADD CONSTRAINT "ncaa_documents_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ncaa_eligibility" ADD CONSTRAINT "ncaa_eligibility_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ncaa_registration" ADD CONSTRAINT "ncaa_registration_eligibility_id_ncaa_eligibility_id_fk" FOREIGN KEY ("eligibility_id") REFERENCES "public"."ncaa_eligibility"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_progress" ADD CONSTRAINT "onboarding_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_badges" ADD CONSTRAINT "player_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_equipment" ADD CONSTRAINT "player_equipment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_equipment" ADD CONSTRAINT "player_equipment_equipment_id_weight_room_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."weight_room_equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_progress" ADD CONSTRAINT "player_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlist_id_music_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."music_playlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_track_id_music_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."music_tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_collaboration_requests" ADD CONSTRAINT "podcast_collaboration_requests_show_id_podcast_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."podcast_shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_collaboration_requests" ADD CONSTRAINT "podcast_collaboration_requests_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_collaboration_requests" ADD CONSTRAINT "podcast_collaboration_requests_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_comments" ADD CONSTRAINT "podcast_comments_episode_id_podcast_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."podcast_episodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_comments" ADD CONSTRAINT "podcast_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_comments" ADD CONSTRAINT "podcast_comments_parent_comment_id_podcast_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."podcast_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_episode_topics" ADD CONSTRAINT "podcast_episode_topics_episode_id_podcast_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."podcast_episodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_episode_topics" ADD CONSTRAINT "podcast_episode_topics_topic_id_podcast_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."podcast_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_episodes" ADD CONSTRAINT "podcast_episodes_show_id_podcast_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."podcast_shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_guests" ADD CONSTRAINT "podcast_guests_episode_id_podcast_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."podcast_episodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_guests" ADD CONSTRAINT "podcast_guests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_hosts" ADD CONSTRAINT "podcast_hosts_show_id_podcast_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."podcast_shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_hosts" ADD CONSTRAINT "podcast_hosts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_listening_history" ADD CONSTRAINT "podcast_listening_history_episode_id_podcast_episodes_id_fk" FOREIGN KEY ("episode_id") REFERENCES "public"."podcast_episodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_listening_history" ADD CONSTRAINT "podcast_listening_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_shows" ADD CONSTRAINT "podcast_shows_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_subscriptions" ADD CONSTRAINT "podcast_subscriptions_show_id_podcast_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."podcast_shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "podcast_subscriptions" ADD CONSTRAINT "podcast_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_logs" ADD CONSTRAINT "recovery_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_combine_tour_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."combine_tour_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_audits" ADD CONSTRAINT "social_media_audits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_audits" ADD CONSTRAINT "social_media_audits_report_generated_by_users_id_fk" FOREIGN KEY ("report_generated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_scouts" ADD CONSTRAINT "social_media_scouts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sport_recommendations" ADD CONSTRAINT "sport_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spotlight_profiles" ADD CONSTRAINT "spotlight_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spotlight_profiles" ADD CONSTRAINT "spotlight_profiles_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_portal_monitors" ADD CONSTRAINT "transfer_portal_monitors_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_agreements" ADD CONSTRAINT "user_agreements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_analyses" ADD CONSTRAINT "video_analyses_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_highlights" ADD CONSTRAINT "video_highlights_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_highlights" ADD CONSTRAINT "video_highlights_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_playlist_id_workout_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."workout_playlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_playlists" ADD CONSTRAINT "workout_playlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_verification_checkpoints" ADD CONSTRAINT "workout_verification_checkpoints_verification_id_workout_verifications_id_fk" FOREIGN KEY ("verification_id") REFERENCES "public"."workout_verifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_verifications" ADD CONSTRAINT "workout_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_verifications" ADD CONSTRAINT "workout_verifications_workout_id_workout_playlists_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workout_playlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout_verifications" ADD CONSTRAINT "workout_verifications_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;