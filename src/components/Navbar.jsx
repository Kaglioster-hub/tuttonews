"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { key: "tutte", label: "Tutte" },
  { key: "cronaca", label: "Cronaca" },
  { key: "politica", label: "Politica" },
  { key: "economia", label: "Economia" },
  { key: "sport", label: "Sport" },
  { key: "esteri", label: "Esteri" },
  { key: "cultura", label: "Cultura" },
  { key: "tecnologia", label: "Tecnologia" },
];

export default function Navbar() {
  const sp = useSearchParams();
  const active = sp.get("cat") || "tutte";

  return (
    <nav className="flex items-center gap-3">
      {CATEGORIES.map((c) => {
        const href = c.key === "tutte" ? "/" : `/?cat=${c.key}`;
        const isActive = active === c.key;
        return (
          <Link
            key={c.key}
            href={href}
            prefetch
            aria-current={isActive ? "page" : undefined}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              isActive
                ? "bg-primary text-white shadow-glow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}
