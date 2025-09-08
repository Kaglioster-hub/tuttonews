import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchNews";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");

  try {
    const articles = await fetchNews(cat && cat !== "tutte" ? cat : null);

    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "s-maxage=120, stale-while-revalidate=60",
      },
    });
  } catch (e) {
    console.error("Errore API news:", e);
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
