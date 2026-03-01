"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

interface Props {
  onAuthenticated: () => void;
  onClose: () => void;
}

export default function AuthModal({ onAuthenticated, onClose }: Props) {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) onAuthenticated();
  }, [isSignedIn, onAuthenticated]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
        <div className="px-8 pt-8 pb-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            One more analysis? Sign in to continue.
          </h2>
        </div>
        <div className="flex justify-center pb-8">
          <SignIn routing="hash" />
        </div>
      </div>
    </div>
  );
}
