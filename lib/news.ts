import Parser from "rss-parser";
import he from "he";
import { SECTIONS, SectionKey } from "@/config/sections";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  date?: string;
  description?: string;
};

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "TuttoNews24/1.0 (+vrabo.it)" }
});

function clean(t?: string) {
  if (!t) return "";
  return he.decode(t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}
function host(u: string) {
  try { return new URL(u).hostname.replace(/^www\./,""); } catch { return ""; }
}

export async function fetchSection(section: SectionKey, limit=40): Promise<NewsItem[]> {
  const def = SECTIONS[section] ?? SECTIONS.tutte;
  const results: NewsItem[] = [];
  await Promise.allSettled(def.feeds.map(async (url) => {
    const feed = await parser.parseURL(url);
    (feed.items || []).forEach(it => {
      if (!it.link) return;
      results.push({
        id: it.link!,
        title: clean(it.title),
        link: it.link!,
        source: host(it.link!) || host(url),
        date: it.isoDate || it.pubDate,
        description: clean(it.contentSnippet || it.content || it.summary)
      });
    });
  }));
  const seen = new Set<string>();
  const dedup = results.filter(r => seen.has(r.id) ? false : (seen.add(r.id), true));
  dedup.sort((a,b) => new Date(b.date||0).getTime() - new Date(a.date||0).getTime());
  return dedup.slice(0,limit);
}
