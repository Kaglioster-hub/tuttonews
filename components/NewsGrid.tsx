"use client";
import Masonry from "react-masonry-css";
import { NewsCard } from "@/components/NewsCard";
import { NewsItem } from "@/lib/news";

export function NewsGrid({ items }: { items: NewsItem[] }) {
  const breakpointColumnsObj = { default: 3, 1100: 2, 700: 1 };
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-6"
      columnClassName="masonry-column flex flex-col gap-6"
    >
      {items.map((it) => <NewsCard key={it.id} it={it} />)}
    </Masonry>
  );
}
