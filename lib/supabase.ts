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
 * ─── Database schema ──────────────────────────────────────────────────
 * Run supabase/schema.sql in the Supabase SQL editor to create the tables,
 * RLS, and example policy below.
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
