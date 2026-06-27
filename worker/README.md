# ATG Apply — Scholarship Feed Ingestion

## What this is

A Cloudflare Worker that pulls scholarship RSS/Atom feeds on a daily cron,
normalizes them, and upserts into your Supabase `scholarships` table.
ATG Apply's frontend never talks to RSS directly — it only ever queries
Supabase, which is always clean and structured.

## What's already live

- **Supabase project**: `atg-apply` (project ref `xjezpwtjjuzixszmfrln`, region `ap-south-1`)
- **Tables**: `scholarships`, `applicant_profiles`, `scholarship_matches`
- **3 test rows** loaded into `scholarships` to prove the pipeline end-to-end
- **Full-text search** working via the `search_vector` generated column

## ⚠️ Before going further — fix RLS

All three tables currently have Row Level Security **disabled**, meaning
anyone with your Supabase anon key (which ships in frontend JS, fully public)
can read AND write every row — including other users' applicant profiles.

I did not turn this on because doing so without policies blocks all access,
including your own app. Run this once you have Supabase Auth wired in:

```sql
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.scholarships FOR SELECT USING (true);

ALTER TABLE public.applicant_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.applicant_profiles
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.scholarship_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own matches" ON public.scholarship_matches
  FOR SELECT USING (
    applicant_id IN (SELECT id FROM public.applicant_profiles WHERE user_id = auth.uid())
  );
```

Until then, treat this Supabase project as a private dev sandbox — don't
point production traffic at it with the anon key exposed.

## Honest assessment of the feed sources

I tested the Educanada feed live before writing the parser. Two things
you should know:

1. **It's Canada-only.** Every entry requires Canadian citizenship/
   institutional sponsorship. Almost nothing in it is directly relevant
   to a Sri Lanka/Bangladesh/Maldives applicant base — I kept it in the
   registry because it's free and occasionally has open-to-all items
   (Banting Postdoctoral Fellowships, for instance, is open to international
   researchers), but don't expect it to be your primary source.
2. **It's stale.** Last update in the feed was March 2025. It is not a
   high-frequency feed — daily polling is generous, not necessary.

**My recommendation:** the real value for your audience is in
region-specific sources — Commonwealth Scholarships, Chevening, DAAD,
Australia Awards, JJ/A*STAR, ADB-JSP — most of which don't expose clean
RSS and would need a scraper or a manual curation step instead. I'd treat
this Worker as the generic "any feed that exists" ingestion layer, and
plan a second, separate ingestion path (scraping or manual entry) for the
South Asia-relevant sources that don't publish RSS at all.

## Parsing approach — and its limits

Country, field of study aren't reliably extractable from these feeds'
free text without an LLM-based enrichment pass — I left those columns
null rather than guess wrong. `raw_payload` preserves the original item
so you can re-process everything later with a smarter extractor (e.g.
send `title + description` through a Claude API call to extract
structured fields) without re-fetching anything.

Degree level and deadline use simple keyword/regex matching — tested
against 5 real feed entries, 3/5 deadlines correctly extracted (the
other 2 genuinely had no deadline stated in the text).

## Deploying the Worker

```bash
cd atg-apply-ingestion
npm install -g wrangler   # if not already installed
wrangler login
wrangler secret put SUPABASE_URL
# paste: https://xjezpwtjjuzixszmfrln.supabase.co
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# paste the service_role key from Supabase project settings > API
# (NOT the anon key — this needs write access and bypasses RLS)
wrangler deploy
```

Test manually before trusting the cron:

```bash
curl https://atg-apply-scholarship-ingestion.<your-subdomain>.workers.dev
```

This returns a JSON summary: feeds processed, items seen, items upserted,
and any errors per feed.

## Example matching query

Once `applicant_profiles` has rows, a basic match query looks like:

```sql
select s.id, s.title, s.deadline, s.degree_level
from public.scholarships s, public.applicant_profiles a
where a.id = '<applicant-uuid>'
  and (s.degree_level = a.degree_level or a.degree_level = 'any')
  and s.deadline >= current_date
  and s.search_vector @@ to_tsquery('english', a.field_of_study)
order by s.deadline asc;
```

Wrap this in a scheduled Worker or Supabase Edge Function to populate
`scholarship_matches` and flip `notified` once a match is surfaced to
the user — keeps the matching logic out of your frontend entirely.

## Files

- `src/index.js` — the Worker (fetch handler for manual testing + scheduled handler for cron)
- `wrangler.toml` — Worker config, daily cron at 02:00 UTC / 07:30 Colombo time
