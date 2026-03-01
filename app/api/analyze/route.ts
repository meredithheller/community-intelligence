import { NextRequest, NextResponse } from "next/server";
import { crawlUrl } from "@/lib/exa";
import { completeJSON } from "@/lib/anthropic";
import {
  brandExtractionPrompt,
  threadExtractionPrompt,
} from "@/lib/prompts";
import { detectPlatform } from "@/lib/platform";
import type { BrandContext, ThreadContext } from "@/lib/types";

interface AnalyzeRequest {
  brandUrl: string;
  threadUrl: string;
}

interface AnalyzeResponse {
  brand: BrandContext;
  thread: ThreadContext;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const { brandUrl, threadUrl } = body;

    if (!brandUrl || !threadUrl) {
      return NextResponse.json(
        { error: "brandUrl and threadUrl are required" },
        { status: 400 }
      );
    }

    const platform = detectPlatform(threadUrl);

    // Parallel crawl both URLs
    const [brandContent, threadContent] = await Promise.all([
      crawlUrl(brandUrl),
      crawlUrl(threadUrl),
    ]);

    // Parallel extraction
    const [brand, thread] = await Promise.all([
      completeJSON<BrandContext>(brandExtractionPrompt(brandContent)),
      completeJSON<ThreadContext>(
        threadExtractionPrompt(threadContent, platform)
      ),
    ]);

    const response: AnalyzeResponse = { brand, thread };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
