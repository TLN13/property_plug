"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserRole } from "@/app/firebase/firestore";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole: "admin" | "user";
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

      if (role === requiredRole) {
        setAllowed(true);
      } else {
        router.push("/login");
      }
    };

    check();
  }, [user, isLoading, requiredRole, router]);

  if (isLoading || !allowed) return <p>Loading...</p>;

  return <>{children}</>;
}