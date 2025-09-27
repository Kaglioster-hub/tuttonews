"use client";
import Image from "next/image";
import Link from "next/link";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  description?: string;
  image?: string;
};

const og = (url: string) => `/api/og?url=${encodeURIComponent(url)}`;

export function NewsCard({ it }: { it: NewsItem }) {
  // Se già abbiamo una image assoluta, usala; altrimenti estraila via /api/og
  const imgSrc = it.image && /^https?:\/\//i.test(it.image) ? it.image : og(it.link);

  return (
    <article className="news-card">
      <div className="news-media relative">
        <Image
          src={imgSrc}
          alt={it.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <Link href={it.link} target="_blank" rel="noopener noreferrer" className="block">
          <h3 className="news-title">{it.title}</h3>
        </Link>

        {it.description && <p className="snippet">{it.description}</p>}

        <div className="source">{it.source}</div>
      </div>
    </article>
  );
}
