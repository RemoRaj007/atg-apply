-- ATG Apply — Full Database Schema
-- Run in Supabase SQL editor (project: xjezpwtjjuzixszmfrln)
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS throughout.
-- =====================================================================

-- ── Extensions ────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;   -- for fast text search on names/titles

-- =====================================================================
-- 1. PACKAGES  (pricing tiers)
-- =====================================================================
create table if not exists public.packages (
  name        text primary key,           -- Trial | Starter | Professional | Premium
  apps        int  not null,
  price_usd   int  not null default 0,
  description text,
  features    text[],                     -- bullet list for pricing page
  highlight   boolean not null default false,
  cta_label   text,
  created_at  timestamptz not null default now()
);

comment on table public.packages is 'Service pricing tiers available to customers.';

-- =====================================================================
-- 2. STAFF  (ATG team members)
-- =====================================================================
create table if not exists public.staff (
  id           text primary key,          -- s1, s2 …
  name         text not null,
  role         text not null,
  email        text not null unique,
  max_load     int  not null default 12,
  current_load int  not null default 0,
  auth_user_id uuid unique,               -- links to auth.users when staff log in
  created_at   timestamptz not null default now()
);

comment on table public.staff is 'ATG internal team members (researchers, specialists, QC).';

-- =====================================================================
-- 3. CLIENTS  (customer accounts)
-- =====================================================================
create table if not exists public.clients (
  id              text primary key,       -- u1, u2 …
  name            text not null,
  email           text not null unique,
  phone           text,
  country         text,
  city            text,
  package_name    text references public.packages(name),
  apps_total      int  not null default 0,
  apps_used       int  not null default 0,
  apps_remaining  int  generated always as (apps_total - apps_used) stored,
  payment_status  text not null default 'pending'
                  check (payment_status in ('pending','paid','partial','refunded')),
  staff_id        text references public.staff(id),
  client_state    text not null default 'new'
                  check (client_state in ('new','researching','in_prep','active','trial_done','paused','closed')),
  profession      text,                   -- e.g. "Senior UX Designer"
  auth_user_id    uuid unique,            -- links to auth.users on signup
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.clients is 'Customer/applicant accounts managed by ATG.';

create index if not exists clients_staff_idx    on public.clients(staff_id);
create index if not exists clients_state_idx    on public.clients(client_state);
create index if not exists clients_email_trgm   on public.clients using gin(email gin_trgm_ops);
create index if not exists clients_name_trgm    on public.clients using gin(name gin_trgm_ops);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 4. CLIENT_PROFILES  (extended intake / signup wizard data)
-- =====================================================================
create table if not exists public.client_profiles (
  id                  uuid primary key default uuid_generate_v4(),
  client_id           text not null unique references public.clients(id) on delete cascade,
  -- Work authorisation (step 2)
  nationality         text,
  has_work_permit     boolean,
  permit_countries    text[],
  willing_to_relocate boolean,
  target_countries    text[],
  -- Education (step 3)
  highest_degree      text,
  field_of_study      text,
  institution         text,
  graduation_year     int,
  -- Experience (step 4)
  years_experience    int,
  current_title       text,
  current_employer    text,
  skills              text[],
  languages           text[],             -- e.g. ['English:C2','Sinhala:Native']
  -- Target roles (step 5)
  target_roles        text[],
  target_locations    text[],
  salary_min_usd      int,
  -- Documents (step 7)
  cv_url              text,
  cover_letter_url    text,
  passport_url        text,
  other_docs          jsonb default '[]',
  -- Consent (step 8)
  consent_data        boolean not null default false,
  consent_submit      boolean not null default false,
  consented_at        timestamptz,
  updated_at          timestamptz not null default now()
);

comment on table public.client_profiles is 'Extended profile data collected during the signup wizard (8-step intake).';

drop trigger if exists client_profiles_updated_at on public.client_profiles;
create trigger client_profiles_updated_at
  before update on public.client_profiles
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 5. JOB_RECOMMENDATIONS  (jobs researched and proposed by ATG)
-- =====================================================================
create table if not exists public.job_recommendations (
  id              text primary key,       -- j1, j2 …
  client_id       text not null references public.clients(id) on delete cascade,
  staff_id        text references public.staff(id),
  -- Job details
  company         text not null,
  title           text not null,
  location        text,
  source          text,                   -- LinkedIn | Company site | Indeed | Referral | Niche board
  fit_score       int  check (fit_score between 0 and 100),
  fit_reason      text,
  deadline        date,
  -- Workflow
  approval        text not null default 'pending'
                  check (approval in ('pending','approved','declined')),
  status          text check (status in (
                    'drafting','qc','approved','applied',
                    'interview','rejected','follow_up_needed'
                  )),
  -- Submission proof
  proof_type      text check (proof_type in ('email','appid','screenshot','note')),
  proof_ref       text,
  applied_date    date,
  -- Internal
  internal_notes  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.job_recommendations is 'Jobs researched by ATG staff and proposed/applied for on behalf of clients.';

create index if not exists jobrec_client_idx    on public.job_recommendations(client_id);
create index if not exists jobrec_staff_idx     on public.job_recommendations(staff_id);
create index if not exists jobrec_approval_idx  on public.job_recommendations(approval);
create index if not exists jobrec_status_idx    on public.job_recommendations(status);
create index if not exists jobrec_title_trgm    on public.job_recommendations using gin(title gin_trgm_ops);
create index if not exists jobrec_company_trgm  on public.job_recommendations using gin(company gin_trgm_ops);

drop trigger if exists jobrec_updated_at on public.job_recommendations;
create trigger jobrec_updated_at
  before update on public.job_recommendations
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 6. PAYMENTS
-- =====================================================================
create table if not exists public.payments (
  id              text primary key,       -- p1, p2 …
  client_id       text not null references public.clients(id) on delete cascade,
  package_name    text,
  amount_usd      numeric(10,2) not null default 0,
  paid_usd        numeric(10,2) not null default 0,
  currency        text not null default 'USD',
  method          text,                   -- Wise | Bank transfer | etc.
  status          text not null default 'pending'
                  check (status in ('pending','paid','partial','refunded')),
  reference       text,
  payment_date    date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.payments is 'Payment records — one row per transaction, with a separate trail table for audit events.';

create index if not exists payments_client_idx  on public.payments(client_id);
create index if not exists payments_status_idx  on public.payments(status);

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 7. PAYMENT_TRAIL  (audit log per payment)
-- =====================================================================
create table if not exists public.payment_trail (
  id          bigserial primary key,
  payment_id  text not null references public.payments(id) on delete cascade,
  actor       text not null,             -- name of staff member or 'System'
  action      text not null,
  created_at  timestamptz not null default now()
);

comment on table public.payment_trail is 'Ordered audit trail of actions taken on a payment record.';

create index if not exists trail_payment_idx on public.payment_trail(payment_id);

-- =====================================================================
-- 8. NOTIFICATIONS  (per-client inbox)
-- =====================================================================
create table if not exists public.notifications (
  id          text primary key,           -- n1, n2 …
  client_id   text not null references public.clients(id) on delete cascade,
  type        text not null
              check (type in ('interview','applied','job','drafting','reply','paid','system')),
  title       text not null,
  body        text,
  unread      boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.notifications is 'In-app notification inbox for each client.';

create index if not exists notif_client_idx  on public.notifications(client_id);
create index if not exists notif_unread_idx  on public.notifications(client_id, unread) where unread = true;

-- =====================================================================
-- 9. SUPPORT_MESSAGES  (client ↔ staff chat thread)
-- =====================================================================
create table if not exists public.support_messages (
  id          bigserial primary key,
  client_id   text not null references public.clients(id) on delete cascade,
  sender      text not null check (sender in ('client','staff')),
  staff_id    text references public.staff(id),
  body        text not null,
  created_at  timestamptz not null default now()
);

comment on table public.support_messages is 'Support chat messages between clients and ATG staff.';

create index if not exists support_client_idx on public.support_messages(client_id);

-- =====================================================================
-- 10. EMAIL_TEMPLATES
-- =====================================================================
create table if not exists public.email_templates (
  id          text primary key,           -- t1, t2 …
  key         text not null unique,       -- e.g. 'Trial granted'
  trigger_on  text not null,
  subject     text not null,
  body        text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.email_templates is 'Transactional email templates with variable placeholders ({first_name}, etc.).';

drop trigger if exists email_templates_updated_at on public.email_templates;
create trigger email_templates_updated_at
  before update on public.email_templates
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 11. SCHOLARSHIPS  (managed by Cloudflare Worker ingestion)
--     Already created by the Worker; this ensures it exists with the
--     full column set and adds any missing indexes.
-- =====================================================================
create table if not exists public.scholarships (
  id              uuid primary key default uuid_generate_v4(),
  guid            text not null unique,
  title           text not null,
  description     text,
  source_name     text,
  source_url      text,
  country         text,
  degree_level    text check (degree_level in ('undergraduate','masters','phd','postdoc')),
  field_of_study  text,
  deadline        date,
  fully_funded    boolean,
  fetched_at      timestamptz,
  raw_payload     jsonb,
  search_vector   tsvector generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(country,''))
  ) stored,
  created_at      timestamptz not null default now()
);

create index if not exists scholarships_deadline_idx     on public.scholarships(deadline);
create index if not exists scholarships_degree_idx       on public.scholarships(degree_level);
create index if not exists scholarships_search_idx       on public.scholarships using gin(search_vector);
create index if not exists scholarships_country_trgm     on public.scholarships using gin(country gin_trgm_ops);

-- =====================================================================
-- 12. SCHOLARSHIP_MATCHES  (client ↔ scholarship recommendations)
-- =====================================================================
create table if not exists public.scholarship_matches (
  id              uuid primary key default uuid_generate_v4(),
  client_id       text not null references public.clients(id) on delete cascade,
  scholarship_id  uuid not null references public.scholarships(id) on delete cascade,
  match_score     int  check (match_score between 0 and 100),
  notified        boolean not null default false,
  saved           boolean not null default false,
  created_at      timestamptz not null default now(),
  unique (client_id, scholarship_id)
);

create index if not exists schmatches_client_idx  on public.scholarship_matches(client_id);
create index if not exists schmatches_notif_idx   on public.scholarship_matches(client_id, notified) where notified = false;
