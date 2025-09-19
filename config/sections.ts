export type SectionKey =
  | "tutte" | "cronaca" | "politica" | "economia"
  | "sport" | "esteri" | "cultura" | "tecnologia";

export const SECTIONS: Record<SectionKey, { label: string; feeds: string[] }> = {
  tutte: { label: "Tutte", feeds: [
    "https://www.ansa.it/sito/ansait_rss.xml",
    "https://rss.corriere.it/rss/homepage.xml",
    "https://www.repubblica.it/rss/homepage/rss2.0.xml"
  ]},
  cronaca: { label: "Cronaca", feeds: [
    "https://www.ansa.it/sito/notizie/cronaca/cronaca_rss.xml",
    "https://www.repubblica.it/rss/cronaca/rss2.0.xml"
  ]},
  politica: { label: "Politica", feeds: [
    "https://www.ansa.it/sito/notizie/politica/politica_rss.xml",
    "https://www.repubblica.it/rss/politica/rss2.0.xml"
  ]},
  economia: { label: "Economia", feeds: [
    "https://www.ilsole24ore.com/rss/ultimora.xml",
    "https://www.ansa.it/sito/notizie/economia/economia_rss.xml"
  ]},
  sport: { label: "Sport", feeds: [
    "https://www.gazzetta.it/rss/home.xml",
    "https://www.ansa.it/sito/notizie/sport/sport_rss.xml"
  ]},
  esteri: { label: "Esteri", feeds: [
    "https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml",
    "https://www.repubblica.it/rss/esteri/rss2.0.xml"
  ]},
  cultura: { label: "Cultura", feeds: [
    "https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml",
    "https://www.repubblica.it/rss/spettacoli_e_cultura/rss2.0.xml"
  ]},
  tecnologia: { label: "Tecnologia", feeds: [
    "https://www.ansa.it/sito/notizie/tecnologia/tecnologia_rss.xml",
    "https://www.repubblica.it/rss/tecnologia/rss2.0.xml"
  ]}
};
