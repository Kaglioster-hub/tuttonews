"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/sezione/cronaca", label: "Cronaca" },
  { href: "/sezione/politica", label: "Politica" },
  { href: "/sezione/economia", label: "Economia" },
  { href: "/sezione/sport", label: "Sport" },
  { href: "/sezione/esteri", label: "Esteri" },
  { href: "/sezione/cultura", label: "Cultura" },
  { href: "/sezione/tecnologia", label: "Tecnologia" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Chiudi il menu quando cambia rotta
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div className="navbar border-b"
           style={{ backdropFilter: "blur(14px) saturate(140%)" }}>
        <div className="mx-auto w-full max-w-6xl">
          {/* Riga principale: hamburger / brand centrato / azioni */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[64px] gap-2">
            {/* Hamburger (mobile) */}
            <button
              aria-label="Apri menu"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="md:hidden justify-self-start inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-transparent
                         hover:border-[color:var(--border)]"
            >
              <span className="relative w-6 h-3.5">
                <span className={`absolute inset-x-0 top-0 h-0.5 bg-[color:var(--text)] transition-all ${open ? "translate-y-1.75 rotate-45" : ""}`} />
                <span className={`absolute inset-x-0 top-1.75 h-0.5 bg-[color:var(--text)] transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute inset-x-0 top-3.5 h-0.5 bg-[color:var(--text)] transition-all ${open ? "-translate-y-1.75 -rotate-45" : ""}`} />
              </span>
              <span className="text-sm">Menu</span>
            </button>

            {/* Brand centrato */}
            <div className="justify-self-center">
              <Link href="/" className="block text-center">
                <span className="block font-serif text-2xl sm:text-3xl u-gold-text">TuttoNews24</span>
                <span className="hidden sm:block text-xs text-[color:var(--muted)]">
                  Le ultime notizie dalle principali testate italiane
                </span>
              </Link>
            </div>

            {/* Placeholder azioni a destra (es. cerca o toggle tema) */}
            <div className="justify-self-end flex items-center gap-2">
              {/* Esempio: slot per future azioni */}
            </div>
          </div>

          {/* Nav desktop (centrato, pill) */}
          <nav className="hidden md:flex justify-center pb-2">
            <ul className="menu menu-pills flex flex-wrap justify-center gap-1.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="px-3.5 py-1.5 rounded-full text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Drawer mobile */}
      <nav
        id="mobile-menu"
        className={`md:hidden overflow-hidden border-b border-[color:var(--border)] 
                    bg-[color:var(--bg)]
                    transition-[max-height,opacity] duration-300
                    ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="px-3 py-2 grid gap-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="block px-3.5 py-2 rounded-xl hover:bg-[color:color-mix(in_oklab,var(--gold-2)_14%,transparent)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
