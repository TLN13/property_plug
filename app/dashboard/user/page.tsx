import Image from "next/image";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import LogoutButton from "@/app/components/LogoutButton";

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <div
        className="min-h-screen px-4 py-8 md:px-8"
        style={{ backgroundColor: "#FFF8F0", color: "#4B2E2B" }}
      >
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

          <div
            className="rounded-[2rem] px-8 py-10 shadow-sm"
            style={{ backgroundColor: "#C08552" }}
          >
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
              </div>
              <div className="flex justify-center md:justify-end">
                <LogoutButton />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="flex flex-col gap-6">
              <div
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm text-[#8C5A3C]">Saved Homes</p>
                <h2 className="mt-2 text-2xl font-semibold">0 Favorites</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Keep your favorite listings in one place and revisit them anytime.
                </p>
              </div>
              <div
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm text-[#8C5A3C]">Tours</p>
                <h2 className="mt-2 text-2xl font-semibold">0 Scheduled</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Manage upcoming visits, viewing requests, and follow-ups from here.
                </p>
              </div>
              <div
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm text-[#8C5A3C]">Updates</p>
                <h2 className="mt-2 text-2xl font-semibold">0 New Alerts</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Watch price changes, status updates, and new matches that fit your
                  search.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div
                className="rounded-3xl p-8 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                  Welcome In
                </p>
                <h2 className="mt-3 text-2xl font-semibold">Your search space is ready</h2>
                <p className="mt-3 max-w-3xl text-sm text-[#4B2E2B]">
                  This dashboard now uses the same Property Plug color system as the login
                  screen. We can build out saved properties, inquiry history, and
                  personalized recommendations inside this layout next.
                </p>
              </div>

              <div
                className="rounded-3xl p-8 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                  Map Placeholder
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Google Maps section coming here
                </h2>
                <div className="mt-6 rounded-3xl border-2 border-dashed border-[#C08552] bg-[#FFF8F0] p-12 text-center">
                  <p className="text-lg font-medium text-[#4B2E2B]">Future map card</p>
                  <p className="mt-2 text-sm text-[#4B2E2B]">
                    This space is reserved for your Google Maps feature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
