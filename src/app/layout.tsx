import "./globals.css";
export const metadata = { title: "TuttoNews24" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark">
      <body>{children}</body>
    </html>
  );
}

