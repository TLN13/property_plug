"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { getUserRole } from "@/app/firebase/firestore";

export default function DashboardSwitchButton({
  currentDashboard,
  className,
}: {
  currentDashboard: "admin" | "user";
  className?: string;
}) {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    const loadRole = async () => {
      const role = await getUserRole(user.uid);
      setIsAdmin(role === "admin");
    };

    void loadRole();
  }, [isLoading, user]);

  if (isLoading || !isAdmin) {
    return null;
  }

  const href =
    currentDashboard === "admin" ? "/dashboard/user" : "/dashboard/admin";
  const label =
    currentDashboard === "admin"
      ? "Switch to User Dashboard"
      : "Switch to Admin Dashboard";

  return (
    <Link
      href={href}
      className={
        className ??
        "inline-flex items-center rounded-full bg-[#FFF8F0] px-4 py-2 text-sm font-medium text-[#8C5A3C] transition hover:bg-white hover:text-[#4B2E2B] focus:outline-none focus:ring-2 focus:ring-[#FFF8F0]"
      }
    >
      {label}
    </Link>
  );
}
