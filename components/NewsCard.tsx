import { amazonSearchUrl, ibsSearchUrl, feltrinelliSearchUrl } from "@/config/affiliates";

export function NewsCard({ it }: { it: { title:string; link:string; source:string; date?:string; description?:string } }) {
  const q = it.title.replace(/["']/g,"");
  return (
    <article className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-1">{it.title}</h3>
      <div className="text-xs opacity-70 mb-2">{it.source}{it.date ? " • " + new Date(it.date).toLocaleString(): ""}</div>
      {it.description && <p className="text-sm opacity-90 mb-3 line-clamp-3">{it.description}</p>}
      <div className="flex flex-wrap gap-2">
        <a href={it.link} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-sm">Leggi sul sito</a>
        <a href={amazonSearchUrl(q)} target="_blank" rel="nofollow sponsored noopener" className="px-3 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-sm">Amazon</a>
        <a href={ibsSearchUrl(q)} target="_blank" rel="nofollow sponsored noopener" className="px-3 py-1 rounded bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-300 text-sm">IBS</a>
        <a href={feltrinelliSearchUrl(q)} target="_blank" rel="nofollow sponsored noopener" className="px-3 py-1 rounded bg-sky-400/20 hover:bg-sky-400/30 text-sky-300 text-sm">Feltrinelli</a>
      </div>
    </article>
  );
}
