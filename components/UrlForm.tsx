"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AuthModal from "./AuthModal";

export default function UrlForm() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [brandUrl, setBrandUrl] = useState("");
  const [threadUrl, setThreadUrl] = useState("");
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingParams, setPendingParams] = useState<string | null>(null);

  function isValidUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function hasFreeUsed(): boolean {
    return document.cookie.split(";").some((c) =>
      c.trim().startsWith("cv_free_used=")
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!brandUrl || !threadUrl) {
      setError("Both URLs are required.");
      return;
    }
    if (!isValidUrl(brandUrl) || !isValidUrl(threadUrl)) {
      setError("Please enter valid URLs for both fields.");
      return;
    }

    const params = new URLSearchParams({ brandUrl, threadUrl });

    if (hasFreeUsed() && !isSignedIn) {
      setPendingParams(params.toString());
      setShowAuthModal(true);
      return;
    }

    router.push(`/results?${params.toString()}`);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="brandUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Brand URL
          </label>
          <input
            id="brandUrl"
            type="url"
            placeholder="https://yourcompany.com"
            value={brandUrl}
            onChange={(e) => setBrandUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="threadUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Thread / Post URL
          </label>
          <input
            id="threadUrl"
            type="url"
            placeholder="https://reddit.com/r/saas/comments/..."
            value={threadUrl}
            onChange={(e) => setThreadUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
          <p className="text-xs text-gray-500">
            Works with Reddit, TikTok, LinkedIn, and Twitter/X
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          Analyze Community
        </button>
      </form>

      {showAuthModal && (
        <AuthModal
          onAuthenticated={() => {
            setShowAuthModal(false);
            if (pendingParams) {
              router.push(`/results?${pendingParams}`);
            }
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
