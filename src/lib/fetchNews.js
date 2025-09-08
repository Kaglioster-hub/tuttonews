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

// --- Parse helpers ---
function parseRss(doc) {
  return [...doc.querySelectorAll("item")].map((item) => {
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

function parseAtom(doc) {
  return [...doc.querySelectorAll("entry")].map((entry) => {
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

    if (!res.ok) return { items: [], status: res.status };

    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");

    let items = parseRss(doc);
    if (!items.length) items = parseAtom(doc);

    return { items, status: res.status };
  } catch (e) {
    console.error("Errore fetch feed:", url, e.message || e);
    return { items: [], status: "ERR" };
  }
}

// --- MAIN ---
export async function fetchNews(category = null) {
  const sources = category ? { [category]: FEEDS[category] } : FEEDS;
  const results = [];
  const seen = new Set();

  for (const [cat, urls] of Object.entries(sources)) {
    for (const url of urls) {
      const { items } = await safeFetchFeed(url);
      for (const item of items) {
        const norm = normalizeUrl(item.link);
        if (!norm || seen.has(norm)) continue;
        seen.add(norm);

        results.push({
          id: norm,
          title: item.title,
          link: addReferral(item.link),
          original: item.link,
          date: item.date,
          category: cat,
          image:
            item.image ||
            `https://www.google.com/s2/favicons?domain=${hostnameOf(item.link)}&sz=128`,
          source: hostnameOf(item.link),
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
