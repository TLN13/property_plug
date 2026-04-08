"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import type { Listing } from "@/lib/listing-format";

export default function SavedHomesSummaryCard() {
  const { user, isLoading } = useAuth();
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let ignore = false;

    const loadSavedListings = async () => {
      try {
        const response = await fetch(
          `/api/saved-listings?uid=${encodeURIComponent(user.uid)}`,
          { cache: "no-store" }
        );
        const data = (await response.json()) as {
          error?: string;
          listings?: Listing[];
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load saved listings.");
        }

        if (!ignore) {
          setCount(data.listings?.length ?? 0);
          setError(false);
        }
      } catch {
        if (!ignore) {
          setError(true);
        }
      }
    };

    void loadSavedListings();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  return (
    <Link
      href="/dashboard/user/saved-listings"
      className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C5A3C]"
    >
      <p className="text-sm text-[#8C5A3C]">Saved Homes</p>
      <h2 className="mt-2 text-2xl font-semibold">
        {isLoading ? "Loading..." : `${count} Favorite${count === 1 ? "" : "s"}`}
      </h2>
      <p className="mt-3 text-sm text-[#4B2E2B]">
        {error
          ? "We could not load your saved homes right now, but you can still open them here."
          : "Keep your favorite listings in one place and revisit them anytime."}
      </p>
    </Link>
  );
}
