import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/anthropic";
import { responseGenerationPrompt, guardrailPrompt } from "@/lib/prompts";
import type {
  BrandContext,
  CommunityIntelligence,
  ResponseOption,
  ResponsesOutput,
  Platform,
} from "@/lib/types";

interface ResponsesRequest {
  brand: BrandContext;
  intelligence: CommunityIntelligence;
  platform: Platform;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ResponsesRequest;
    const { brand, intelligence, platform } = body;

    if (!brand || !intelligence) {
      return NextResponse.json(
        { error: "brand and intelligence are required" },
        { status: 400 }
      );
    }

    const resolvedPlatform = platform ?? "unknown";

    // Stage A: generate 3 responses
    const generated = await completeJSON<ResponsesOutput>(
      responseGenerationPrompt(brand, intelligence, resolvedPlatform)
    );

    // Stage B: guardrail review — catches and rewrites any violations
    const reviewed = await completeJSON<ResponsesOutput>(
      guardrailPrompt(generated.responses as ResponseOption[], brand, resolvedPlatform)
    );

    return NextResponse.json({ responses: reviewed.responses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
