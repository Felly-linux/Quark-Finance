-- ─────────────────────────────────────────────────────────────
-- Quark Finance · Supabase Schema
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- Extensions
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────────────────────
create table profiles (
  id            uuid primary key references auth.users on delete cascade,
  display_name  text,
  avatar_url    text,
  currency      text not null default 'USD',
  level         int  not null default 1,
  xp            int  not null default 0,
  monthly_income numeric(12,2),
  monthly_expenses numeric(12,2),
  stress_index  numeric(4,2),        -- 0–10, AI-computed
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "own profile" on profiles for all using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- ACCOUNTS (wallets / bank connections)
-- ─────────────────────────────────────────────────────────────
create table accounts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles on delete cascade,
  name          text not null,
  institution   text,
  type          text not null check (type in ('checking','savings','credit','investment','crypto','loan','other')),
  balance       numeric(14,2) not null default 0,
  currency      text not null default 'USD',
  color         text,
  icon          text,
  is_active     boolean not null default true,
  last_synced   timestamptz,
  created_at    timestamptz not null default now()
);
alter table accounts enable row level security;
create policy "own accounts" on accounts for all using (auth.uid() = user_id);
create index on accounts (user_id);

-- ─────────────────────────────────────────────────────────────
-- TRANSACTIONS
-- ─────────────────────────────────────────────────────────────
create table transactions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles on delete cascade,
  account_id      uuid references accounts on delete set null,
  date            date not null,
  amount          numeric(12,2) not null,   -- negative = expense, positive = income
  currency        text not null default 'USD',
  merchant        text,
  merchant_category text,                   -- FOOD, TRANSPORT, SUBSCRIPTION, etc.
  description     text,
  notes           text,
  tags            text[],
  is_recurring    boolean not null default false,
  created_at      timestamptz not null default now()
);
alter table transactions enable row level security;
create policy "own transactions" on transactions for all using (auth.uid() = user_id);
create index on transactions (user_id, date desc);
create index on transactions (user_id, merchant_category);

-- ─────────────────────────────────────────────────────────────
-- SUBSCRIPTIONS (tracked recurring charges)
-- ─────────────────────────────────────────────────────────────
create table subscriptions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles on delete cascade,
  name          text not null,
  amount        numeric(10,2) not null,
  billing_cycle text not null check (billing_cycle in ('weekly','monthly','quarterly','yearly')),
  category      text,
  last_billed   date,
  next_billed   date,
  is_active     boolean not null default true,
  is_zombie     boolean not null default false, -- unused 60d+
  last_used     date,
  created_at    timestamptz not null default now()
);
alter table subscriptions enable row level security;
create policy "own subscriptions" on subscriptions for all using (auth.uid() = user_id);
create index on subscriptions (user_id);

-- ─────────────────────────────────────────────────────────────
-- GOALS (financial targets)
-- ─────────────────────────────────────────────────────────────
create table goals (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles on delete cascade,
  name            text not null,
  target_amount   numeric(14,2) not null,
  current_amount  numeric(14,2) not null default 0,
  target_date     date,
  monthly_saving  numeric(10,2),
  icon            text,
  color           text,
  is_completed    boolean not null default false,
  created_at      timestamptz not null default now()
);
alter table goals enable row level security;
create policy "own goals" on goals for all using (auth.uid() = user_id);
create index on goals (user_id);

-- ─────────────────────────────────────────────────────────────
-- MISSIONS (gamified financial tasks)
-- ─────────────────────────────────────────────────────────────
create table missions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles on delete cascade,
  title       text not null,
  description text,
  subtitle    text,
  tier        text not null check (tier in ('CRITICAL','COMPOUND','HABIT','GROWTH','LEGENDARY','CLEANUP','COMPLETED')),
  rank        text not null check (rank in ('S','A','B','C')),
  xp          int  not null default 0,
  progress    numeric(4,3) not null default 0 check (progress between 0 and 1),
  days_left   int,
  color       text,
  is_ai_generated boolean not null default false,
  completed_at timestamptz,
  created_at  timestamptz not null default now()
);
alter table missions enable row level security;
create policy "own missions" on missions for all using (auth.uid() = user_id);
create index on missions (user_id);

create table mission_steps (
  id          uuid primary key default uuid_generate_v4(),
  mission_id  uuid not null references missions on delete cascade,
  text        text not null,
  is_done     boolean not null default false,
  position    int  not null default 0,
  done_at     timestamptz
);
alter table mission_steps enable row level security;
create policy "own mission steps" on mission_steps for all
  using (exists (select 1 from missions where id = mission_id and user_id = auth.uid()));
create index on mission_steps (mission_id);

-- ─────────────────────────────────────────────────────────────
-- NET WORTH SNAPSHOTS (time-series for dashboard chart)
-- ─────────────────────────────────────────────────────────────
create table net_worth_snapshots (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles on delete cascade,
  date        date not null,
  net_worth   numeric(14,2) not null,
  assets      numeric(14,2),
  liabilities numeric(14,2),
  created_at  timestamptz not null default now(),
  unique (user_id, date)
);
alter table net_worth_snapshots enable row level security;
create policy "own snapshots" on net_worth_snapshots for all using (auth.uid() = user_id);
create index on net_worth_snapshots (user_id, date desc);

-- ─────────────────────────────────────────────────────────────
-- INSIGHTS (AI-synthesized correlations)
-- ─────────────────────────────────────────────────────────────
create table insights (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles on delete cascade,
  node_a          text not null,
  node_b          text not null,
  correlation     numeric(4,3),           -- r value
  direction       text,                   -- '↑' causal, etc.
  category        text,                   -- RISK, SPEND, GOALS, INCOME
  tone            text,
  explanation     text,
  is_active       boolean not null default true,
  generated_at    timestamptz not null default now()
);
alter table insights enable row level security;
create policy "own insights" on insights for all using (auth.uid() = user_id);
create index on insights (user_id, category);

-- ─────────────────────────────────────────────────────────────
-- COPILOT THREADS + MESSAGES (chat history)
-- ─────────────────────────────────────────────────────────────
create table copilot_threads (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles on delete cascade,
  title       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table copilot_threads enable row level security;
create policy "own threads" on copilot_threads for all using (auth.uid() = user_id);

create table copilot_messages (
  id          uuid primary key default uuid_generate_v4(),
  thread_id   uuid not null references copilot_threads on delete cascade,
  role        text not null check (role in ('user','assistant')),
  content     text not null,
  reasoning   text,                        -- internal AI reasoning block
  model       text,
  latency_ms  int,
  created_at  timestamptz not null default now()
);
alter table copilot_messages enable row level security;
create policy "own messages" on copilot_messages for all
  using (exists (select 1 from copilot_threads where id = thread_id and user_id = auth.uid()));
create index on copilot_messages (thread_id, created_at);

-- ─────────────────────────────────────────────────────────────
-- ALERT RULES
-- ─────────────────────────────────────────────────────────────
create table alert_rules (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles on delete cascade,
  name          text not null,
  metric        text not null,             -- e.g. 'food_spend', 'stress_index'
  operator      text not null check (operator in ('>','<','>=','<=','=')),
  threshold     numeric(14,2) not null,
  channel       text not null default 'in_app',  -- in_app, email, push
  is_active     boolean not null default true,
  last_fired    timestamptz,
  created_at    timestamptz not null default now()
);
alter table alert_rules enable row level security;
create policy "own alerts" on alert_rules for all using (auth.uid() = user_id);
create index on alert_rules (user_id);
