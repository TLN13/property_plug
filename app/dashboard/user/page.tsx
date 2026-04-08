import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardSwitchButton from "@/app/components/DashboardSwitchButton";

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user" allowAdminAccess>
      <div className="min-h-screen bg-[#FFF8F0] px-4 py-8 text-[#4B2E2B] md:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
          <div className="flex justify-center">
            <Image
              src="/property-plug-logo.png"
              alt="Property Plug logo"
              width={300}
              height={300}
              priority
              className="h-auto w-full max-w-[290px] object-contain"
            />
          </div>

          <div className="rounded-[2rem] bg-[#C08552] px-8 py-10 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm uppercase tracking-[0.24em] text-[#FFF8F0]">
                  Property Plug
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[#FFF8F0]">
                  User Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                  A simple place to keep track of saved homes, tours, updates, and your
                  future map tools.
                </p>
                <DashboardSwitchButton
                  currentDashboard="user"
                  className="mt-5 inline-flex items-center rounded-full bg-[#FFF8F0] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition hover:bg-white hover:text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#FFF8F0]"
                />
              </div>
              <div className="flex justify-center md:justify-end">
                <LogoutButton />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-[#8C5A3C]">Saved Homes</p>
                <h2 className="mt-2 text-2xl font-semibold">0 Favorites</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Keep your favorite listings in one place and revisit them anytime.
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-[#8C5A3C]">Tours</p>
                <h2 className="mt-2 text-2xl font-semibold">0 Scheduled</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Manage upcoming visits, viewing requests, and follow-ups from here.
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-[#8C5A3C]">Updates</p>
                <h2 className="mt-2 text-2xl font-semibold">0 New Alerts</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Watch price changes, status updates, and new matches that fit your
                  search.
                </p>
              </div>

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
                  Jump into the listings page to explore available homes, compare options,
                  and find properties that match what you are looking for.
                </p>
              </Link>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                  Alberta Map
                </p>
                <h2 className="mt-3 text-2xl font-semibold">Explore Alberta</h2>
                <p className="mt-3 max-w-3xl text-sm text-[#4B2E2B]">
                  This map is centered on Alberta for now, and we can layer mock home
                  locations onto it later.
                </p>
                <div className="mt-6 overflow-hidden rounded-3xl border border-[#D6B79F] bg-[#FFF8F0]">
                  <iframe
                    title="Map of Alberta"
                    src="https://www.google.com/maps?q=Alberta,+Canada&z=5&output=embed"
                    className="h-[380px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
