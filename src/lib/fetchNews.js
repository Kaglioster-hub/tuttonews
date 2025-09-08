import { DOMParser } from "linkedom";

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

// --- Parse XML con linkedom ---
async function safeFetchRSS(url) {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const { document } = new DOMParser().parseFromString(text, "text/xml");
    const items = [...document.querySelectorAll("item")];

    return items.map((item) => {
      const title = item.querySelector("title")?.textContent?.trim() || "(senza titolo)";
      const link = item.querySelector("link")?.textContent?.trim() || "";
      const pubDate = item.querySelector("pubDate")?.textContent?.trim();
      const isoDate = pubDate ? new Date(pubDate) : new Date();

      let image = item.querySelector("enclosure")?.getAttribute("url") || null;
      if (!image) {
        const mThumb = item.querySelector("media\\:thumbnail")?.getAttribute("url");
        if (mThumb) image = mThumb;
      }

      return { title, link, date: isoDate, image };
    });
  } catch (e) {
    console.error("Errore fetch RSS:", url, e.message || e);
    return [];
  }
}

// --- MAIN ---
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
          date: item.date,
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
