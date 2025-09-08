import Parser from "rss-parser";

const parser = new Parser({
  timeout: 15000,
  customFields: {
    item: [
      ["media:content", "media", { keepArray: true }],
      ["media:thumbnail", "thumbnail", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

// --- FEEDS ---
const FEEDS = {
  cronaca: [
    "https://www.ansa.it/sito/notizie/cronaca/cronaca_rss.xml",
    "https://www.corriere.it/rss/cronache.xml",
    "https://www.repubblica.it/rss/cronaca/rss2.0.xml",
  ],
  politica: [
    "https://www.ansa.it/sito/notizie/politica/politica_rss.xml",
    "https://www.corriere.it/rss/politica.xml",
    "https://www.repubblica.it/rss/politica/rss2.0.xml",
  ],
  economia: [
    "https://www.ansa.it/sito/notizie/economia/economia_rss.xml",
    "https://www.corriere.it/rss/economia.xml",
    "https://www.ilsole24ore.com/rss/finanza.xml",
  ],
  sport: [
    "https://www.ansa.it/sito/notizie/sport/sport_rss.xml",
    "https://www.gazzetta.it/rss/home.xml",
    "https://www.corriere.it/rss/sport.xml",
  ],
  esteri: [
    "https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml",
    "https://www.repubblica.it/rss/esteri/rss2.0.xml",
    "https://www.corriere.it/rss/esteri.xml",
  ],
  cultura: [
    "https://www.lastampa.it/rss/cultura.xml",
    "https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml",
  ],
  tecnologia: [
    "https://www.ansa.it/sito/notizie/tecnologia/tecnologia_rss.xml",
    "https://www.corriere.it/rss/tecnologia.xml",
  ],
};

// --- Utils ---
function normalizeUrl(raw) {
  try {
    const u = new URL(raw);
    u.hash = "";
    const keep = new Set(["id", "p", "art", "article", "ref"]);
    [...u.searchParams.keys()].forEach((k) => {
      if (!keep.has(k.toLowerCase())) u.searchParams.delete(k);
    });
    const norm = `${u.protocol}//${u.hostname}${u.pathname.replace(/\/+$/, "")}${u.search}`;
    return norm.toLowerCase();
  } catch {
    return raw;
  }
}

function hostnameOf(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

async function fetchWithTimeout(url, ms = 10000) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, { signal: ctl.signal, redirect: "follow" });
  } finally {
    clearTimeout(id);
  }
}

async function fetchOgImage(pageUrl) {
  try {
    const res = await fetchWithTimeout(pageUrl, 8000);
    if (!res.ok) return null;
    const html = await res.text();
    const og = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1];
    if (og) return absolutize(og, pageUrl);
    const tw = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i)?.[1];
    if (tw) return absolutize(tw, pageUrl);
    return null;
  } catch {
    return null;
  }
}

function absolutize(src, base) {
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
}

function extractFromItem(item, link) {
  if (item.enclosure?.url) return absolutize(item.enclosure.url, link);
  if (item.media?.length) {
    const m = item.media.find((x) => x?.$?.url);
    if (m?.$?.url) return absolutize(m.$.url, link);
  }
  if (item.thumbnail?.length) {
    const t = item.thumbnail.find((x) => x?.$?.url);
    if (t?.$?.url) return absolutize(t.$.url, link);
  }
  const html = item.contentEncoded || item.content;
  const match = html?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  if (match) return absolutize(match, link);
  return null;
}

// --- SAFE PARSE con retry ---
async function safeParseURL(url, retry = 1) {
  try {
    return await parser.parseURL(url);
  } catch (e) {
    console.error("Errore parsing feed:", url, e.message || e);
    if (retry > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      return safeParseURL(url, retry - 1);
    }
    return { items: [] };
  }
}

// --- MAIN ---
export async function fetchNews(category = null) {
  const sources = category ? { [category]: FEEDS[category] } : FEEDS;

  const results = [];
  const seen = new Set();
  let ogFetchCount = 0;
  const maxOgFetch = 10; // limite per performance

  for (const [cat, urls] of Object.entries(sources)) {
    const parsedFeeds = await Promise.all(urls.map((u) => safeParseURL(u)));
    for (const feed of parsedFeeds) {
      for (const item of feed.items ?? []) {
        const originalLink = item.link || item.guid;
        if (!originalLink) continue;

        const norm = normalizeUrl(originalLink);
        if (seen.has(norm)) continue;
        seen.add(norm);

        const date = new Date(item.isoDate || item.pubDate || Date.now());
        const link = addReferral(originalLink);

        let image = extractFromItem(item, originalLink);
        if (!image && ogFetchCount < maxOgFetch) {
          image = await fetchOgImage(originalLink);
          ogFetchCount++;
        }
        if (!image) {
          image = `https://www.google.com/s2/favicons?domain=${hostnameOf(originalLink)}&sz=128`;
        }

        results.push({
          id: norm,
          title: item.title?.trim() || "(senza titolo)",
          link,
          original: originalLink,
          date,
          category: cat,
          image,
          source: hostnameOf(originalLink),
        });
      }
    }
  }

  results.sort((a, b) => b.date - a.date);
  return results;
}

function addReferral(link) {
  return link.includes("?") ? `${link}&ref=vrabo` : `${link}?ref=vrabo`;
}
