import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY!);

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

interface HnItem {
  id: number;
  author: string;
  title?: string;
  text?: string;
  points?: number;
  children?: HnItem[];
}

async function fetchHnThread(url: string): Promise<string> {
  const match = url.match(/[?&]id=(\d+)/);
  if (!match) throw new Error("Could not extract Hacker News item ID from URL");

  const id = match[1];
  const res = await fetch(`https://hn.algolia.com/api/v1/items/${id}`);
  if (!res.ok) throw new Error(`Hacker News API error: ${res.status}`);

  const item = await res.json() as HnItem;

  const lines: string[] = [
    `Title: ${item.title ?? "(no title)"}`,
    `Author: ${item.author}`,
    `Points: ${item.points ?? 0}`,
    "",
    stripHtml(item.text) || "(no post body)",
    "",
    "--- Comments ---",
  ];

  function extractComments(children: HnItem[], depth = 0): void {
    if (depth > 2) return; // limit nesting depth
    for (const child of children ?? []) {
      const indent = "  ".repeat(depth);
      const text = stripHtml(child.text);
      if (text) {
        lines.push(`\n${indent}${child.author} (points: ${child.points ?? 0}):\n${indent}${text}`);
      }
      if (child.children?.length) extractComments(child.children, depth + 1);
    }
  }

  extractComments(item.children ?? []);
  return lines.join("\n");
}

export async function crawlUrl(url: string): Promise<string> {
  if (/news\.ycombinator\.com\/item/.test(url)) {
    return fetchHnThread(url);
  }

  const results = await exa.getContents([url], {
    text: true,
    livecrawl: "always",
    filterEmptyResults: false,
  });

  const result = results.results[0];
  if (!result?.text) {
    throw new Error(`No content retrieved for URL: ${url}`);
  }

  return result.text;
}
