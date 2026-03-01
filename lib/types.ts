export type Platform = "reddit" | "tiktok" | "linkedin" | "twitter" | "unknown";

export interface BrandContext {
  productDescription: string;
  valueProps: string[];
  voiceTone: string;
  targetAudience: string;
}

export interface ThreadContext {
  platform: Platform;
  postContent: string;
  topComments: string[];
  engagementSignals: string;
}

export interface CommunityIntelligence {
  demographic: string;
  tone: {
    adjectives: string[];
    formality: "formal" | "casual" | "technical" | "mixed";
    humorRegister: string;
    cynicismLevel: "low" | "medium" | "high";
    emojiUsage: "none" | "rare" | "moderate" | "heavy";
  };
  language: {
    vocabulary: string[];
    memes: string[];
    avoidPhrases: string[];
  };
  formats: {
    highTraction: string[];
    avoidFormats: string[];
  };
  hooks: string[];
}

export interface ResponseOption {
  text: string;
  hook: string;
  rationale: string;
}

export interface ResponsesOutput {
  responses: [ResponseOption, ResponseOption, ResponseOption];
}

export interface AnalysisResult {
  brand: BrandContext;
  thread: ThreadContext;
  intelligence: CommunityIntelligence;
  responses: ResponseOption[];
}

export interface ShareData {
  responses: ResponseOption[];
  brandUrl: string;
  threadUrl: string;
}
