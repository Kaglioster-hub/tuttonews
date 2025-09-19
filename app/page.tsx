import { SECTIONS } from "@/config/sections";
import { fetchSection } from "@/lib/news";
import { NewsCard } from "@/components/NewsCard";

export default async function HomePage() {
  const data = await Promise.all(
    Object.keys(SECTIONS).map((key) =>
      fetchSection(key as keyof typeof SECTIONS, 5)
    )
  );

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6 text-center text-white">TuttoNews24</h1>
      <p className="text-center text-gray-400 mb-12">
        Le ultime notizie dalle principali testate italiane.
      </p>

      <div className="grid-news">
        {Object.keys(SECTIONS).map((key, i) => (
          <div key={key}>
            <h2 className="text-xl font-semibold mb-4 text-white">
              {SECTIONS[key as keyof typeof SECTIONS].label}
            </h2>
            <div className="space-y-4">
              {data[i].map((it) => (
                <NewsCard key={it.id} it={it} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
