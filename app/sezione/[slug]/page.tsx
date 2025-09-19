import { notFound } from "next/navigation";
import { fetchSection } from "@/lib/news";
import { SECTIONS } from "@/config/sections";
import { NewsCard } from "@/components/NewsCard";

export const revalidate = 600;

// @ts-expect-error Async params typing bug in Next.js 15
export default async function SectionPage({ params }: { params: { slug: string }}) {
  const slug = params.slug;
  if (!(slug in SECTIONS)) return notFound();

  const items = await fetchSection(slug as keyof typeof SECTIONS, 60);
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">
        {SECTIONS[slug as keyof typeof SECTIONS].label}
      </h1>
      <p className="opacity-70 mb-6">
        Fonti aggregate da feed pubblici. Clicca per leggere sul sito originale.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => <NewsCard key={it.id} it={it} />)}
      </div>
    </main>
  );
}
