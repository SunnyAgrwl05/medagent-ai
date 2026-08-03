-- ─── Seed: demo activity_log rows ────────────────────────────────────
-- Run after supabase/schema.sql. Replace the user_id below with a real
-- Clerk user id (e.g. from `user_3HLsxbwu2062M0HhHYGp3HTJUwo`).
-- Sample relative timestamps keep the feed looking realistic.

insert into activity_log (user_id, agent, title, description, urgency, created_at) values
  ('user_3HLsxbwu2062M0HhHYGp3HTJUwo', 'symptom', 'Headache & mild fever check-in', 'Assessed as low urgency — advised rest and monitoring.', 'low', now() - interval '40 minutes'),
  ('user_3HLsxbwu2062M0HhHYGp3HTJUwo', 'report', 'CBC blood panel analyzed', '2 values flagged slightly outside reference range.', null, now() - interval '5 hours'),
  ('user_3HLsxbwu2062M0HhHYGp3HTJUwo', 'medicine', 'Identified Azithromycin 500mg', 'Explained dosage schedule and food interaction notes.', null, now() - interval '26 hours'),
  ('user_3HLsxbwu2062M0HhHYGp3HTJUwo', 'voice', 'Voice consult — sore throat', '3 minute conversation, recommended warm saline gargle.', 'low', now() - interval '48 hours');
