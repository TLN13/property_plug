"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

export default function DashboardPage() {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
  }, [isLoading, user, role, router]);

  return <p>Loading dashboard...</p>;
}
