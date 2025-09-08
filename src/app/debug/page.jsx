// src/app/debug/page.jsx
export const runtime = "edge";
export const dynamic = "force-dynamic";

import { fetchNews } from "@/lib/fetchNews";

export default async function DebugPage(props) {
  const sp =
    props?.searchParams && typeof props.searchParams.then === "function"
      ? await props.searchParams
      : props?.searchParams || {};

  const cat = sp?.cat || "tutte";       // es: ?cat=cronaca
  const n = Math.max(1, Math.min(100, parseInt(sp?.n, 10) || 20)); // es: ?n=30

  let articles = [];
  let error = null;
  try {
    articles = await fetchNews(cat !== "tutte" ? cat : null);
  } catch (e) {
    error = e?.message || "Errore sconosciuto";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">/debug – fetchNews()</h1>

      <div className="mb-4 text-sm">
        <p>Parametri: <code>?cat=cronaca|politica|…</code> · <code>?n=20</code></p>
        <p className="mt-1">
          API grezza:{" "}
          <a
            className="text-primary underline"
            href={`/api/news?cat=${encodeURIComponent(cat)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            /api/news?cat={cat}
          </a>
        </p>
      </div>

      {error && (
        <pre className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200 mb-4">
{`Errore: ${error}`}
        </pre>
      )}

      <pre className="text-xs whitespace-pre-wrap p-4 rounded bg-gray-900 text-green-400 overflow-x-auto">
{JSON.stringify(articles.slice(0, n), null, 2)}
      </pre>
    </div>
  );
}
