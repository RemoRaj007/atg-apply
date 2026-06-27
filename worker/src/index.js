/**
 * ATG Apply — Scholarship Feed Ingestion Worker
 *
 * Pulls scholarship RSS/Atom feeds on a cron schedule, normalizes them
 * into a common shape, and upserts into Supabase `scholarships` table.
 *
 * Required environment variables (set as Worker secrets):
 *   SUPABASE_URL              e.g. https://xjezpwtjjuzixszmfrln.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY service_role key (NOT the anon key — this needs write access)
 */

// ---- Feed registry -----------------------------------------------------
// Add/remove feeds here. `format` tells the parser which dialect to expect.
// `relevance` is a soft filter you can use later — Canada-only feeds are
// low relevance for a Sri Lanka/Bangladesh/Maldives audience but still
// scraped because the data is free and occasionally has open-to-all items.
const FEEDS = [
  {
    name: "Global Affairs Canada — International Scholarships",
    url: "https://www.educanada.ca/scholarships-bourses/rss/news-nouvelles_eng.xml",
    format: "atom",
  },
  {
    name: "Gilman International Scholarship",
    url: "https://www.gilmanscholarship.org/feed/",
    format: "rss2",
  },
  // Add more feeds here as you vet them. Keep one entry per feed so a
  // single bad/slow feed doesn't block the others (each is fetched and
  // parsed independently with its own try/catch below).
];

// ---- Entry point ---------------------------------------------------------

export default {
  // Manual trigger for testing: GET/POST to the Worker URL directly.
  async fetch(request, env, ctx) {
    const result = await runIngestion(env);
    return new Response(JSON.stringify(result, null, 2), {
      headers: { "content-type": "application/json" },
    });
  },

  // Scheduled trigger — configured in wrangler.toml as a daily cron.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runIngestion(env));
  },
};

// ---- Core ingestion loop --------------------------------------------------

async function runIngestion(env) {
  const summary = { feeds_processed: 0, items_seen: 0, items_upserted: 0, errors: [] };

  for (const feed of FEEDS) {
    try {
      const xml = await fetchFeed(feed.url);
      const items = feed.format === "atom" ? parseAtom(xml) : parseRss2(xml);
      summary.items_seen += items.length;

      const normalized = items.map((item) => normalizeItem(item, feed));
      const upserted = await upsertScholarships(env, normalized);
      summary.items_upserted += upserted;
      summary.feeds_processed += 1;
    } catch (err) {
      summary.errors.push({ feed: feed.name, error: String(err) });
    }
  }

  return summary;
}

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "ATGApplyBot/1.0 (+https://atgconcordia.com)" },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return await res.text();
}

// ---- Feed parsers ----------------------------------------------------
// Hand-rolled, dependency-free regex/string parsing. Cloudflare Workers
// don't have DOMParser, and pulling in a full XML lib costs bundle size
// for what is fundamentally a handful of repeated tags. This is brittle
// against malformed XML but fine for well-formed government/org feeds.

function parseAtom(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  return entries.map((entry) => ({
    guid: extractTag(entry, "id"),
    title: extractTag(entry, "title"),
    content: extractTag(entry, "content"),
    link: extractAttr(entry, "link", "href"),
    updated: extractTag(entry, "dfait:updated") || extractTag(entry, "updated"),
  }));
}

function parseRss2(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  return items.map((item) => ({
    guid: extractTag(item, "guid") || extractTag(item, "link"),
    title: extractTag(item, "title"),
    content: extractTag(item, "description") || extractTag(item, "content:encoded"),
    link: extractTag(item, "link"),
    updated: extractTag(item, "pubDate"),
  }));
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!match) return null;
  return decodeEntities(stripCdata(match[1]).trim());
}

function extractAttr(block, tag, attr) {
  const match = block.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`, "i"));
  return match ? match[1] : null;
}

function stripCdata(str) {
  return str.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, ""); // strip any inline HTML tags from content
}

// ---- Normalization ----------------------------------------------------
// Best-effort extraction of structured fields (deadline, country, degree
// level, funding) from free-text title/content. These feeds were not
// designed to be machine-readable, so this is intentionally conservative:
// when extraction is uncertain, we leave the field null rather than guess.
// The raw_payload column preserves the original so you can re-process
// later with a better extractor (e.g. an LLM-based pass) without re-fetching.

const DEGREE_KEYWORDS = {
  phd: ["phd", "doctoral", "doctorate"],
  postdoc: ["postdoctoral", "post-doctoral", "fellowship"],
  masters: ["master's", "masters", "graduate-level", "graduate level"],
  undergraduate: ["undergraduate", "bachelor"],
};

function detectDegreeLevel(text) {
  const lower = text.toLowerCase();
  for (const [level, keywords] of Object.entries(DEGREE_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return level;
  }
  return null;
}

function detectFullyFunded(text) {
  const lower = text.toLowerCase();
  if (lower.includes("fully funded") || lower.includes("fully-funded")) return true;
  return null; // unknown, not false — absence of the phrase isn't proof
}

// Matches "March 13, 2025" / "13 March 2025" / "May 31, 2024" style dates
// commonly used in these feeds. Returns ISO date string or null.
function extractDeadline(text) {
  const months =
    "January|February|March|April|May|June|July|August|September|October|November|December";
  const pattern1 = new RegExp(`(${months})\\s+(\\d{1,2}),?\\s+(\\d{4})`, "i");
  const pattern2 = new RegExp(`(\\d{1,2})\\s+(${months})\\s+(\\d{4})`, "i");

  let match = text.match(pattern1);
  if (match) {
    const [, month, day, year] = match;
    return toIsoDate(month, day, year);
  }
  match = text.match(pattern2);
  if (match) {
    const [, day, month, year] = match;
    return toIsoDate(month, day, year);
  }
  return null;
}

function toIsoDate(monthName, day, year) {
  const date = new Date(`${monthName} ${day}, ${year} UTC`);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function normalizeItem(item, feed) {
  const title = item.title || "";
  const content = item.content || "";
  const combinedText = `${title} ${content}`;

  return {
    source_name: feed.name,
    source_url: item.link || feed.url,
    guid: item.guid || item.link || `${feed.name}:${title}`, // fallback guid, should be rare
    title: title.slice(0, 500),
    description: content.slice(0, 2000),
    country: null, // not reliably inferable from free text without an LLM pass — left for a future enrichment step
    degree_level: detectDegreeLevel(combinedText),
    field_of_study: null, // same caveat as country
    deadline: extractDeadline(combinedText),
    fully_funded: detectFullyFunded(combinedText),
    fetched_at: new Date().toISOString(),
    raw_payload: item,
  };
}

// ---- Supabase upsert ----------------------------------------------------

async function upsertScholarships(env, rows) {
  if (rows.length === 0) return 0;

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/scholarships?on_conflict=guid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase upsert failed: ${res.status} ${errText}`);
  }

  return rows.length;
}
