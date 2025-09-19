export const AFF = {
  amazonTag: process.env.NEXT_PUBLIC_AMAZON_TAG || "",
  ibsCid: process.env.NEXT_PUBLIC_IBS_CID || "",
  feltrinelliCid: process.env.NEXT_PUBLIC_FELTRINELLI_CID || "",
};

export function amazonSearchUrl(q: string) {
  const u = new URL("https://www.amazon.it/s");
  u.searchParams.set("k", q);
  if (AFF.amazonTag) u.searchParams.set("tag", AFF.amazonTag);
  return u.toString();
}
export function ibsSearchUrl(q: string) {
  const u = new URL("https://www.ibs.it/Cerca");
  u.searchParams.set("q", q);
  if (AFF.ibsCid) u.searchParams.set("utm_source", AFF.ibsCid);
  return u.toString();
}
export function feltrinelliSearchUrl(q: string) {
  const u = new URL("https://www.lafeltrinelli.it/ricerca");
  u.searchParams.set("q", q);
  if (AFF.feltrinelliCid) u.searchParams.set("utm_source", AFF.feltrinelliCid);
  return u.toString();
}
