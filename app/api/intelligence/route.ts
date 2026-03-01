import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/anthropic";
import { communityIntelligencePrompt } from "@/lib/prompts";
import type { ThreadContext, CommunityIntelligence } from "@/lib/types";

interface IntelligenceRequest {
  thread: ThreadContext;
}

interface IntelligenceResponse {
  intelligence: CommunityIntelligence;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IntelligenceRequest;
    const { thread } = body;

    if (!thread) {
      return NextResponse.json(
        { error: "thread is required" },
        { status: 400 }
      );
    }

    // Combine thread content for analysis
    const threadContent = [
      `Post: ${thread.postContent}`,
      `Comments:\n${thread.topComments.join("\n")}`,
      `Engagement: ${thread.engagementSignals}`,
    ].join("\n\n");

    const intelligence = await completeJSON<CommunityIntelligence>(
      communityIntelligencePrompt(threadContent, thread.platform)
    );

    const response: IntelligenceResponse = { intelligence };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
