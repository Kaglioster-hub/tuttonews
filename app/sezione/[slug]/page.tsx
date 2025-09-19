import { notFound } from "next/navigation";
import { fetchSection } from "@/lib/news";
import { SECTIONS } from "@/config/sections";
import { NewsCard } from "@/components/NewsCard";

export const revalidate = 600;

export default async function SectionPage({ params }: { params: { slug: string }}) {
  const slug = params.slug as keyof typeof SECTIONS;
  if (!SECTIONS[slug]) return notFound();

  const items = await fetchSection(slug, 60);
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">{SECTIONS[slug].label}</h1>
      <p className="opacity-70 mb-6">Fonti aggregate da feed pubblici. Clicca per leggere sul sito originale.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => <NewsCard key={it.id} it={it} />)}
      </div>
    </main>
  );
}
