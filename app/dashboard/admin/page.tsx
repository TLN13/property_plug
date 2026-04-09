import Image from "next/image";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardSwitchButton from "@/app/components/DashboardSwitchButton";
import { getActiveListingCount } from "@/lib/listings";

export default async function AdminPage() {
  const activeListingCount = await getActiveListingCount();

  return (
    <ProtectedRoute requiredRole="admin">
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
                    Admin Dashboard
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                    A simple place to manage listings and keep admin-side activity in
                    one place.
                  </p>
                  <DashboardSwitchButton
                    currentDashboard="admin"
                    className="mt-5 inline-flex items-center rounded-full bg-[#FFF8F0] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition hover:bg-white hover:text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#FFF8F0]"
                  />
                </div>
                <div className="flex justify-center md:justify-end">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm text-[#8C5A3C]">Listings</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {activeListingCount} Active Listings
                </h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Track inventory, publish status, and listing visibility from one place.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                Workspace
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Admin tools are ready</h2>
              <p className="mt-3 max-w-3xl text-sm text-[#4B2E2B]">
                This dashboard now matches the rest of the product, and we can plug
                listing management, analytics, and reporting tools into this layout next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
