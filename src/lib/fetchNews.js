// src/lib/fetchNews.js
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 15000,
  customFields: {
    item: [
      ["media:content", "media", { keepArray: true }],
      ["media:thumbnail", "thumbnail", { keepArray: true }],
      ["content:encoded", "contentEncoded"]
    ]
  }
});

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
  ]
};

// normalizza URL per dedup: togli query di tracking, #, trailing slash
function normalizeUrl(raw) {
  try {
    const u = new URL(raw);
    u.hash = "";
    // conserva solo query "significative", rimuove tracking
    const keep = new Set(["id", "p", "art", "article", "ref"]);
    [...u.searchParams.keys()].forEach(k => {
      if (!keep.has(k.toLowerCase())) u.searchParams.delete(k);
    });
    const norm = `${u.protocol}//${u.hostname}${u.pathname.replace(/\/+$/, "")}${u.search}`;
    return norm.toLowerCase();
  } catch {
    return raw;
  }
}

function hostnameOf(link) {
  try { return new URL(link).hostname.replace(/^www\./, ""); } catch { return ""; }
}

// timeout fetch
async function fetchWithTimeout(url, ms = 10000) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctl.signal, redirect: "follow" });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// prova a ricavare l'immagine OG/Twitter dalla pagina dell'articolo
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

// rende assoluti eventuali src relativi
function absolutize(src, base) {
  try { return new URL(src, base).toString(); } catch { return src; }
}

// estrae immagine da item RSS (enclosure/media/thumbnail/content)
function extractFromItem(item, link) {
  if (item.enclosure?.url) return absolutize(item.enclosure.url, link);

  if (item.media?.length) {
    const m = item.media.find(x => x?.$?.url);
    if (m?.$?.url) return absolutize(m.$.url, link);
  }
  if (item.thumbnail?.length) {
    const t = item.thumbnail.find(x => x?.$?.url);
    if (t?.$?.url) return absolutize(t.$.url, link);
  }
  const html = item.contentEncoded || item.content;
  const match = html?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  if (match) return absolutize(match, link);

  return null;
}

export async function fetchNews(category = null) {
  const sources = category ? { [category]: FEEDS[category] } : FEEDS;

  const results = [];
  const seen = new Set(); // dedup per link normalizzato

  for (const [cat, urls] of Object.entries(sources)) {
    const parsedFeeds = await Promise.allSettled(urls.map(u => parser.parseURL(u)));
    for (const pf of parsedFeeds) {
      if (pf.status !== "fulfilled") continue;
      for (const item of pf.value.items ?? []) {
        const originalLink = item.link || item.guid;
        if (!originalLink) continue;

        const norm = normalizeUrl(originalLink);
        if (seen.has(norm)) continue; // già preso in altra categoria, non duplicare
        seen.add(norm);

        const date = new Date(item.isoDate || item.pubDate || Date.now());
        const link = addReferral(originalLink);

        // immagini: prima dall'item, poi OG della pagina
        let image = extractFromItem(item, originalLink);
        if (!image) image = await fetchOgImage(originalLink);

        results.push({
          id: norm,
          title: item.title?.trim() || "(senza titolo)",
          link,
          original: originalLink,
          date,
          category: cat,
          image,
          source: hostnameOf(originalLink)
        });
      }
    }
  }

  // ordina per data desc
  results.sort((a, b) => b.date - a.date);
  return results;
}

function addReferral(link) {
  // qui puoi mettere logiche per dominio (es. awin/amazon) — per ora ref generico
  return link.includes("?") ? `${link}&ref=vrabo` : `${link}?ref=vrabo`;
}
