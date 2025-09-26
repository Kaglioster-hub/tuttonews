"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { NewsItem } from "@/lib/news";

export function NewsCard({ it }: { it: NewsItem }) {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="news-card group rounded-2xl overflow-hidden shadow-lg border border-neutral-800 hover:border-red-500/60 transition-all duration-300 bg-neutral-900/80 backdrop-blur-sm"
    >
      {/* Immagine + overlay */}
      <div className="relative w-full h-52">
        <Image
          src={it.image || "/placeholder.jpg"}
          alt={it.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <span className="absolute top-3 left-3 bg-red-600/90 text-white text-xs px-2 py-1 rounded-md shadow">
          {it.category || "News"}
        </span>
      </div>

      {/* Contenuto: ora è nel flusso, così Masonry misura l'altezza giusta */}
      <div className="p-4 text-slate-200 flex flex-col gap-2">
        <Link
          href={it.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="font-semibold text-lg leading-snug line-clamp-2 group-hover:text-red-400">
            {it.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-300/90 line-clamp-3">
          {it.description}
        </p>

        <span className="text-xs text-red-400 mt-auto">{it.source}</span>
      </div>
    </motion.article>
  );
}
