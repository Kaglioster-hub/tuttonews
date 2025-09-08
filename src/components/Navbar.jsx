"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const categories = ["tutte", "cronaca", "politica", "economia", "sport", "esteri", "cultura", "tecnologia"];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary">TuttoNews24</Link>
        <div className="flex gap-4">
          {categories.map(c => (
            <Link key={c} href={c === "tutte" ? "/" : `/${c}`} className="hover:text-primary capitalize">
              {c}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
