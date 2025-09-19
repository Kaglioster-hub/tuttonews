"use client";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo TuttoNews" width={32} height={32} />
        <span className="logo">TuttoNews24</span>
      </div>
      <nav className="flex gap-4 text-sm">
        <Link href="/">Home</Link>
        <Link href="/sezione/cronaca">Cronaca</Link>
        <Link href="/sezione/politica">Politica</Link>
        <Link href="/sezione/economia">Economia</Link>
        <Link href="/sezione/sport">Sport</Link>
        <Link href="/sezione/esteri">Esteri</Link>
        <Link href="/sezione/cultura">Cultura</Link>
        <Link href="/sezione/tecnologia">Tecnologia</Link>
      </nav>
    </header>
  );
}
