import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ScheduledToursView from "@/app/components/ScheduledToursView";

export default function ToursScheduledPage() {
  return (
    <ProtectedRoute requiredRole="user" allowAdminAccess>
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
                    Tours Scheduled
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                    Keep every property visit in one place with a calendar view and quick
                    links back to the listing details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ScheduledToursView />
        </div>
      </main>
    </ProtectedRoute>
  );
}
