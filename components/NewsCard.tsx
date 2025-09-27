"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export type NewsItem = {
  id?: string;
  title: string;
  link: string;
  source: string;
  description?: string;
  image?: string;
  enclosure?: { url?: string };
  ["media:content"]?: { url?: string } | Array<{ url?: string }>;
};

function firstDefined<T>(...v: (T | undefined | null)[]) { return v.find(Boolean) as T | undefined; }
function fromFeedMedia(it: NewsItem) {
  const m = it["media:content"];
  if (Array.isArray(m)) return m.find(x => x?.url)?.url;
  return m?.url;
}

export function NewsCard({ it }: { it: NewsItem }) {
  const initial = useMemo(
    () => firstDefined(it.image, it.enclosure?.url, fromFeedMedia(it)),
    [it]
  );
  const [img, setImg] = useState<string | null>(initial ?? null);

  useEffect(() => {
    if (img || !it.link) return;
    const ctrl = new AbortController();
    fetch(`/api/ogimage?url=${encodeURIComponent(it.link)}`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        const found: string | undefined = d?.src;
        if (found) setImg(`/api/img?src=${encodeURIComponent(found)}`);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [it.link, img]);

  return (
    <article className="card news-card rounded-2xl border border-[color:var(--border)] bg-white shadow-soft overflow-hidden">
      <div className="news-media relative aspect-[16/9] bg-black/5">
        {img ? (
          <Image
            src={img}
            alt={it.title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          />
        ) : (
          <div className="skeleton w-full h-full" />
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="news-title">
          <Link href={it.link} target="_blank" rel="noopener noreferrer">{it.title}</Link>
        </h3>
        {it.description && <p className="snippet">{it.description}</p>}
        <div className="source">{it.source}</div>
      </div>
    </article>
  );
}

export default NewsCard;

