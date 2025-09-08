

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

// --- Parse RSS ---
function parseRss(document) {
  return [...document.querySelectorAll("item")].map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "(senza titolo)";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim();
    let date = new Date();
    if (pubDate) {
      const parsed = new Date(pubDate);
      if (!isNaN(parsed)) date = parsed;
    }

    let image = item.querySelector("enclosure")?.getAttribute("url") || null;
    if (!image) {
      const mThumb = item.querySelector("media\\:thumbnail")?.getAttribute("url");
      if (mThumb) image = mThumb;
    }

    return { title, link, date, image };
  });
}

// --- Parse ATOM ---
function parseAtom(document) {
  return [...document.querySelectorAll("entry")].map((entry) => {
    const title = entry.querySelector("title")?.textContent?.trim() || "(senza titolo)";
    const link = entry.querySelector("link")?.getAttribute("href") || "";
    const updated = entry.querySelector("updated")?.textContent;
    let date = new Date();
    if (updated) {
      const parsed = new Date(updated);
      if (!isNaN(parsed)) date = parsed;
    }
    const image = entry.querySelector("link[rel='enclosure']")?.getAttribute("href") || null;
    return { title, link, date, image };
  });
}

// --- Safe fetch RSS/ATOM ---
async function safeFetchFeed(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (TuttoNews24 bot; +https://tuttonews.vrabo.it)",
        Accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9,*/*;q=0.7",
      },
      next: { revalidate: 300 },
    });

    const status = res.status;
    if (!res.ok) return { items: [], status };

    const text = await res.text();
    const { document } = new DOMParser().parseFromString(text, "text/xml");

    let items = parseRss(document);
    if (!items.length) items = parseAtom(document);

    return { items, status };
  } catch (e) {
    console.error("Errore fetch feed:", url, e.message || e);
    return { items: [], status: "ERR" };
  }
}

// --- MAIN ---
export async function fetchNews(category = null) {
  const sources = category ? { [category]: FEEDS[category] } : FEEDS;

  const results = [];
  const diagnostics = [];
  const seen = new Set();

  for (const [cat, urls] of Object.entries(sources)) {
    for (const url of urls) {
      const { items, status } = await safeFetchFeed(url);
      diagnostics.push({ url, status, count: items.length });

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
  return { articles: results, diagnostics };
}

function addReferral(link) {
  return link.includes("?") ? `${link}&ref=vrabo` : `${link}?ref=vrabo`;
}
