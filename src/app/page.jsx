// src/app/page.jsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { fetchNews } from "@/lib/fetchNews";
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

export default async function Home(props) {
  // ✅ compatibile Next 15
  let sp = {};
  try {
    if (props?.searchParams && typeof props.searchParams.then === "function") {
      sp = await props.searchParams;
    } else {
      sp = props?.searchParams || {};
    }
  } catch {
    sp = {};
  }

  const sort = sp.sort || "recenti";
  const category = sp.cat || null;

  let articles = [];
  let errorFetch = false;

  try {
    articles = await fetchNews(category && category !== "tutte" ? category : null);
    if (sort === "vecchi") {
      articles = [...articles].reverse();
    }
  } catch (e) {
    console.error("Errore fetchNews()", e);
    errorFetch = true;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          TuttoNews24
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Le ultime notizie dalle principali testate italiane, sempre aggiornate,
          senza dispersioni. <br />
          Clicca sugli articoli per leggerli direttamente sui siti originali.
        </p>
      </header>

      {/* Filtri */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((c) => (
          <a
            key={c.key}
            href={c.key === "tutte" ? "/" : `/?cat=${c.key}`}
            className={`px-4 py-2 rounded-full text-sm transition ${
              category === c.key || (!category && c.key === "tutte")
                ? "bg-primary text-white shadow-glow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {c.label}
          </a>
        ))}

        {/* Ordinamento */}
        <a
          href={`/?cat=${category || "tutte"}&sort=${
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

        {articles.length === 0 && !errorFetch && (
          <div className="col-span-full text-center text-sm opacity-70 py-10">
            Nessuna notizia al momento. Riprova tra poco.
          </div>
        )}

        {errorFetch && (
          <div className="col-span-full text-center text-red-500 py-10">
            Errore nel recupero delle notizie. Riprova più tardi.
          </div>
        )}
      </div>

      {/* Sezione Donazioni */}
      <section className="text-center pt-10 border-t border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Sostieni TuttoNews24</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-6">
          Offriamo un servizio gratuito, ma puoi supportarci con una donazione
          volontaria. L’importo consigliato è <strong>18,00 €</strong>.
        </p>
        <DonateButton />
      </section>
    </div>
  );
}
