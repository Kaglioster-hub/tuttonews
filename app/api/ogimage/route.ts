export const runtime = "nodejs";

import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

function pickFirst($: cheerio.CheerioAPI, ...sels: string[]) {
  for (const s of sels) {
    const el = $(s).first();
    const v = el.attr("content") || el.attr("href") || el.attr("src");
    if (v) return v.trim();
  }
  return undefined;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) return NextResponse.json({ error: "missing url" }, { status: 400 });

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(target, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 TuttoNews24",
        accept: "text/html,*/*",
      },
    });
    clearTimeout(to);
    if (!upstream.ok) return NextResponse.json({ error: "fetch failed" }, { status: 502 });

    const html = await upstream.text();
    const $ = cheerio.load(html);

    let src =
      pickFirst(
        $,
        'meta[property="og:image:secure_url"]',
        'meta[property="og:image"]',
        'meta[name="og:image"]',
        'meta[name="twitter:image:src"]',
        'meta[name="twitter:image"]',
        'link[rel="image_src"]'
      ) || $("img[src]").first().attr("src");

    if (!src) return new NextResponse(null, { status: 204 });
    src = new URL(src, upstream.url).toString();

    return new NextResponse(JSON.stringify({ src }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    clearTimeout(to);
    return NextResponse.json({ error: "scrape failed" }, { status: 500 });
  }
}
