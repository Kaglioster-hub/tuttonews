import { fetchSection } from "@/lib/news";
import { SECTIONS, SectionKey } from "@/config/sections";
import SectionCard from "@/components/SectionCard";

export const revalidate = 600;

export default async function Home() {
  const keys = Object.keys(SECTIONS) as SectionKey[];
  const previews = await Promise.all(keys.map(async k => {
    const items = await fetchSection(k, 6);
    return [k, items] as const;
  }));

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">TuttoNews24</h1>
      <p className="text-center opacity-80 mb-10">Le ultime notizie dalle principali testate italiane</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {previews.map(([slug, items]) => (
          <SectionCard key={slug} slug={slug} items={items.map(i => ({ title: i.title, source: i.source }))} />
        ))}
      </div>
    </main>
  );
}
