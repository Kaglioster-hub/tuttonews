import "./../styles/globals.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "TuttoNews24 – powered by vrabo.it",
  description: "Notizie 24/7 aggregate dalle maggiori testate italiane. Sempre aggiornate, senza duplicati.",
  icons: {
    icon: "/logo.png", // favicon/logo
  },
  openGraph: {
    title: "TuttoNews24",
    description: "Notizie 24/7 aggregate dalle maggiori testate italiane",
    url: "https://tuttonews.vrabo.it",
    siteName: "TuttoNews24",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "TuttoNews24 logo",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Inserisci qui eventuali snippet analytics/ads */}
      </head>
      <body className="bg-light dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col min-h-screen">
        {/* Header con logo + navbar */}
        <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="TuttoNews24 logo"
                width={36}
                height={36}
                priority
              />
              <span className="font-extrabold text-lg tracking-tight text-primary">
                TuttoNews24
              </span>
            </Link>
            <Navbar />
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto flex-1 w-full px-4 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 py-6 mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} TuttoNews24 · Powered by{" "}
            <Link href="https://vrabo.it" className="hover:underline font-medium">
              vrabo.it
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/donate" className="text-primary hover:underline">
              Sostieni il progetto
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
