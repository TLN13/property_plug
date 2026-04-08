import Link from "next/link";
import Image from "next/image";
import ListingsGrid from "@/app/components/ListingsGrid";
import { getListings } from "@/lib/listings";

export default async function ListingsPage() {
  const properties = await getListings();

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
                <Link
                  href="/dashboard/user"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFF8F0] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition hover:bg-white hover:text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#FFF8F0]"
                >
                  <span aria-hidden="true">&larr;</span>
                  <span>Back to Dashboard</span>
                </Link>
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
          <ListingsGrid listings={properties} />
        )}
      </div>
    </main>
  );
}
