import { NextRequest, NextResponse } from "next/server";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 TuttoNews24Bot/1.0";

function pickMeta(html: string, names: string[]): string | null {
  for (const name of names) {
    // property="og:image" / name="twitter:image"
    const re1 = new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
    const m1 = html.match(re1);
    if (m1?.[1]) return m1[1];
    const re2 = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
    const m2 = html.match(re2);
    if (m2?.[1]) return m2[1];
  }
  return null;
}

export async function GET(req: NextRequest) {
  const pageUrl = req.nextUrl.searchParams.get("url");
  if (!pageUrl) return new NextResponse("Missing url", { status: 400 });

  try {
    const r = await fetch(pageUrl, {
      headers: { "user-agent": UA, "accept": "text/html,*/*" },
      // cache lato Edge (1h) + SWR
      next: { revalidate: 3600 }
    });
    const html = await r.text();

    let img = pickMeta(html, ["og:image", "og:image:url", "twitter:image", "twitter:image:src"]);
    if (img) {
      // risolve URL relativo rispetto alla pagina
      img = new URL(img, pageUrl).toString();
    }

    // se non trovata, manda il placeholder SVG
    if (!img) {
      const ph = new URL("/tn24-placeholder.svg", req.url);
      return NextResponse.redirect(ph, 302);
    }

    // Proxy dell'immagine per evitare hotlink/CORS
    const ir = await fetch(img, { headers: { "user-agent": UA } });
    if (!ir.ok || !ir.body) {
      const ph = new URL("/tn24-placeholder.svg", req.url);
      return NextResponse.redirect(ph, 302);
    }

    const ct = ir.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(ir.body, {
      status: 200,
      headers: {
        "content-type": ct,
        "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800"
      }
    });
  } catch {
    const ph = new URL("/tn24-placeholder.svg", req.url);
    return NextResponse.redirect(ph, 302);
  }
}
