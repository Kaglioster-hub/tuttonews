export const runtime = "edge"; // veloce su Vercel
export const dynamic = "force-dynamic";

import ArticleCard from "@/components/ArticleCard";
import DonateButton from "@/components/DonateButton";

const CATEGORIES = [
  { key: "tutte", label: "Tutte" },
  { key: "cronaca", label: "Cronaca" },
  { key: "politica", label: "Politica" },
  { key: "economia", label: "Economia" },
  { key: "sport", label: "Sport" },
  { key: "esteri", label: "Esteri" },
  { key: "cultura", label: "Cultura" },
  { key: "tecnologia", label: "Tecnologia" },
];

async function getArticles(cat, sort) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/news?cat=${cat}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  let data = await res.json();
  if (sort === "vecchi") data = [...data].reverse();
  return data;
}

export default async function Home({ searchParams }) {
  let sp = {};
  try {
    sp =
      searchParams && typeof searchParams.then === "function"
        ? await searchParams
        : searchParams || {};
  } catch {
    sp = {};
  }

  const sort = sp.sort || "recenti";
  const category = sp.cat || "tutte";

  const articles = await getArticles(category, sort);

  return (
    <div className="space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          TuttoNews24
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Aggregatore di notizie italiane 24/7, senza duplicati.
        </p>
      </header>

      {/* Filtri */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((c) => (
          <a
            key={c.key}
            href={c.key === "tutte" ? "/" : `/?cat=${c.key}`}
            className={`px-4 py-2 rounded-full text-sm transition ${
              category === c.key
                ? "bg-primary text-white shadow-glow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {c.label}
          </a>
        ))}

        <a
          href={`/?cat=${category}&sort=${
            sort === "recenti" ? "vecchi" : "recenti"
          }`}
          className="px-4 py-2 rounded-full text-sm bg-accent text-white hover:opacity-90 transition"
        >
          {sort === "recenti" ? "Ordina: Vecchi" : "Ordina: Recenti"}
        </a>
      </div>

      {/* Lista articoli */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
        {articles.length === 0 && (
          <div className="col-span-full text-center text-sm opacity-70 py-10">
            Nessuna notizia disponibile.
          </div>
        )}
      </div>

      {/* Donazioni */}
      <section className="text-center pt-10 border-t border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Sostieni TuttoNews24</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-6">
          Servizio gratuito: puoi supportarci con una donazione. Importo
          consigliato: <strong>18,00 €</strong>.
        </p>
        <DonateButton />
      </section>
    </div>
  );
}
