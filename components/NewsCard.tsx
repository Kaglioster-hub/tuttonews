"use client";
import Link from "next/link";

export function NewsCard({ it }: { it: any }) {
  return (
    <Link
      href={it.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block section-card hover:shadow-xl transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold mb-2 text-white hover:text-red-400 line-clamp-2">
        {it.title}
      </h3>
      <p className="text-sm text-gray-400 mb-3 line-clamp-3">{it.description}</p>
      <span className="text-xs text-red-400 font-medium">{it.source}</span>
    </Link>
  );
}
