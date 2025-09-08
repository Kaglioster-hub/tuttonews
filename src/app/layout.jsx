import "./../styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "TuttoNews24",
  description: "Notizie 24/7 aggregate dalle maggiori testate italiane",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="bg-light dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
