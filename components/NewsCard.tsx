"use client";
import Link from "next/link";

export function NewsCard({ it }: { it: any }) {
  return (
    <Link
      href={it.link}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card"
    >
      <div>
        <h3>{it.title}</h3>
        <p>{it.description}</p>
      </div>
      <span>{it.source}</span>
    </Link>
  );
}
