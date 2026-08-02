create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  agent text not null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  user_id text not null,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  agent text,
  urgency text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  agent text not null,
  title text not null,
  description text not null,
  urgency text,
  created_at timestamptz not null default now()
);

create table health_stats (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  label text not null,
  value text not null,
  recorded_at timestamptz not null default now()
);

alter table conversations enable row level security;
alter table messages enable row level security;
alter table activity_log enable row level security;
alter table health_stats enable row level security;

-- Example RLS policy (adapt user_id matching to your Clerk JWT claim):
create policy "Users manage their own conversations"
  on conversations for all
  using (user_id = auth.jwt() ->> 'sub');
