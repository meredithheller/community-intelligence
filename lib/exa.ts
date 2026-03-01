import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY!);

// Try Reddit's JSON API first; fall back to Exa if the server IP is blocked (403/429)
async function fetchRedditThread(url: string): Promise<string> {
  const jsonUrl = url.replace(/\/?(\?.*)?$/, ".json");
  const res = await fetch(jsonUrl, {
    headers: {
      "User-Agent": "community-intelligence:v1.0 (growth research tool)",
      "Accept": "application/json",
    },
  });
  if (!res.ok) {
    // Vercel IPs are often blocked by Reddit — fall back to Exa livecrawl
    const results = await exa.getContents([url], {
      text: true,
      livecrawl: "always",
      filterEmptyResults: false,
    });
    const result = results.results[0];
    if (!result?.text) {
      throw new Error(`Could not retrieve Reddit thread content (status ${res.status})`);
    }
    return result.text;
  }

  const data = await res.json() as RedditApiResponse[];
  const post = data[0]?.data?.children?.[0]?.data;
  if (!post) throw new Error("Could not parse Reddit post");

  const lines: string[] = [
    `Title: ${post.title}`,
    `Subreddit: r/${post.subreddit}`,
    `Score: ${post.score} upvotes`,
    `Author: u/${post.author}`,
    "",
    post.selftext || "(no post body)",
    "",
    "--- Comments ---",
  ];

  const comments = data[1]?.data?.children ?? [];
  for (const child of comments) {
    if (child.kind !== "t1") continue;
    const c = child.data;
    lines.push(`\nu/${c.author} (score: ${c.score}):\n${c.body}`);
    // Include top-level replies
    const replies = c.replies?.data?.children ?? [];
    for (const reply of replies) {
      if (reply.kind !== "t1") continue;
      lines.push(`  → u/${reply.data.author} (score: ${reply.data.score}): ${reply.data.body}`);
    }
  }

  return lines.join("\n");
}

export async function crawlUrl(url: string): Promise<string> {
  if (/reddit\.com\/r\//.test(url)) {
    return fetchRedditThread(url);
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

// Reddit JSON API types
interface RedditApiResponse {
  data: {
    children: RedditChild[];
  };
}

interface RedditChild {
  kind: string;
  data: RedditPost & RedditComment;
}

interface RedditPost {
  title: string;
  subreddit: string;
  score: number;
  author: string;
  selftext: string;
}

interface RedditComment {
  author: string;
  score: number;
  body: string;
  replies?: RedditApiResponse;
}
