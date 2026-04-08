"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import SaveListingBadge from "@/app/components/SaveListingBadge";
import { formatListingPrice, type Listing } from "@/lib/listing-format";

export default function SavedListingsView() {
  const { user, isLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let ignore = false;

    const loadSavedListings = async () => {
      setIsFetching(true);
      setError("");

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
          setListings(data.listings ?? []);
        }
      } catch (requestError) {
        if (!ignore) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Could not load saved listings.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsFetching(false);
        }
      }
    };

    void loadSavedListings();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  if (isLoading || isFetching) {
    return (
      <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4B2E2B]">Loading saved listings...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4B2E2B]">
          We could not load your saved listings
        </h2>
        <p className="mt-3 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-[#4B2E2B]">No saved listings yet</h2>
        <p className="mt-3 max-w-2xl text-sm text-[#4B2E2B]">
          Tap the heart on any listing detail page and it will show up here the next time
          you come back.
        </p>
        <Link
          href="/listings"
          className="mt-6 inline-flex rounded-full bg-[#8C5A3C] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4B2E2B]"
        >
          Browse listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {listings.map((listing) => (
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
              initialSaved
              listingId={listing.id}
              onSavedChange={(nextSaved) => {
                if (!nextSaved) {
                  setListings((current) =>
                    current.filter((currentListing) => currentListing.id !== listing.id)
                  );
                }
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
      ))}
    </div>
  );
}
