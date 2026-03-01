"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import IntelligenceCard from "@/components/IntelligenceCard";
import ResponseOptions from "@/components/ResponseOptions";
import {
  SkeletonIntelligenceCard,
  SkeletonResponseOptions,
} from "@/components/LoadingSkeletons";
import type {
  BrandContext,
  ThreadContext,
  CommunityIntelligence,
  ResponseOption,
  ShareData,
} from "@/lib/types";

type Stage = "analyze" | "intelligence" | "responses" | "done" | "error";

const STAGE_META: Record<
  Exclude<Stage, "done" | "error">,
  { label: string; sub: string }
> = {
  analyze: {
    label: "Fetching content",
    sub: "Crawling your brand and the community thread",
  },
  intelligence: {
    label: "Reading the community",
    sub: "Mapping tone, language, and what resonates here",
  },
  responses: {
    label: "Writing responses",
    sub: "Translating your brand voice into community-native comments",
  },
};

const ALL_STEPS = ["analyze", "intelligence", "responses"] as const;

function StageIndicator({ stage }: { stage: Stage }) {
  if (stage === "done" || stage === "error") return null;
  const meta = STAGE_META[stage];
  const currentIndex = ALL_STEPS.indexOf(stage);

  return (
    <div className="mb-8 rounded-2xl border border-indigo-100 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
          <p className="text-xs text-gray-500">{meta.sub}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {ALL_STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i < currentIndex
                ? "bg-indigo-500"
                : i === currentIndex
                ? "bg-indigo-300 animate-pulse"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function SharedView({ shareParam }: { shareParam: string }) {
  let data: ShareData;
  try {
    data = JSON.parse(decodeURIComponent(atob(shareParam))) as ShareData;
  } catch {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid share link
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            This link appears to be corrupted or expired.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Analyze your brand
          </Link>
        </div>
      </main>
    );
  }

  const { responses, brandUrl, threadUrl } = data;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-block mb-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 uppercase tracking-widest">
            AirOps
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Response Options
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {getDomain(brandUrl)}
            </span>
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {getDomain(threadUrl)}
            </span>
          </div>
        </div>

        {/* Responses */}
        <section>
          <ResponseOptions responses={responses} />
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-center">
          <p className="text-sm font-semibold text-indigo-900 mb-1">
            Want responses like these for your brand?
          </p>
          <p className="text-sm text-indigo-700 mb-4">
            Paste your brand URL and any community thread to get started.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Analyze your brand →
          </Link>
        </div>
      </div>
    </main>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const { isSignedIn, user } = useUser();

  const shareParam = searchParams.get("share");
  if (shareParam) {
    return <SharedView shareParam={shareParam} />;
  }

  const brandUrl = searchParams.get("brandUrl") ?? "";
  const threadUrl = searchParams.get("threadUrl") ?? "";

  const [stage, setStage] = useState<Stage>("analyze");
  const [errorMessage, setErrorMessage] = useState("");

  const [intelligence, setIntelligence] = useState<CommunityIntelligence | null>(null);
  const [responses, setResponses] = useState<ResponseOption[] | null>(null);
  const [platform, setPlatform] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!brandUrl || !threadUrl) return;

    async function run() {
      try {
        // Stage 1: Analyze
        setStage("analyze");
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandUrl, threadUrl }),
        });
        if (!analyzeRes.ok) {
          const data = await analyzeRes.json() as { error?: string };
          throw new Error(data.error ?? "Failed to analyze URLs");
        }
        const { brand, thread } = await analyzeRes.json() as {
          brand: BrandContext;
          thread: ThreadContext;
        };
        setPlatform(thread.platform);

        // Stage 2: Community intelligence
        setStage("intelligence");
        const intelRes = await fetch("/api/intelligence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thread }),
        });
        if (!intelRes.ok) {
          const data = await intelRes.json() as { error?: string };
          throw new Error(data.error ?? "Failed to generate intelligence");
        }
        const { intelligence: intel } = await intelRes.json() as {
          intelligence: CommunityIntelligence;
        };
        setIntelligence(intel);

        // Stage 3: Responses
        setStage("responses");
        const respRes = await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, intelligence: intel, platform: thread.platform }),
        });
        if (!respRes.ok) {
          const data = await respRes.json() as { error?: string };
          throw new Error(data.error ?? "Failed to generate responses");
        }
        const { responses: resps } = await respRes.json() as {
          responses: ResponseOption[];
        };
        setResponses(resps);

        // Generate share URL
        const shareData: ShareData = { responses: resps, brandUrl, threadUrl };
        const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
        setShareUrl(`${window.location.origin}/results?share=${encoded}`);

        setStage("done");

        // Set free-use cookie (30 days) to gate subsequent anonymous attempts
        document.cookie = "cv_free_used=1; path=/; max-age=2592000; SameSite=Lax";

        // Mark conversion in Clerk metadata (signed-in users only, once)
        if (isSignedIn && !user?.publicMetadata?.converted) {
          fetch("/api/mark-converted", { method: "POST" }).catch(() => {});
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Unexpected error");
        setStage("error");
      }
    }

    run();
  }, [brandUrl, threadUrl]);

  if (stage === "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Try again
          </Link>
        </div>
      </main>
    );
  }

  const isLoading = stage !== "done";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-block mb-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              AirOps
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Community Intelligence
            </h1>
            {platform && (
              <p className="text-sm text-gray-500 mt-1 capitalize">
                Platform: {platform}
              </p>
            )}
          </div>
          {!isLoading && (
            <Link href="/" className="text-sm text-indigo-600 hover:underline">
              Analyze another
            </Link>
          )}
        </div>

        {/* Stage indicator — only during loading */}
        {isLoading && <StageIndicator stage={stage} />}

        {/* Intelligence section — skeleton until stage 3+ */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Community Intelligence Summary
          </h2>
          {intelligence ? (
            <IntelligenceCard intelligence={intelligence} />
          ) : (
            <SkeletonIntelligenceCard />
          )}
        </section>

        {/* Responses section — skeleton until done */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            3 Channel-Native Response Options
          </h2>
          {responses ? (
            <ResponseOptions responses={responses} shareUrl={shareUrl ?? undefined} />
          ) : (
            <SkeletonResponseOptions />
          )}
        </section>

        {/* AirOps CTA — only when done */}
        {!isLoading && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-center">
            <p className="text-sm font-semibold text-indigo-900 mb-1">
              Want to scale this across every community?
            </p>
            <p className="text-sm text-indigo-700 mb-4">
              AirOps helps growth teams build AI-powered content workflows at scale.
            </p>
            <a
              href="https://airops.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Explore AirOps
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
