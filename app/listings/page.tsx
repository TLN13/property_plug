import Link from "next/link";
import Image from "next/image";
import AdminListingsHeaderActions from "@/app/components/AdminListingsHeaderActions";
import ListingsGrid from "@/app/components/ListingsGrid";
import { filterListings, getListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  query?: string | string[];
  location?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  minBedrooms?: string | string[];
  minBathrooms?: string | string[];
}>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumber(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const properties = await getListings();
  const query = getSingleValue(params.query) ?? "";
  const location = getSingleValue(params.location) ?? "";
  const minPrice = getSingleValue(params.minPrice) ?? "";
  const maxPrice = getSingleValue(params.maxPrice) ?? "";
  const minBedrooms = getSingleValue(params.minBedrooms) ?? "";
  const minBathrooms = getSingleValue(params.minBathrooms) ?? "";
  const filteredProperties = filterListings(properties, {
    query,
    location,
    minPrice: parseNumber(minPrice),
    maxPrice: parseNumber(maxPrice),
    minBedrooms: parseNumber(minBedrooms),
    minBathrooms: parseNumber(minBathrooms),
  });
  const locations = Array.from(new Set(properties.map((listing) => listing.location))).sort();
  const hasActiveFilters = Boolean(
    query || location || minPrice || maxPrice || minBedrooms || minBathrooms
  );

  return (
    <main className="min-h-screen bg-[#FFF8F0] px-4 py-8 text-[#4B2E2B] md:px-8">
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
            <div className="flex flex-col gap-4">
              <div className="text-center md:text-left">
                <AdminListingsHeaderActions />
                <p className="mt-6 text-sm uppercase tracking-[0.24em] text-[#FFF8F0]">
                  Property Plug
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[#FFF8F0]">
                  Property Listings
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                  Browse available homes, compare neighborhoods, and explore properties
                  that fit your search.
                </p>
              </div>
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-[#4B2E2B]">No listings yet</h2>
            <p className="mt-3 text-sm text-[#4B2E2B]">
              Your Supabase `listings` table is connected, but it does not have any rows to
              show yet.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                    Search Filters
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#4B2E2B]">
                    Narrow your results
                  </h2>
                  <p className="mt-2 text-sm text-[#4B2E2B]">
                    Search by keyword and refine by location, price, beds, and baths.
                  </p>
                </div>
                <p className="text-sm font-medium text-[#8C5A3C]">
                  Showing {filteredProperties.length} of {properties.length} listings
                </p>
              </div>

              <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6" action="/listings">
                <label className="flex flex-col gap-2 xl:col-span-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Keyword</span>
                  <input
                    type="search"
                    name="query"
                    defaultValue={query}
                    placeholder="City, neighborhood, or feature"
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Location</span>
                  <select
                    name="location"
                    defaultValue={location}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                  >
                    <option value="">All locations</option>
                    {locations.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Min price</span>
                  <input
                    type="number"
                    min="0"
                    name="minPrice"
                    defaultValue={minPrice}
                    placeholder="0"
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Max price</span>
                  <input
                    type="number"
                    min="0"
                    name="maxPrice"
                    defaultValue={maxPrice}
                    placeholder="No limit"
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Min beds</span>
                  <select
                    name="minBedrooms"
                    defaultValue={minBedrooms}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[#4B2E2B]">Min baths</span>
                  <select
                    name="minBathrooms"
                    defaultValue={minBathrooms}
                    className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 text-sm outline-none transition focus:border-[#8C5A3C] focus:ring-2 focus:ring-[#E8C9A8]"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </label>

                <div className="flex flex-col justify-end gap-3 md:flex-row xl:col-span-6">
                  {hasActiveFilters ? (
                    <Link
                      href="/listings"
                      className="inline-flex items-center justify-center rounded-full border border-[#D6B79F] px-5 py-3 text-sm font-medium text-[#8C5A3C] transition hover:border-[#8C5A3C] hover:text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#E8C9A8]"
                    >
                      Clear filters
                    </Link>
                  ) : null}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#E8C9A8]"
                  >
                    Apply filters
                  </button>
                </div>
              </form>
            </section>

            {filteredProperties.length === 0 ? (
              <div className="mt-4 rounded-3xl bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-semibold text-[#4B2E2B]">No matches found</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Try widening your search or clearing a few filters to see more homes.
                </p>
                {hasActiveFilters ? (
                  <Link
                    href="/listings"
                    className="mt-6 inline-flex items-center rounded-full bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#E8C9A8]"
                  >
                    Reset search
                  </Link>
                ) : null}
              </div>
            ) : (
              <ListingsGrid listings={filteredProperties} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
