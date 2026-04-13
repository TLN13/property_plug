"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import LogoutButton from "@/app/components/LogoutButton";
import SavedHomesSummaryCard from "@/app/components/SavedHomesSummaryCard";
import { useAuth } from "@/app/components/AuthProvider";
import { getScheduledToursForUser, getUserRole } from "@/app/firebase/firestore";
import type { Listing } from "@/lib/listing-format";
import { groupListingsByCity, type ListingCityGroup } from "@/lib/listing-map";

const ListingsCityMap = dynamic(() => import("@/app/components/ListingsCityMap"), {
  ssr: false,
});

export default function UserPage() {
  const { user, isLoading } = useAuth();
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [activeListingCount, setActiveListingCount] = useState<number | null>(null);
  const [scheduledTourCount, setScheduledTourCount] = useState<number | null>(null);
  const [cityGroups, setCityGroups] = useState<ListingCityGroup[]>([]);

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    let ignore = false;

    const loadRole = async () => {
      const nextRole = (await getUserRole(user.uid)) === "admin" ? "admin" : "user";

      if (!ignore) {
        setRole(nextRole);
      }

      if (nextRole !== "admin") {
        try {
          const tours = await getScheduledToursForUser(user.uid);

          if (!ignore) {
            setScheduledTourCount(tours.length);
          }
        } catch (error) {
          console.error("Failed to load scheduled tours:", error);

          if (!ignore) {
            setScheduledTourCount(0);
          }
        }

        return;
      }

      try {
        const response = await fetch("/api/listings/count", { cache: "no-store" });
        const data = (await response.json()) as {
          count?: number;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load active listing count.");
        }

        if (!ignore) {
          setActiveListingCount(data.count ?? 0);
        }
      } catch (error) {
        console.error("Failed to load active listing count:", error);

        if (!ignore) {
          setActiveListingCount(0);
        }
      }
    };

    void loadRole();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  useEffect(() => {
    let ignore = false;

    const loadListingsForMap = async () => {
      try {
        const response = await fetch("/api/listings", { cache: "no-store" });
        const data = (await response.json()) as {
          error?: string;
          listings?: Listing[];
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load listings for the map.");
        }

        if (!ignore) {
          setCityGroups(groupListingsByCity(data.listings ?? []));
        }
      } catch (error) {
        console.error("Failed to load listings for map:", error);

        if (!ignore) {
          setCityGroups([]);
        }
      }
    };

    void loadListingsForMap();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F0] px-6 text-lg font-medium text-[#4B2E2B]">
        Loading...
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <ProtectedRoute requiredRole="user" allowAdminAccess>
      <div className="min-h-screen bg-[#FFF8F0] px-4 py-8 text-[#4B2E2B] md:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col">
          <div className="flex flex-col gap-0">
            <div className="flex justify-center">
              <Image
                src="/dashboard_logo.png"
                alt="Property Plug dashboard logo"
                width={900}
                height={300}
                priority
                className="h-auto w-full max-w-[560px] object-contain"
              />
            </div>

            <div className="rounded-[2rem] bg-[#C08552] px-8 py-10 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#FFF8F0]">
                    Property Plug
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-[#FFF8F0]">
                    {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                    {isAdmin
                      ? "Manage active listings, monitor inventory, and keep day-to-day admin work organized in one place."
                      : "Track saved homes, manage scheduled tours, and explore listings across Alberta from one dashboard."}
                  </p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="flex flex-col gap-6">
              <SavedHomesSummaryCard />
              {isAdmin ? (
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#8C5A3C]">Listings</p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {activeListingCount ?? "..."} Active Listings
                  </h2>
                  <p className="mt-3 text-sm text-[#4B2E2B]">
                    Track inventory, publish status, and listing visibility from one place.
                  </p>
                </div>
              ) : (
                <Link
                  href="/dashboard/user/tours-scheduled"
                  className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C5A3C]"
                >
                  <p className="text-sm text-[#8C5A3C]">Tours</p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {scheduledTourCount ?? "..."} Scheduled
                  </h2>
                  <p className="mt-3 text-sm text-[#4B2E2B]">
                    Open your calendar, manage upcoming visits, and jump back into the
                    listing details.
                  </p>
                </Link>
              )}
              <Link
                href="/dashboard/user/financial-tools"
                className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C5A3C]"
              >
                <p className="text-sm text-[#8C5A3C]">Financial Tools</p>
                <h2 className="mt-2 text-2xl font-semibold">Mortgage Calculator</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Estimate payments, compare down payments, and use the latest
                  Bank of Canada rate.
                </p>
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <Link
                href="/listings"
                className="rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8C5A3C]"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                  Search
                </p>
                <h2 className="mt-3 text-2xl font-semibold">Your search starts here</h2>
                <p className="mt-3 max-w-3xl text-sm text-[#4B2E2B]">
                  Browse current listings, compare neighborhoods, and narrow in on homes
                  that match your budget, layout, and location goals.
                </p>
              </Link>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                  Alberta Map
                </p>
                <h2 className="mt-3 text-2xl font-semibold">Browse Homes by City</h2>
                <p className="mt-3 max-w-3xl text-sm text-[#4B2E2B]">
                  Each marker shows how many listings are available in that city. Open a
                  marker to jump straight to a property details page.
                </p>
                <div className="mt-6">
                  {cityGroups.length > 0 ? (
                    <ListingsCityMap cityGroups={cityGroups} />
                  ) : (
                    <div className="flex h-[380px] items-center justify-center rounded-3xl border border-[#D6B79F] bg-[#FFF8F0] px-6 text-center text-sm text-[#4B2E2B]">
                      Add listings with Alberta city names in the location field to see
                      them appear on the map.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
