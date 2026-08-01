import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Client for use in the browser / client components. Respects RLS. */
export function createBrowserSupabase(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Admin client for server-only use (API routes). Bypasses RLS — never
 * import this into a client component.
 */
export function createServerSupabase(): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * ─── Database schema (run in Supabase SQL editor) ──────────────────────
 *
 * create table conversations (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id text not null,
 *   agent text not null,
 *   title text not null default 'New conversation',
 *   created_at timestamptz not null default now(),
 *   updated_at timestamptz not null default now()
 * );
 *
 * create table messages (
 *   id uuid primary key default gen_random_uuid(),
 *   conversation_id uuid references conversations(id) on delete cascade,
 *   user_id text not null,
 *   role text not null check (role in ('user','assistant','system')),
 *   content text not null,
 *   agent text,
 *   urgency text,
 *   attachments jsonb default '[]'::jsonb,
 *   created_at timestamptz not null default now()
 * );
 *
 * create table activity_log (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id text not null,
 *   agent text not null,
 *   title text not null,
 *   description text not null,
 *   urgency text,
 *   created_at timestamptz not null default now()
 * );
 *
 * create table health_stats (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id text not null,
 *   label text not null,
 *   value text not null,
 *   recorded_at timestamptz not null default now()
 * );
 *
 * alter table conversations enable row level security;
 * alter table messages enable row level security;
 * alter table activity_log enable row level security;
 * alter table health_stats enable row level security;
 *
 * -- Example RLS policy (adapt user_id matching to your Clerk JWT claim):
 * create policy "Users manage their own conversations"
 *   on conversations for all
 *   using (user_id = auth.jwt() ->> 'sub');
 */

export interface DbConversation {
  id: string;
  user_id: string;
  agent: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  agent: string | null;
  urgency: string | null;
  attachments: unknown[];
  created_at: string;
}

export interface DbActivity {
  id: string;
  user_id: string;
  agent: string;
  title: string;
  description: string;
  urgency: string | null;
  created_at: string;
}
