import { fetchNews } from "@/lib/fetchNews";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  const articles = await fetchNews();
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map(a => <ArticleCard key={a.id} article={a} />)}
    </div>
  );
}
