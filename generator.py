import os
import subprocess
from pathlib import Path

# === CONFIG ===
PROJECT = "tuttonews"
BASE_DIR = Path.home() / "Projects" / PROJECT

# === FILES ===
FILES = {
    "package.json": """{
  "name": "tuttonews24",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "autoprefixer": "^10.4.19",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.344.0",
    "next": "14.2.3",
    "postcss": "^8.4.38",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "rss-parser": "^3.13.0",
    "tailwindcss": "^3.4.6"
  }
}""",
    "next.config.js": 'module.exports = { reactStrictMode: true };',
    "postcss.config.js": 'module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, }, };',
    "tailwind.config.js": """module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#7b1e23",
        accent: "#ef4444",
        dark: "#0b0f19",
        light: "#f9fafb"
      },
      boxShadow: {
        glow: "0 0 20px rgba(239,68,68,.35)",
        card: "0 4px 14px rgba(0,0,0,0.1)"
      }
    }
  },
  plugins: []
};"""
}

# === FUNZIONI ===
def run(cmd, cwd=None):
    print(f"\n$ {cmd}")
    subprocess.run(cmd, cwd=cwd, shell=True, check=True)

def write_file(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"✓ Creato {path}")

# === MAIN ===
def main():
    print(f"=== Setup progetto: {PROJECT} ===")
    BASE_DIR.mkdir(parents=True, exist_ok=True)

    # File di configurazione
    for name, content in FILES.items():
        write_file(BASE_DIR / name, content)

    # Struttura cartelle
    for d in ["src/app", "src/components", "src/lib", "src/styles", "public/logos"]:
        (BASE_DIR / d).mkdir(parents=True, exist_ok=True)

    # CSS globale
    write_file(BASE_DIR / "src/styles/globals.css",
    "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n")

    # ========== LIB: fetchNews ==========
    write_file(BASE_DIR / "src/lib/fetchNews.js", """import Parser from "rss-parser";
const parser = new Parser();

const FEEDS = {
  cronaca: [
    "https://www.ansa.it/sito/notizie/cronaca/cronaca_rss.xml",
    "https://roma.repubblica.it/rss/cronaca/rss2.0.xml"
  ],
  politica: [
    "https://www.ansa.it/sito/notizie/politica/politica_rss.xml",
    "https://www.repubblica.it/rss/politica/rss2.0.xml"
  ],
  economia: [
    "https://www.ilsole24ore.com/rss/italia--economia.xml",
    "https://www.ansa.it/sito/notizie/economia/economia_rss.xml"
  ],
  sport: [
    "https://www.gazzetta.it/rss/home.xml",
    "https://www.corrieredellosport.it/rss"
  ],
  esteri: [
    "https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml",
    "https://www.repubblica.it/rss/esteri/rss2.0.xml"
  ],
  cultura: [
    "https://www.lastampa.it/rss/cultura.xml"
  ],
  tecnologia: [
    "https://www.ansa.it/sito/notizie/tecnologia/tecnologia_rss.xml"
  ]
};

export async function fetchNews(category = null) {
  const articles = [];
  const sources = category ? { [category]: FEEDS[category] } : FEEDS;

  for (const [cat, urls] of Object.entries(sources)) {
    for (const url of urls) {
      try {
        const feed = await parser.parseURL(url);
        feed.items.forEach(item => {
          articles.push({
            id: item.guid || item.link,
            title: item.title,
            link: addReferral(item.link),
            date: new Date(item.isoDate || item.pubDate),
            category: cat,
            image: item.enclosure?.url || extractImg(item.content)
          });
        });
      } catch (err) {
        console.error("Errore feed", url, err.message);
      }
    }
  }
  const unique = Array.from(new Map(articles.map(a => [a.link, a])).values());
  unique.sort((a, b) => b.date - a.date);
  return unique;
}

function addReferral(link) {
  return link.includes("?") ? `${link}&ref=vrabo` : `${link}?ref=vrabo`;
}

function extractImg(content) {
  const match = content?.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}
""")

    # ========== COMPONENTS ==========
    write_file(BASE_DIR / "src/components/Navbar.jsx", """\"use client\";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const categories = ["tutte", "cronaca", "politica", "economia", "sport", "esteri", "cultura", "tecnologia"];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary">TuttoNews24</Link>
        <div className="flex gap-4">
          {categories.map(c => (
            <Link key={c} href={c === "tutte" ? "/" : `/${c}`} className="hover:text-primary capitalize">
              {c}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
""")

    write_file(BASE_DIR / "src/components/ThemeToggle.jsx", """\"use client\";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button onClick={toggle} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
      {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
    </button>
  );
}
""")

    write_file(BASE_DIR / "src/components/ArticleCard.jsx", """import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

const SITE_LOGOS = {
  "ansa.it": "/logos/ansa.png",
  "repubblica.it": "/logos/repubblica.png",
  "corriere.it": "/logos/corriere.png",
  "ilsole24ore.com": "/logos/sole24.png",
  "gazzetta.it": "/logos/gazzetta.png",
  "lastampa.it": "/logos/stampa.png",
  "rainews.it": "/logos/rainews.png",
};

export default function ArticleCard({ article }) {
  const hostname = new URL(article.link).hostname.replace("www.", "");
  const logo = SITE_LOGOS[hostname];

  return (
    <div className="relative rounded-2xl shadow-card bg-white dark:bg-gray-900 p-4 hover:shadow-glow transition">
      {logo && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
          <img src={logo} alt={hostname} className="w-8 h-8 object-contain" />
        </div>
      )}
      {article.image ? (
        <img src={article.image} alt={article.title} className="w-full h-44 object-cover rounded-lg" />
      ) : (
        <div className="w-full h-44 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          {logo ? <img src={logo} alt={hostname} className="w-12 h-12 opacity-70" /> : <span className="text-gray-500 text-sm">Nessuna immagine</span>}
        </div>
      )}
      <h3 className="text-lg font-semibold mt-4">
        <Link href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{article.title}</Link>
      </h3>
      <p className="text-sm text-gray-500 mt-1">{article.category.toUpperCase()} · {formatDistanceToNow(article.date, { locale: it })} fa</p>
    </div>
  );
}
""")

    write_file(BASE_DIR / "src/components/DonateButton.jsx", """\"use client\";

export default function DonateButton() {
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_blank" className="flex justify-center">
      <input type="hidden" name="business" value="paypal@vrabo.it" />
      <input type="hidden" name="currency_code" value="EUR" />
      <input type="hidden" name="amount" value="18.00" />
      <button type="submit" className="mt-6 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-glow hover:scale-105 transition">
        Dona ora (18,00 €)
      </button>
    </form>
  );
}
""")

    # ========== APP ==========
    write_file(BASE_DIR / "src/app/layout.jsx", """import "./../styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "TuttoNews24",
  description: "Notizie 24/7 aggregate dalle maggiori testate italiane",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="bg-light dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
""")

    write_file(BASE_DIR / "src/app/page.jsx", """import { fetchNews } from "@/lib/fetchNews";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  const articles = await fetchNews();
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map(a => <ArticleCard key={a.id} article={a} />)}
    </div>
  );
}
""")

    write_file(BASE_DIR / "src/app/donate/page.jsx", """import DonateButton from "@/components/DonateButton";

export default function DonatePage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-6">Sostieni TuttoNews24</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Il nostro servizio resta gratuito e accessibile a tutti. Puoi contribuire con una donazione volontaria:
        l’importo consigliato è <strong>18,00 €</strong>. Grazie al tuo supporto possiamo migliorare sempre di più!
      </p>
      <DonateButton />
    </main>
  );
}
""")

    # Logo placeholders
    (BASE_DIR / "public/logo.png").write_bytes(b"")
    (BASE_DIR / "public/logo-dark.png").write_bytes(b"")

    # Installazione dipendenze
    run("npm install", cwd=BASE_DIR)

    print("\n=== ✅ TuttoNews24 creato e pronto ===")
    print(f"Cartella: {BASE_DIR}")
    print("Avvia dev server con:")
    print(f"cd {BASE_DIR}")
    print("npm run dev")
    print("Poi push su GitHub e deploya su Vercel -> tuttonews.vrabo.it")

if __name__ == "__main__":
    main()
