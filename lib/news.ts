import Parser from "rss-parser";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  description: string;
  source: string;
  image: string;
  category?: string;
};

const parser: Parser = new Parser({
  customFields: { item: ["media:content", "enclosure"] },
});

function extractImageFromDescription(desc?: string): string | undefined {
  if (!desc) return;
  const match = desc.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : undefined;
}

export async function fetchSection(section: string, limit = 20): Promise<NewsItem[]> {
  const feeds: Record<string, string> = {
    tutte: "https://www.repubblica.it/rss/homepage/rss2.0.xml",
    economia: "https://www.ansa.it/sito/notizie/economia/economia_rss.xml",
    cultura: "https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml",
    sport: "https://www.ansa.it/sito/notizie/sport/sport_rss.xml",
    politica: "https://www.ansa.it/sito/notizie/politica/politica_rss.xml",
    tecnologia: "https://www.ansa.it/sito/notizie/tecnologia/tecnologia_rss.xml",
    esteri: "https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml",
    cronaca: "https://www.ansa.it/sito/notizie/cronaca/cronaca_rss.xml",
  };

  const url = feeds[section] || feeds["tutte"];
  const feed = await parser.parseURL(url);

  return (feed.items || []).slice(0, limit).map((item, i) => {
    let image: string | undefined;

    if ((item as any)["media:content"]?.url) {
      image = (item as any)["media:content"].url;
    } else if ((item as any).enclosure?.url) {
      image = (item as any).enclosure.url;
    } else {
      image = extractImageFromDescription(item.content || item.contentSnippet);
    }

    return {
      id: item.guid || `${section}-${i}`,
      title: item.title || "Senza titolo",
      link: item.link || "#",
      description: (item.contentSnippet || "").slice(0, 350) + "...",
      source: new URL(item.link || "").hostname.replace("www.", ""),
      image: image || "/placeholder.jpg",
      category: section,
    };
  });
}
