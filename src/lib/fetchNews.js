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
  "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8,*/*;q=0.7";

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

function parseRss(doc) {
  return [...doc.querySelectorAll("item")].map((it) => ({
    title: it.querySelector("title")?.textContent?.trim() || "(senza titolo)",
    link: it.querySelector("link")?.textContent?.trim() || "",
    date: new Date(it.querySelector("pubDate")?.textContent || Date.now()),
    image: it.querySelector("enclosure")?.getAttribute("url") || null,
  }));
}
function parseAtom(doc) {
  return [...doc.querySelectorAll("entry")].map((it) => ({
    title: it.querySelector("title")?.textContent?.trim() || "(senza titolo)",
    link: it.querySelector("link")?.getAttribute("href") || "",
    date: new Date(it.querySelector("updated")?.textContent || Date.now()),
    image: it.querySelector("link[rel='enclosure']")?.getAttribute("href") || null,
  }));
}

async function safeFetchRSS(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: ACCEPT },
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
    return { items: [], status: "ERR: " + (e.message || e) };
  }
}

export async function fetchNews(category = null) {
  const sources = category ? { [category]: FEEDS[category] } : FEEDS;

  const results = [];
  const diagnostics = [];
  const seen = new Set();

  for (const [cat, urls] of Object.entries(sources)) {
    for (const url of urls) {
      const { items, status } = await safeFetchRSS(url);
      diagnostics.push({ url, status, count: items.length });
      for (const item of items) {
        const norm = normalizeUrl(item.link);
        if (!norm || seen.has(norm)) continue;
        seen.add(norm);

        results.push({
          id: norm,
          title: item.title,
          link: item.link,
          date: item.date,
          category: cat,
          image: item.image || `https://www.google.com/s2/favicons?domain=${hostnameOf(item.link)}&sz=128`,
          source: hostnameOf(item.link),
        });
      }
    }
  }

  results.sort((a, b) => b.date - a.date);
  return { articles: results, diagnostics };
}
