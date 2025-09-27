// TN24 modern card v2
"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export type NewsItem = { id: string; title: string; link: string; source: string; description?: string; image?: string };

export function NewsCard({ it }: { it: NewsItem }) {
  return (
    <motion.article whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      className="news-card group rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative w-full h-52">
        <Image src={it.image || "/placeholder.jpg"} alt={it.title} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"/>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <Link href={it.link} target="_blank" rel="noopener noreferrer" className="block">
          <h3 className="news-title">{it.title}</h3>
        </Link>
        {it.description && <p className="snippet">{it.description}</p>}
        <div className="source">{it.source}</div>
      </div>
    </motion.article>
  );
}
