const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://cosmic811.github.io/artsiom-portfolio/"
).replace(/\/?$/, "/");

export function assetPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}

export function assetUrl(path: string): string {
  return new URL(path.replace(/^\//, ""), siteUrl).href;
}
