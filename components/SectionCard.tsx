"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SECTIONS } from "@/config/sections";

export default function SectionCard({ slug, items }: { slug: keyof typeof SECTIONS; items: {title:string;source:string;}[] }) {
  const s = SECTIONS[slug];
  return (
    <motion.div whileHover={{ scale: 1.04 }} className="rounded-2xl bg-slate-900/80 border border-white/10 p-5 shadow-lg hover:shadow-2xl transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold">{s.label}</h3>
        <Link href={`/sezione/${slug}`} className="text-sm px-2 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white">Vai →</Link>
      </div>
      <ul className="space-y-1 text-sm">
        {items.slice(0,3).map((it, i) => (
          <li key={i} className="line-clamp-2 opacity-90">• {it.title} <span className="opacity-60">({it.source})</span></li>
        ))}
      </ul>
    </motion.div>
  );
}
