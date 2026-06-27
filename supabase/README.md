# ATG Apply — Supabase Database

**Project ref:** `xjezpwtjjuzixszmfrln`  
**Region:** `ap-south-1` (Mumbai — closest to Sri Lanka / Bangladesh / Maldives)  
**Dashboard:** https://supabase.com/dashboard/project/xjezpwtjjuzixszmfrln

---

## Schema overview

| Table | Rows (seed) | Description |
|---|---|---|
| `packages` | 4 | Pricing tiers (Trial / Starter / Professional / Premium) |
| `staff` | 4 | ATG team members |
| `clients` | 10 | Customer accounts |
| `client_profiles` | — | Extended intake data (signup wizard, 8 steps) |
| `job_recommendations` | 20 | Jobs researched and managed by ATG |
| `payments` | 8 | Payment records |
| `payment_trail` | 15 | Audit log per payment |
| `notifications` | 6 | Per-client in-app inbox |
| `support_messages` | — | Client ↔ staff chat |
| `email_templates` | 5 | Transactional email templates |
| `scholarships` | varies | Feed-ingested scholarships (managed by Cloudflare Worker) |
| `scholarship_matches` | — | Client–scholarship recommendations |

---

## Running the migrations

Open the Supabase SQL editor for the project and run the files **in order**:

```
supabase/migrations/001_schema.sql   ← tables, indexes, triggers
supabase/migrations/002_seed.sql     ← seed data (mirrors src/data.js exactly)
supabase/migrations/003_rls.sql      ← Row Level Security (run after Auth is wired)
```

All scripts are **idempotent** — safe to re-run.

---

## RLS notes

`003_rls.sql` enables Row Level Security on every table. **Run this only after you have Supabase Auth integrated in the frontend** — enabling RLS without policies blocks all access including your own app.

Two helper functions power all policies:

```sql
public.is_staff()      -- true if auth.uid() belongs to a staff member
public.my_client_id()  -- returns the clients.id for the logged-in customer
```

### Policy matrix (summary)

| Table | Client | Staff |
|---|---|---|
| `packages` | read | all |
| `staff` | — | read + write |
| `clients` | own row | all |
| `client_profiles` | own row | all |
| `job_recommendations` | read own + update `approval` | all |
| `payments` | read own | all |
| `payment_trail` | read own | insert |
| `notifications` | own | all |
| `support_messages` | own | all |
| `email_templates` | — | all |
| `scholarships` | read | all |
| `scholarship_matches` | read own | all |

---

## Connecting the frontend

Install the Supabase JS client:

```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Add to `.env` (never commit):

```
VITE_SUPABASE_URL=https://xjezpwtjjuzixszmfrln.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key from Supabase project settings → API>
```

Example — fetch job recommendations for the logged-in client:

```js
const { data, error } = await supabase
  .from('job_recommendations')
  .select('*')
  .eq('client_id', clientId)
  .order('created_at', { ascending: false })
```

---

## Scholarship feed Worker

See `worker/README.md` for the Cloudflare Worker that ingests RSS/Atom feeds
into the `scholarships` table on a daily cron. The Worker uses the
`service_role` key which bypasses RLS — no policy change needed for ingestion.

---

## Useful queries

**Active clients with low application balance:**
```sql
select name, profession, package_name, apps_remaining, staff_id
from public.clients
where client_state = 'active' and apps_remaining <= 5
order by apps_remaining;
```

**Jobs pending QC:**
```sql
select j.id, c.name, j.company, j.title, j.fit_score
from public.job_recommendations j
join public.clients c on c.id = j.client_id
where j.status = 'qc'
order by j.created_at;
```

**Revenue summary:**
```sql
select status, count(*) as count, sum(paid_usd) as total_paid_usd
from public.payments
group by status
order by total_paid_usd desc;
```

**Scholarship match query (once applicant_profiles are filled):**
```sql
select s.id, s.title, s.deadline, s.degree_level, s.fully_funded
from public.scholarships s, public.client_profiles p
where p.client_id = '<client-id>'
  and (s.degree_level = p.highest_degree or s.degree_level is null)
  and s.deadline >= current_date
  and s.search_vector @@ to_tsquery('english', replace(p.field_of_study, ' ', ' & '))
order by s.deadline;
```
