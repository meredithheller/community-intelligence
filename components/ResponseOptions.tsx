"use client";

import { useState } from "react";
import type { ResponseOption } from "@/lib/types";

interface Props {
  responses: ResponseOption[];
  shareUrl?: string;
}

export default function ResponseOptions({ responses, shareUrl }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  async function copyToClipboard(text: string, index: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  async function copyShareUrl() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  }

  async function copyAll() {
    const text = responses
      .map(
        (r, i) =>
          `${i + 1}. [${r.hook}]: ${r.text}\n   Why it works: ${r.rationale}`
      )
      .join("\n\n");
    const full = `Response options\n\n${text}`;
    await navigator.clipboard.writeText(full);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex gap-2 justify-end">
        {shareUrl && (
          <button
            onClick={copyShareUrl}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {copiedShare ? "Link copied!" : "Share link"}
          </button>
        )}
        <button
          onClick={copyAll}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {copiedAll ? "Copied!" : "Copy all"}
        </button>
      </div>

      {/* Individual responses */}
      {responses.map((option, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3">
                {option.hook}
              </span>
              <p className="text-gray-900 text-base leading-relaxed font-medium mb-3">
                {option.text}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed italic">
                {option.rationale}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(option.text, index)}
              className="flex-shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Copy to clipboard"
            >
              {copiedIndex === index ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
