import { notFound } from "next/navigation";
import { fetchSection } from "@/lib/news";
import { SECTIONS } from "@/config/sections";
import { NewsCard } from "@/components/NewsCard";

export const revalidate = 600;

export default async function SectionPage({ params }: { params: { slug: string }}) {
  const slug = params.slug;
  if (!(slug in SECTIONS)) return notFound();

  const items = await fetchSection(slug as keyof typeof SECTIONS, 20);
  return (
    <main>
      <h1 className="text-3xl font-bold mb-4 logo">{SECTIONS[slug as keyof typeof SECTIONS].label}</h1>
      <p className="opacity-70 mb-8">
        Fonti aggregate da feed pubblici. Clicca per leggere sul sito originale.
      </p>
      <div className="grid-news">
        {items.map((it) => <NewsCard key={it.id} it={it} />)}
      </div>
    </main>
  );
}
