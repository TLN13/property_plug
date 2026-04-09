"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: "admin" | "user";
}) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user || role !== requiredRole) {
      router.push("/login");
    }
  }, [user, role, isLoading, requiredRole, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user || role !== requiredRole) {
    return <p>Redirecting...</p>;
  }

  return <>{children}</>;
}