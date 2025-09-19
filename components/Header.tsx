"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggleTheme() {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme","dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme","light");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">
          TuttoNews
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/sezione/cronaca" className="hover:underline">Cronaca</Link>
          <Link href="/sezione/politica" className="hover:underline">Politica</Link>
          <Link href="/sezione/economia" className="hover:underline">Economia</Link>
          <button onClick={toggleTheme} className="ml-3 p-2 rounded-full hover:bg-slate-700/50">
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </nav>
      </div>
    </header>
  );
}
