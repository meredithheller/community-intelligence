import type { Platform } from "./types";

export function detectPlatform(url: string): Platform {
  if (/news\.ycombinator\.com\/item\?id=\d+/.test(url)) return "hackernews";
  if (/reddit\.com\/r\/[^/]+\/comments\//.test(url)) return "reddit";
  if (/tiktok\.com\/@[^/]+\/video\//.test(url)) return "tiktok";
  if (/linkedin\.com\/(posts|pulse)\//.test(url)) return "linkedin";
  if (/(twitter\.com|x\.com)\/[^/]+\/status\//.test(url)) return "twitter";
  return "unknown";
}
