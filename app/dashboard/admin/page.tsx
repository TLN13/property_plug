import Image from "next/image";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
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
                  Admin Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                  A simple place to manage listings, approvals, property quality, and
                  admin-side activity.
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
                <p className="text-sm text-[#8C5A3C]">Listings</p>
                <h2 className="mt-2 text-2xl font-semibold">0 Active Listings</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Track inventory, publish status, and listing visibility from one place.
                </p>
              </div>
              <div
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm text-[#8C5A3C]">Approvals</p>
                <h2 className="mt-2 text-2xl font-semibold">0 Pending Reviews</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Stay on top of account checks, submissions, and admin review tasks.
                </p>
              </div>
              <div
                className="rounded-3xl p-6 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm text-[#8C5A3C]">Quality</p>
                <h2 className="mt-2 text-2xl font-semibold">0% Verified</h2>
                <p className="mt-3 text-sm text-[#4B2E2B]">
                  Monitor verification progress and keep the platform polished.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div
                className="rounded-3xl p-8 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                  Workspace
                </p>
                <h2 className="mt-3 text-2xl font-semibold">Admin tools are ready</h2>
                <p className="mt-3 max-w-3xl text-sm text-[#4B2E2B]">
                  This dashboard now matches the login and user experience. We can plug
                  your listing management, approvals, analytics, and reporting tools into
                  this layout next.
                </p>
              </div>

              <div
                className="rounded-3xl p-8 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
                  Admin Placeholder
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Future management section goes here
                </h2>
                <div className="mt-6 rounded-3xl border-2 border-dashed border-[#C08552] bg-[#FFF8F0] p-12 text-center">
                  <p className="text-lg font-medium text-[#4B2E2B]">Future admin card</p>
                  <p className="mt-2 text-sm text-[#4B2E2B]">
                    This space is reserved for management tools or analytics.
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
