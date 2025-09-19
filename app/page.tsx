import { SECTIONS } from "@/config/sections";
import { fetchSection } from "@/lib/news";
import { NewsCard } from "@/components/NewsCard";

export default async function HomePage() {
  const data = await Promise.all(
    Object.keys(SECTIONS).map((key) =>
      fetchSection(key as keyof typeof SECTIONS, 6)
    )
  );

  return (
    <main>
      <h1 className="text-4xl font-bold mb-4 text-center logo">TuttoNews24</h1>
      <p className="text-center text-gray-400 mb-12">
        Le ultime notizie dalle principali testate italiane.
      </p>

      <div className="grid-news">
        {Object.keys(SECTIONS).map((key, i) =>
          data[i].map((it) => <NewsCard key={it.id} it={it} />)
        )}
      </div>
    </main>
  );
}
