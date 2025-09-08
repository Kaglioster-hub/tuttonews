// src/app/page.jsx
import ArticleCard from "@/components/ArticleCard";
import DonateButton from "@/components/DonateButton";
import { fetchNews } from "@/lib/fetchNews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home({ searchParams }) {
  const sort = searchParams?.sort || "recenti";
  const category = searchParams?.cat || "tutte";

  let articles = [];
  try {
    articles = await fetchNews(category !== "tutte" ? category : null);

    // ✅ Convertiamo le date in stringa ISO PRIMA di passarle a Client Components
    articles = articles.map((a) => ({
      ...a,
      date: a.date ? new Date(a.date).toISOString() : null,
    }));

    if (sort === "vecchi") {
      articles = [...articles].reverse();
    }
  } catch (err) {
    console.error("Errore fetchNews:", err);
  }

  return (
    <div className="space-y-10">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          TuttoNews24
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Le ultime notizie dalle principali testate italiane.
        </p>
      </header>

      {/* Lista articoli */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      <section className="text-center pt-10 border-t border-gray-300 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Sostieni TuttoNews24</h2>
        <DonateButton />
      </section>
    </div>
  );
}
