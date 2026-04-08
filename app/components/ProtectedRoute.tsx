"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserRole } from "@/app/firebase/firestore";

export default function ProtectedRoute({
  children,
  requiredRole,
  allowAdminAccess = false,
}: {
  children: React.ReactNode;
  requiredRole: "admin" | "user";
  allowAdminAccess?: boolean;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const check = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = await getUserRole(user.uid);

      const canAccess =
        role === requiredRole ||
        (allowAdminAccess && requiredRole === "user" && role === "admin");

      if (canAccess) {
        setAllowed(true);
      } else {
        router.push("/login");
      }
    };

    check();
  }, [user, isLoading, requiredRole, allowAdminAccess, router]);

  if (isLoading || !allowed) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6 text-lg font-medium"
        style={{ backgroundColor: "#FFF8F0", color: "#4B2E2B" }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
