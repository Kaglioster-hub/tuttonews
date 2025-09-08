import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchNews";

export const runtime = "nodejs"; // edge no, meglio Node

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("cat");

    const articles = await fetchNews(cat && cat !== "tutte" ? cat : null);

    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=150"
      }
    });
  } catch (err) {
    console.error("API /news crash:", err);
    return NextResponse.json(
      { error: "Errore fetch notizie", details: err.message },
      { status: 500 }
    );
  }
}
