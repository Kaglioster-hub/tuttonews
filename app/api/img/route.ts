export const runtime = "nodejs";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) return new Response("missing src", { status: 400 });

  const upstream = await fetch(src, { redirect: "follow" });
  if (!upstream.ok) return new Response("upstream error", { status: 502 });

  const headers = new Headers(upstream.headers);
  headers.set("cache-control", "s-maxage=86400, stale-while-revalidate=604800");
  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  return new Response(upstream.body, { status: 200, headers });
}
