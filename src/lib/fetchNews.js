import { DOMParser } from "linkedom";

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

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const ACCEPT =
  "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7";

function normalizeUrl(raw) {
  try {
    const u = new URL(raw);
    u.hash = "";
    const keep = new Set(["id", "p", "art", "article", "ref"]);
    [...u.searchParams.keys()].forEach((k) => {
      if (!keep.has(k.toLowerCase())) u.searchParams.delete(k);
    });
    return `${u.protocol}//${u.hostname}${u.pathname.replace(/\/+$/, "")}${u.search}`.toLowerCase();
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

function absolutize(src, base) {
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
}

/* ------------ PARSING ------------ */

function parseRssDocument(document) {
  const items = [...document.querySelectorAll("item")];
  return items.map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "(senza titolo)";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim();
    let date = new Date();
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d)) date = d;
    }
    let image =
      item.querySelector("enclosure")?.getAttribute("url") ||
      item.querySelector("media\\:thumbnail")?.getAttribute("url") ||
      null;

    // prova dentro content
    if (!image) {
      const html = item.querySelector("content\\:encoded")?.textContent || "";
      const m = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
      if (m) image = m;
    }
    return { title, link, date, image };
  });
}

function parseAtomDocument(document) {
  const entries = [...document.querySelectorAll("entry")];
  return entries.map((entry) => {
    const title = entry.querySelector("title")?.textContent?.trim() || "(senza titolo)";
    const linkEl =
      entry.querySelector('link[rel="alternate"][href]') ||
      entry.querySelector('link[href]');
    const link = linkEl?.getAttribute("href") || "";
    const updated = entry.querySelector("updated")?.textContent?.trim();
    const published = entry.querySelector("published")?.textContent?.trim();
    let date = new Date();
    const cand = updated || published;
    if (cand) {
      const d = new Date(cand);
      if (!isNaN(d)) date = d;
    }
    let image =
      entry.querySelector("link[rel='enclosure'][href]")?.getAttribute("href") ||
      entry.querySelector("media\\:thumbnail")?.getAttribute("url") ||
      null;

    if (!image) {
      const html = entry.querySelector("content")?.textContent || entry.querySelector("summary")?.textContent || "";
      const m = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
      if (m) image = m;
    }
    return { title, link, date, image };
  });
}

async function safeFetchRSS(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: ACCEPT, "Accept-Language": "it-IT,it;q=0.9,en;q=0.8" },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const { document } = new DOMParser().parseFromString(text, "text/xml");
    if (!document) return [];

    // prova RSS; se vuoto prova ATOM
    let list = parseRssDocument(document);
    if (!list.length) list = parseAtomDocument(document);
    return list;
  } catch (e) {
    console.error("Errore fetch RSS:", url, e.message || e);
    return [];
  }
}

/* ------------ MAIN ------------ */

export async function fetchNews(category = null) {
  const sources = category ? { [category]: FEEDS[category] } : FEEDS;

  const results = [];
  const seen = new Set();

  for (const [cat, urls] of Object.entries(sources)) {
    for (const url of urls) {
      const items = await safeFetchRSS(url);
      for (const item of items) {
        const originalLink = item.link;
        if (!originalLink) continue;

        const norm = normalizeUrl(originalLink);
        if (seen.has(norm)) continue;
        seen.add(norm);

        results.push({
          id: norm,
          title: item.title,
          link: addReferral(originalLink),
          original: originalLink,
          date: item.date || new Date(),
          category: cat,
          image:
            item.image ||
            `https://www.google.com/s2/favicons?domain=${hostnameOf(originalLink)}&sz=128`,
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
