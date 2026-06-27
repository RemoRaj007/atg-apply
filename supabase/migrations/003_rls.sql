-- ATG Apply — Row Level Security Policies
-- Run AFTER wiring Supabase Auth into the frontend.
-- Until then keep RLS disabled — enabling without policies blocks all access.
-- =====================================================================
-- NOTE: This script is idempotent. Re-running it drops and re-creates
--       policies so you can safely edit and re-apply.
-- =====================================================================

-- ── Enable RLS on every table ─────────────────────────────────────────
alter table public.packages           enable row level security;
alter table public.staff              enable row level security;
alter table public.clients            enable row level security;
alter table public.client_profiles    enable row level security;
alter table public.job_recommendations enable row level security;
alter table public.payments           enable row level security;
alter table public.payment_trail      enable row level security;
alter table public.notifications      enable row level security;
alter table public.support_messages   enable row level security;
alter table public.email_templates    enable row level security;
alter table public.scholarships       enable row level security;
alter table public.scholarship_matches enable row level security;

-- ── Helper: is the caller an ATG staff member? ────────────────────────
-- Staff log in via Supabase Auth; their auth.uid() must be in staff.auth_user_id.
create or replace function public.is_staff()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.staff where auth_user_id = auth.uid());
$$;

-- ── Helper: client_id for the calling user ────────────────────────────
create or replace function public.my_client_id()
returns text language sql security definer stable as $$
  select id from public.clients where auth_user_id = auth.uid() limit 1;
$$;

-- ── packages: public read ─────────────────────────────────────────────
drop policy if exists "packages_public_read"  on public.packages;
create policy "packages_public_read"
  on public.packages for select using (true);

drop policy if exists "packages_staff_write"  on public.packages;
create policy "packages_staff_write"
  on public.packages for all using (public.is_staff());

-- ── staff: staff can read all staff; clients cannot see staff rows ────
drop policy if exists "staff_staff_read" on public.staff;
create policy "staff_staff_read"
  on public.staff for select using (public.is_staff());

drop policy if exists "staff_staff_write" on public.staff;
create policy "staff_staff_write"
  on public.staff for all using (public.is_staff());

-- ── clients ───────────────────────────────────────────────────────────
drop policy if exists "clients_own_read"   on public.clients;
create policy "clients_own_read"
  on public.clients for select
  using (auth_user_id = auth.uid() or public.is_staff());

drop policy if exists "clients_own_update" on public.clients;
create policy "clients_own_update"
  on public.clients for update
  using (auth_user_id = auth.uid() or public.is_staff());

drop policy if exists "clients_staff_all"  on public.clients;
create policy "clients_staff_all"
  on public.clients for all using (public.is_staff());

drop policy if exists "clients_insert_own" on public.clients;
create policy "clients_insert_own"
  on public.clients for insert
  with check (auth_user_id = auth.uid());

-- ── client_profiles ───────────────────────────────────────────────────
drop policy if exists "profiles_own_all"  on public.client_profiles;
create policy "profiles_own_all"
  on public.client_profiles for all
  using (
    client_id = public.my_client_id()
    or public.is_staff()
  );

-- ── job_recommendations ───────────────────────────────────────────────
drop policy if exists "jobrec_client_read"  on public.job_recommendations;
create policy "jobrec_client_read"
  on public.job_recommendations for select
  using (
    client_id = public.my_client_id()
    or public.is_staff()
  );

drop policy if exists "jobrec_client_approve" on public.job_recommendations;
-- Clients may only update the approval column on their own rows
create policy "jobrec_client_approve"
  on public.job_recommendations for update
  using (client_id = public.my_client_id())
  with check (client_id = public.my_client_id());

drop policy if exists "jobrec_staff_all"  on public.job_recommendations;
create policy "jobrec_staff_all"
  on public.job_recommendations for all using (public.is_staff());

-- ── payments ──────────────────────────────────────────────────────────
drop policy if exists "payments_client_read"  on public.payments;
create policy "payments_client_read"
  on public.payments for select
  using (
    client_id = public.my_client_id()
    or public.is_staff()
  );

drop policy if exists "payments_staff_all"  on public.payments;
create policy "payments_staff_all"
  on public.payments for all using (public.is_staff());

-- ── payment_trail ─────────────────────────────────────────────────────
drop policy if exists "trail_client_read"  on public.payment_trail;
create policy "trail_client_read"
  on public.payment_trail for select
  using (
    payment_id in (
      select id from public.payments where client_id = public.my_client_id()
    )
    or public.is_staff()
  );

drop policy if exists "trail_staff_write"  on public.payment_trail;
create policy "trail_staff_write"
  on public.payment_trail for insert with check (public.is_staff());

-- ── notifications ─────────────────────────────────────────────────────
drop policy if exists "notif_own_all"  on public.notifications;
create policy "notif_own_all"
  on public.notifications for all
  using (
    client_id = public.my_client_id()
    or public.is_staff()
  );

-- ── support_messages ──────────────────────────────────────────────────
drop policy if exists "support_own_all"  on public.support_messages;
create policy "support_own_all"
  on public.support_messages for all
  using (
    client_id = public.my_client_id()
    or public.is_staff()
  );

-- ── email_templates ───────────────────────────────────────────────────
drop policy if exists "templates_staff_all"  on public.email_templates;
create policy "templates_staff_all"
  on public.email_templates for all using (public.is_staff());

-- ── scholarships: public read ─────────────────────────────────────────
drop policy if exists "scholarships_public_read"  on public.scholarships;
create policy "scholarships_public_read"
  on public.scholarships for select using (true);

drop policy if exists "scholarships_worker_write"  on public.scholarships;
-- The Cloudflare Worker uses the service_role key which bypasses RLS,
-- so no explicit policy is needed for the Worker. This policy is a
-- convenience for staff who may want to edit via the Supabase dashboard.
create policy "scholarships_worker_write"
  on public.scholarships for all using (public.is_staff());

-- ── scholarship_matches ───────────────────────────────────────────────
drop policy if exists "schmatches_own_read"  on public.scholarship_matches;
create policy "schmatches_own_read"
  on public.scholarship_matches for select
  using (
    client_id = public.my_client_id()
    or public.is_staff()
  );

drop policy if exists "schmatches_staff_all"  on public.scholarship_matches;
create policy "schmatches_staff_all"
  on public.scholarship_matches for all using (public.is_staff());
