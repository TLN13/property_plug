"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import SaveListingBadge from "@/app/components/SaveListingBadge";
import { useAuth } from "@/app/components/AuthProvider";
import type { Listing } from "@/lib/listing-format";
import { formatListingPrice } from "@/lib/listing-format";

type ListingsGridProps = {
  listings: Listing[];
};

export default function ListingsGrid({ listings }: ListingsGridProps) {
  const { user, isLoading } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isLoading || !user) {
      setSavedIds(new Set());
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
          setSavedIds(new Set((data.listings ?? []).map((listing) => listing.id)));
        }
      } catch {
        if (!ignore) {
          setSavedIds(new Set());
        }
      }
    };

    void loadSavedListings();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {listings.map((listing) => {
        const isSaved = savedIds.has(listing.id);

        return (
          <div
            key={listing.id}
            className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative">
              <Image
                src={listing.image}
                alt={listing.title}
                width={1200}
                height={800}
                className="h-52 w-full object-cover"
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <SaveListingBadge
                initialSaved={isSaved}
                listingId={listing.id}
                onSavedChange={(nextSaved) => {
                  setSavedIds((current) => {
                    const next = new Set(current);

                    if (nextSaved) {
                      next.add(listing.id);
                    } else {
                      next.delete(listing.id);
                    }

                    return next;
                  });
                }}
              />
            </div>

            <div className="p-5">
              <h2 className="mb-2 text-xl font-semibold text-[#4B2E2B]">{listing.title}</h2>

              <p className="mb-1 text-lg font-bold text-[#8C5A3C]">
                {formatListingPrice(listing.price)}
              </p>

              <p className="mb-4 text-sm text-gray-600">{listing.location}</p>

              <div className="mb-4 flex gap-4 text-sm text-gray-700">
                <span>{listing.bedrooms} Beds</span>
                <span>{listing.bathrooms} Baths</span>
              </div>

              <Link
                href={`/listings/${listing.id}`}
                className="inline-block rounded-lg bg-[#8C5A3C] px-4 py-2 text-white transition hover:bg-[#4B2E2B]"
              >
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
