"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

type SaveListingBadgeProps = {
  initialSaved: boolean;
  listingId: string;
  onSavedChange?: (saved: boolean) => void;
};

export default function SaveListingBadge({
  initialSaved,
  listingId,
  onSavedChange,
}: SaveListingBadgeProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleToggleSaved = async () => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/saved-listings", {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isSaved
            ? {
                uid: user.uid,
                listingId,
              }
            : {
                uid: user.uid,
                email: user.email,
                listingId,
              }
        ),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not update saved listing.");
      }

      const nextSaved = !isSaved;
      setIsSaved(nextSaved);
      onSavedChange?.(nextSaved);
    } catch (error) {
      console.error("Failed to toggle saved listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleToggleSaved()}
      disabled={isSubmitting}
      className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#FFF8F0]/95 px-3 py-2 text-sm font-medium text-[#8C5A3C] shadow-sm transition hover:bg-white hover:text-[#4B2E2B] disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={isSaved ? "Remove from saved listings" : "Save listing"}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {isSaved ? "♥" : "♡"}
      </span>
      <span>{isSubmitting ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
    </button>
  );
}
