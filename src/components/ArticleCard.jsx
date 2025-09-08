"use client";  // 👈 importantissimo

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

export default function ArticleCard({ article }) {
  if (!article) return null;

  const source = article.source || "news";
  const favicon = `https://www.google.com/s2/favicons?domain=${source}&sz=128`;
  const img = article.image || null;

  let timeAgo = "data non disponibile";
  try {
    if (article.date) {
      timeAgo =
        formatDistanceToNow(new Date(article.date), { locale: it }) + " fa";
    }
  } catch {}

  return (
    <div className="relative rounded-2xl shadow-card bg-white dark:bg-gray-900 p-4 hover:shadow-glow transition">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center overflow-hidden">
        <Image src={favicon} alt={source} width={24} height={24} />
      </div>

      <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
        {img ? (
          <Image
            src={img}
            alt={article.title || "Immagine notizia"}
            width={640}
            height={360}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="text-gray-500 text-sm">Nessuna immagine</div>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-4 leading-snug">
        <Link
          href={article.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {article.title || "Titolo non disponibile"}
        </Link>
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {article.category?.toUpperCase() || "ALTRO"} · {timeAgo}
      </p>
    </div>
  );
}
