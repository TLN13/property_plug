import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import LogoutButton from "@/app/components/LogoutButton";
import MortgageCalculatorCard from "@/app/components/MortgageCalculatorCard";
import DashboardSwitchButton from "@/app/components/DashboardSwitchButton";

export default function FinancialToolsPage() {
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
                  Financial Tools
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-[#FFF8F0]">
                  Review carrying costs, test down payments, and estimate monthly
                  mortgage payments without leaving your dashboard flow.
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

          <MortgageCalculatorCard />
        </div>
      </div>
    </ProtectedRoute>
  );
}
