"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";

type SaveListingButtonProps = {
  listingId: string;
};

export default function SaveListingButton({ listingId }: SaveListingButtonProps) {
  const { user, isLoading } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let ignore = false;

    const loadSavedState = async () => {
      try {
        const response = await fetch(
          `/api/saved-listings?uid=${encodeURIComponent(user.uid)}&listingId=${encodeURIComponent(listingId)}`,
          { cache: "no-store" }
        );
        const data = (await response.json()) as { error?: string; saved?: boolean };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not check saved status.");
        }

        if (!ignore) {
          setIsSaved(Boolean(data.saved));
        }
      } catch (requestError) {
        if (!ignore) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Could not check saved status.";
          setError(message);
        }
      }
    };

    void loadSavedState();

    return () => {
      ignore = true;
    };
  }, [isLoading, listingId, user]);

  const handleSave = async () => {
    if (isLoading) {
      return;
    }

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (!isSaved) {
        const response = await fetch("/api/saved-listings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            listingId,
          }),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not save listing.");
        }
        setIsSaved(true);
        setMessage("Saved to your favorites.");
      } else {
        const response = await fetch("/api/saved-listings", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            listingId,
          }),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not remove listing.");
        }

        setIsSaved(false);
        setMessage("Removed from your favorites.");
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not update saved listing.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={handleSave}
        disabled={isSubmitting}
        className="inline-flex items-center gap-3 rounded-full border border-[#D6B79F] bg-[#FFF8F0] px-5 py-3 text-sm font-medium text-[#8C5A3C] transition hover:border-[#8C5A3C] hover:text-[#4B2E2B] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-xl leading-none" aria-hidden="true">
          {isSaved ? "♥" : "♡"}
        </span>
        <span>
          {isSubmitting ? "Saving..." : isSaved ? "Unsave Listing" : "Save Listing"}
        </span>
      </button>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-[#8C5A3C]">{message}</p> : null}
    </div>
  );
}
