import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "TuttoNews24",
  description: "Le ultime notizie aggregate dai quotidiani italiani",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" >
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500"><div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <Header/>
        {children}
        <Footer/></div>
      </body>
    </html>
  );
}






